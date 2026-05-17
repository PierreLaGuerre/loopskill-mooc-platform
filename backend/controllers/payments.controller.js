const Stripe = require("stripe");

const db = require("../config/db");
const { sendError, sendSuccess } = require("../utils/http");
const { canAccessRequiredPlan } = require("../utils/plan-access");

const COURSE_PRICES_BY_REQUIRED_PLAN_ID = {
  2: 699,
  3: 1299
};

const DEFAULT_CURRENCY = (process.env.STRIPE_CURRENCY || "eur").toLowerCase();
const DEFAULT_FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4200";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (typeof secretKey !== "string" || secretKey.trim() === "") {
    return null;
  }

  return new Stripe(secretKey.trim());
}

function normalizePositiveInteger(value) {
  const parsedValue = Number(value);

  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return null;
}

function normalizeCheckoutType(value) {
  return value === "course" || value === "plan" ? value : null;
}

function getFrontendUrl() {
  return DEFAULT_FRONTEND_URL.replace(/\/+$/, "");
}

function buildCourseReturnUrls(courseId) {
  const frontendUrl = getFrontendUrl();

  return {
    successUrl: `${frontendUrl}/courses/${courseId}?payment=success`,
    cancelUrl: `${frontendUrl}/courses/${courseId}?payment=cancelled`
  };
}

function buildPlanReturnUrls() {
  const frontendUrl = getFrontendUrl();

  return {
    successUrl: `${frontendUrl}/plans?payment=success`,
    cancelUrl: `${frontendUrl}/plans?payment=cancelled`
  };
}

async function getUserById(userId) {
  const [rows] = await db.query(
    `
      SELECT id, name, email, plan_id AS planId, stripe_customer_id AS stripeCustomerId
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
}

async function getCourseById(courseId) {
  const [rows] = await db.query(
    `
      SELECT
        c.id,
        c.title,
        c.required_plan_id AS requiredPlanId,
        p.name AS requiredPlan
      FROM courses c
      LEFT JOIN plans p
        ON p.id = c.required_plan_id
      WHERE c.id = ?
      LIMIT 1
    `,
    [courseId]
  );

  return rows[0] || null;
}

async function getPlanById(planId) {
  const [rows] = await db.query(
    "SELECT id, name, price, description FROM plans WHERE id = ? LIMIT 1",
    [planId]
  );

  return rows[0] || null;
}

async function getLatestUserSubscription(userId) {
  const [rows] = await db.query(
    `
      SELECT
        id,
        stripe_subscription_id AS stripeSubscriptionId,
        status
      FROM user_subscriptions
      WHERE user_id = ?
      ORDER BY updated_at DESC, id DESC
      LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
}

async function getOrCreateStripeCustomer(stripe, user) {
  if (typeof user.stripeCustomerId === "string" && user.stripeCustomerId.trim() !== "") {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: String(user.id)
    }
  });

  await db.query(
    "UPDATE users SET stripe_customer_id = ? WHERE id = ?",
    [customer.id, user.id]
  );

  return customer.id;
}

async function createPaymentOrder({ userId, type, courseId, planId, amountCents, currency }) {
  const [insertResult] = await db.query(
    `
      INSERT INTO payment_orders
        (user_id, type, course_id, plan_id, amount_cents, currency, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `,
    [userId, type, courseId, planId, amountCents, currency]
  );

  return insertResult.insertId;
}

async function attachCheckoutSessionToOrder(orderId, sessionId) {
  await db.query(
    "UPDATE payment_orders SET stripe_checkout_session_id = ? WHERE id = ?",
    [sessionId, orderId]
  );
}

async function createCourseCheckout(stripe, user, courseId) {
  const course = await getCourseById(courseId);

  if (course == null) {
    return {
      error: {
        statusCode: 404,
        message: "Course not found"
      }
    };
  }

  if (canAccessRequiredPlan(user.planId, course.requiredPlanId)) {
    return {
      error: {
        statusCode: 409,
        message: "Your current plan already includes this course"
      }
    };
  }

  const amountCents = COURSE_PRICES_BY_REQUIRED_PLAN_ID[course.requiredPlanId];

  if (amountCents == null) {
    return {
      error: {
        statusCode: 400,
        message: "This course is not available for individual purchase"
      }
    };
  }

  const [existingPurchases] = await db.query(
    "SELECT id FROM course_purchases WHERE user_id = ? AND course_id = ? LIMIT 1",
    [user.id, course.id]
  );

  if (existingPurchases.length > 0) {
    return {
      error: {
        statusCode: 409,
        message: "You already own this course"
      }
    };
  }

  const orderId = await createPaymentOrder({
    userId: user.id,
    type: "course",
    courseId: course.id,
    planId: null,
    amountCents,
    currency: DEFAULT_CURRENCY
  });
  const customerId = await getOrCreateStripeCustomer(stripe, user);
  const { successUrl, cancelUrl } = buildCourseReturnUrls(course.id);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: DEFAULT_CURRENCY,
          unit_amount: amountCents,
          product_data: {
            name: `${course.title} - lifetime access`,
            description: `Individual access to a ${course.requiredPlan} course`
          }
        }
      }
    ],
    metadata: {
      paymentOrderId: String(orderId),
      userId: String(user.id),
      type: "course",
      courseId: String(course.id)
    },
    payment_intent_data: {
      metadata: {
        paymentOrderId: String(orderId),
        userId: String(user.id),
        type: "course",
        courseId: String(course.id)
      }
    }
  });

  await attachCheckoutSessionToOrder(orderId, session.id);

  return {
    checkoutUrl: session.url
  };
}

async function createPlanCheckout(stripe, user, planId) {
  const plan = await getPlanById(planId);

  if (plan == null) {
    return {
      error: {
        statusCode: 404,
        message: "Plan not found"
      }
    };
  }

  if (plan.id <= user.planId) {
    return {
      error: {
        statusCode: 409,
        message: "This plan is not an upgrade for your account"
      }
    };
  }

  if (Number(plan.price) <= 0) {
    return {
      error: {
        statusCode: 400,
        message: "Free plan does not require checkout"
      }
    };
  }

  const amountCents = Math.round(Number(plan.price) * 100);
  const orderId = await createPaymentOrder({
    userId: user.id,
    type: "plan",
    courseId: null,
    planId: plan.id,
    amountCents,
    currency: DEFAULT_CURRENCY
  });
  const customerId = await getOrCreateStripeCustomer(stripe, user);
  const { successUrl, cancelUrl } = buildPlanReturnUrls();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: DEFAULT_CURRENCY,
          unit_amount: amountCents,
          recurring: {
            interval: "month"
          },
          product_data: {
            name: `LoopSkill ${plan.name}`,
            description: plan.description || `LoopSkill ${plan.name} monthly plan`
          }
        }
      }
    ],
    metadata: {
      paymentOrderId: String(orderId),
      userId: String(user.id),
      type: "plan",
      planId: String(plan.id)
    },
    subscription_data: {
      metadata: {
        paymentOrderId: String(orderId),
        userId: String(user.id),
        type: "plan",
        planId: String(plan.id)
      }
    }
  });

  await attachCheckoutSessionToOrder(orderId, session.id);

  return {
    checkoutUrl: session.url
  };
}

async function markOrderPaid(session, subscription) {
  const orderId = normalizePositiveInteger(session.metadata?.paymentOrderId);

  if (orderId == null) {
    return null;
  }

  await db.query(
    `
      UPDATE payment_orders
      SET
        status = 'paid',
        stripe_payment_intent_id = ?,
        stripe_subscription_id = ?
      WHERE id = ?
    `,
    [session.payment_intent || null, session.subscription || null, orderId]
  );

  if (session.metadata?.type === "course") {
    await db.query(
      `
        INSERT IGNORE INTO course_purchases
          (user_id, course_id, payment_order_id)
        VALUES (?, ?, ?)
      `,
      [
        normalizePositiveInteger(session.metadata.userId),
        normalizePositiveInteger(session.metadata.courseId),
        orderId
      ]
    );
  }

  if (session.metadata?.type === "plan") {
    const userId = normalizePositiveInteger(session.metadata.userId);
    const planId = normalizePositiveInteger(session.metadata.planId);

    await db.query(
      "UPDATE users SET plan_id = ? WHERE id = ?",
      [planId, userId]
    );

    if (session.subscription != null) {
      const currentPeriodEnd = subscription?.current_period_end == null
        ? null
        : new Date(subscription.current_period_end * 1000);

      await db.query(
        `
          INSERT INTO user_subscriptions
            (user_id, plan_id, stripe_subscription_id, status, current_period_end)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            user_id = VALUES(user_id),
            plan_id = VALUES(plan_id),
            status = VALUES(status),
            current_period_end = VALUES(current_period_end)
        `,
        [
          userId,
          planId,
          session.subscription,
          subscription?.status || "active",
          currentPeriodEnd
        ]
      );
    }
  }

  return orderId;
}

exports.createCheckout = async (req, res) => {
  const stripe = getStripeClient();

  if (stripe == null) {
    return sendError(res, 500, "Stripe is not configured");
  }

  const type = normalizeCheckoutType(req.body.type);

  if (type == null) {
    return sendError(res, 400, "Validation failed", {
      type: "Checkout type must be course or plan"
    });
  }

  try {
    const user = await getUserById(req.authUser.id);

    if (user == null) {
      return sendError(res, 404, "User not found");
    }

    const result = type === "course"
      ? await createCourseCheckout(stripe, user, normalizePositiveInteger(req.body.courseId))
      : await createPlanCheckout(stripe, user, normalizePositiveInteger(req.body.planId));

    if (result.error != null) {
      return sendError(res, result.error.statusCode, result.error.message);
    }

    return sendSuccess(res, 201, "Checkout session created successfully", {
      checkoutUrl: result.checkoutUrl
    });
  } catch (error) {
    return sendError(res, 500, "Could not create checkout session");
  }
};

exports.handleWebhook = async (req, res) => {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (stripe == null || typeof webhookSecret !== "string" || webhookSecret.trim() === "") {
    return sendError(res, 500, "Stripe webhook is not configured");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      webhookSecret.trim()
    );
  } catch (error) {
    return sendError(res, 400, "Invalid Stripe webhook signature");
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const subscription = session.subscription == null
        ? null
        : await stripe.subscriptions.retrieve(session.subscription);

      await markOrderPaid(session, subscription);
    }

    return sendSuccess(res, 200, "Stripe webhook processed", {
      received: true
    });
  } catch (error) {
    return sendError(res, 500, "Could not process Stripe webhook");
  }
};

exports.cancelSubscription = async (req, res) => {
  const stripe = getStripeClient();

  try {
    const user = await getUserById(req.authUser.id);

    if (user == null) {
      return sendError(res, 404, "User not found");
    }

    if (user.planId <= 1) {
      return sendError(res, 409, "Free plan does not have an active subscription");
    }

    const subscription = await getLatestUserSubscription(user.id);

    if (
      stripe != null &&
      subscription?.stripeSubscriptionId != null &&
      subscription.stripeSubscriptionId.trim() !== ""
    ) {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    }

    await db.query(
      "UPDATE user_subscriptions SET status = 'cancelled' WHERE user_id = ?",
      [user.id]
    );

    await db.query(
      "UPDATE users SET plan_id = 1 WHERE id = ?",
      [user.id]
    );

    return sendSuccess(res, 200, "Subscription cancelled successfully", null);
  } catch (error) {
    return sendError(res, 500, "Could not cancel subscription");
  }
};

ALTER TABLE users
  ADD COLUMN stripe_customer_id varchar(255) DEFAULT NULL AFTER plan_id,
  ADD UNIQUE KEY stripe_customer_id (stripe_customer_id);

CREATE TABLE payment_orders (
  id int(11) NOT NULL AUTO_INCREMENT,
  user_id int(11) NOT NULL,
  type enum('course','plan') NOT NULL,
  course_id int(11) DEFAULT NULL,
  plan_id int(11) DEFAULT NULL,
  amount_cents int(11) NOT NULL,
  currency varchar(3) NOT NULL DEFAULT 'eur',
  stripe_checkout_session_id varchar(255) DEFAULT NULL,
  stripe_payment_intent_id varchar(255) DEFAULT NULL,
  stripe_subscription_id varchar(255) DEFAULT NULL,
  status enum('pending','paid','cancelled','failed') NOT NULL DEFAULT 'pending',
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY stripe_checkout_session_id (stripe_checkout_session_id),
  KEY user_id (user_id),
  KEY course_id (course_id),
  KEY plan_id (plan_id),
  CONSTRAINT payment_orders_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT payment_orders_course_fk FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE SET NULL,
  CONSTRAINT payment_orders_plan_fk FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE course_purchases (
  id int(11) NOT NULL AUTO_INCREMENT,
  user_id int(11) NOT NULL,
  course_id int(11) NOT NULL,
  payment_order_id int(11) NOT NULL,
  purchased_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY user_course_unique (user_id, course_id),
  KEY course_id (course_id),
  KEY payment_order_id (payment_order_id),
  CONSTRAINT course_purchases_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT course_purchases_course_fk FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
  CONSTRAINT course_purchases_payment_order_fk FOREIGN KEY (payment_order_id) REFERENCES payment_orders (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE user_subscriptions (
  id int(11) NOT NULL AUTO_INCREMENT,
  user_id int(11) NOT NULL,
  plan_id int(11) NOT NULL,
  stripe_subscription_id varchar(255) NOT NULL,
  status varchar(50) NOT NULL,
  current_period_end timestamp NULL DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY stripe_subscription_id (stripe_subscription_id),
  KEY user_id (user_id),
  KEY plan_id (plan_id),
  CONSTRAINT user_subscriptions_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT user_subscriptions_plan_fk FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

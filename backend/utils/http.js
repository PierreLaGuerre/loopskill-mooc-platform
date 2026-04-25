function sendError(res, statusCode, message, details) {
  const payload = {
    success: false,
    message
  };

  if (details != null) {
    payload.details = details;
  }

  return res.status(statusCode).json(payload);
}

function sendSuccess(res, statusCode, message, data) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function sendUserResponse(res, statusCode, message, user, token) {
  const payload = {
    success: true,
    message,
    user
  };

  if (token != null) {
    payload.token = token;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  sendError,
  sendSuccess,
  sendUserResponse
};

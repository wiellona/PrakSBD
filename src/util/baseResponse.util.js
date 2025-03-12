const baseRespones = (res, success, status, message, payload) => {
  res.status(status).json({
    success,
    message,
    payload,
  });
};

module.exports = baseRespones;

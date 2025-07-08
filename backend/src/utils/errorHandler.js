
// add in app.use in app file - this will convert the api error in json format
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (typeof err.toJSON === "function") {
    return res.status(statusCode).json(err.toJSON());
  }

  // fallback if error is not instance of ApiError
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    errors: [],
    data: null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

export { errorHandler };
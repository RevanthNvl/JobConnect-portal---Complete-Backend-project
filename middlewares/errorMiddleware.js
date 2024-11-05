// error middleware
const errorMiddleware = (err, req, resp, next) => {
    console.log(err);

    // Default error response
    const defaultErrors = {
        statusCode: 500,
        message: 'Something went wrong',
    };

    // Handle specific error types
    if (err.name === 'ValidationError') {
        defaultErrors.statusCode = 400;
        defaultErrors.message = Object.values(err.errors).map((item) => item.message).join(", ");
    } else if (err.message) {
        // If a specific error message is provided, use it
        defaultErrors.message = err.message;
    }

    // Send the response once with all details
    resp.status(defaultErrors.statusCode).json({
        success: false,
        message: defaultErrors.message,
        error: err,
    });
};

export default errorMiddleware;

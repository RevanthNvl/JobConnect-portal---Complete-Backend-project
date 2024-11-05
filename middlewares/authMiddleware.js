import JWT from 'jsonwebtoken';

const userAuth = async (req, resp, next) => {
    const authHeader = req.headers.authorization;

    // Ensure the authHeader exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next('Authorization failed');
    }

    // Extract token from 'Bearer <token>'
    const token = authHeader.split(' ')[1];

    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET);

        req.user = { userId: payload.userId };
        next();
    } catch (error) {
        next('Authorization failed');
    }
};

export default userAuth;

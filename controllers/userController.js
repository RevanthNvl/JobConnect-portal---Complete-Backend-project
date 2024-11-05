import userModel from "../models/userModel.js";

export const updateUserController = async (req, resp, next) => {
    try {
        const { firstName, lastName, email, location } = req.body;

        if (!firstName || !lastName || !email || !location) {
            return next("Please provide all fields");  // Stop further code execution on error
        }

        const user = await userModel.findOne({ _id: req.user.userId });

        // Update user details
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.location = location;

        await user.save();

        // Assuming token generation if required:
        const token = user.createJWT ? user.createJWT() : null;

        resp.status(200).json({
            success: true,
            user,
            token,  // Include token only if created
        });
    } catch (error) {
        next(error);  // Forward errors to error handling middleware
    }
};

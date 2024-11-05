import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
    try {
        // Ensure the request body uses `firstName` and `lastName`
        const { firstName, lastName, email, password } = req.body;

        // Validation and handling custom errors
        if (!(firstName && lastName)) {
            next("Please provide first name and last name")
        }
        if (!email) {
            next('Please provide a valid email')
        }
        if (!password) {
            next('Please provide a password')
        }

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            next('Email already registered')
        }

        // Create new user
        const user = await userModel.create({ firstName, lastName, email, password });

        // jwt token creation 
        const token = user.createJWT()

        res.status(201).send({
            success: true,
            message: 'User created successfully',
            user:{
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location
            },
            token
        });
    } catch (error) {
        next(error)
    }
};

export const loginController = async (req, resp, next) => {
    try{
        const {email, password} = req.body

        // Validation
        if(!email || !password){
            next('Please provide all the fields')
        }
        //find user by email
        const user = await userModel.findOne({email})
        if(!user){
            next('Invalid username or password')
        }
        // compare password
        const isMatch = await user.comparePassword(password)

        if(!isMatch){
            next('Invalid username or password')
        }

        const token = user.createJWT()
        resp.status(200).json({
            success:true,
            message:'Login Successful',
            user:{
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location
            },
            token
        })
    } catch(error){
        next(error)
    }
}
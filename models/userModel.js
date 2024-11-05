import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
//schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'It is a rquired field!!']
    },
    lastName: {
        type: String,
        required: [true, 'It is a rquired field!!']
    },
    email: {
        type: String,
        required: [true, 'Email is rquired!!'],
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, 'Password is a rquired field!!'],
        minLength: [6, 'password length should be minimum of 6 characters'],
        select:true
    },
    location: {
        type: String,
        default: "India"
    }
}, { timestamps: true }
)

// middlewears
userSchema.pre('save', async function(){
    if(!this.isModified){return}
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
}) //Here arrow func doesn't work, that is why we used normal function

// function to compare password
userSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword, this.password)
    return isMatch
}


// JSON Webtoken
userSchema.methods.createJWT = function(){
    return JWT.sign({userId:this._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
    
}

export default mongoose.model('User', userSchema)
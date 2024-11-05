import mongoose from 'mongoose'
import colors from 'colors'

// Connect to MongoDB
const connectDB = async() => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log(`Connected to MongoDB database ${mongoose.connection.host}`);
    })
    .catch((error) => {
        console.error('Connection error'.bgRed.white, error);
    }
    );
}

export default connectDB
//or
// module.exports = {connectDB} also works
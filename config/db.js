const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoUrl');

const connectDB = async() => {
    try {
        await mongoose.connect(db, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('<< Database Connected >>');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
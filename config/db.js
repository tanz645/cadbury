const mongoose = require('mongoose');
const config = require('config');
const db = config.get('DATABASE_URL');

const connectDB = async () => {
    try{
        // mongoose.set('useCreateIndex', true);
        await mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('MoongoDB connection successful!');
    }catch(err){
        console.log('500 Error!, rejection - connection failure!', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
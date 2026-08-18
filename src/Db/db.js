const mongoose = require("mongoose");

async function connectDb(){
    try{
    await mongoose.connect(process.env.MONGO_STRING);
    console.log("Database is connected successfully");
    }
    catch(err){
        console.error("Database connection failed:", err.message);
        throw err;
    }
}

module.exports = connectDb

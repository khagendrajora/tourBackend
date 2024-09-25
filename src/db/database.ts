import mongoose from "mongoose";

mongoose.connect(process.env.DATABASE as string)
    .then(() => console.log('database Connected'))
    .catch(err => console.log('Database connection failed', err))
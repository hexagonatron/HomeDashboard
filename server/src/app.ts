import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import routes from './routes/routes';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(routes)

mongoose.connect(MONGODB_URI,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () =>{
        console.log(`Server running on ${PORT}`);
    });
});
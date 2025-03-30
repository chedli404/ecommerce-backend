import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import authRouter from './routes/authRouter.js';


dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const app = express();

app.use(cors({
    origin: ['https://ecommerce-backend-5-irs9.onrender.com'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);


app.use('*', (req, res) => {
    res.status(404).json({message: 'Route or Method incorrect'});
});

const PORT = process.env.PORT || 4000; // Change 3001 to 4000 or another available port

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});







import express from 'express';
import cors from 'cors';
import multer from 'multer';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import attendenceRoutes from './routes/attendenceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import payslipsRouter from './routes/payslipsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import "dotenv/config";
import{serve} from "inngest/express"
import {inngest,functions} from "./inngest/index.js"


const app = express();

const PORT = process.env.PORT || 4000;


//middleware
app.use(cors());
app.use(express.json());
app.use(multer().none());

//routes

app.get('/', (req, res) => {
    res.send('Server is running...');
})

app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/attendence', attendenceRoutes)
app.use('/api/leaves', leaveRoutes)
app.use('/api/payslips', payslipsRouter)
app.use('/api/dashboard', dashboardRoutes)
app.use("/api/inngest", serve({ client: inngest, functions }));


await connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
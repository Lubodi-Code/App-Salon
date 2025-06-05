import express from 'express';
import serviceRoutes from './routes/servicesRoutes..js';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import colors from 'colors';
import { db } from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

// Middleware para parsear JSON
app.use(express.json());

db();
// COnfiguración de CORS

const whitelist = [process.env.FRONTEND_URL];
if(process.argv[2] === '--postman'){
    whitelist.push(undefined);
}

const constOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS '));
            console.log(colors.red.bgRed('No permitido por CORS'));
        }
    }
}
app.use(cors(constOptions))
   

app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(colors.blue.bgBlue(`Servidor corriendo en el puerto ${PORT}`));
});
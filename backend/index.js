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

// ...existing code...

const whitelist = [process.env.FRONTEND_URL];

// Añadir URLs adicionales solo en desarrollo
if (process.env.NODE_ENV === 'development') {
    whitelist.push('http://localhost:5173');
    whitelist.push('http://localhost:4000');
}

const corsOptions = {
    origin: function (origin, callback) {
        // Solo permitir orígenes en la whitelist
        if (whitelist.includes(origin)) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
};

app.use(cors(corsOptions));
// ...existing code...
dotenv.config();

app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(colors.blue.bgBlue(`Servidor corriendo en el puerto ${PORT}`));
});
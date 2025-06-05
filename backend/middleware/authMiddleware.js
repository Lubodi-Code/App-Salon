import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
    // Obtener el token del encabezado de autorización
    const token = req.header('Authorization')?.split(' ')[1];

    // Verificar si el token existe
    if (!token) {
        return res.status(401).json({ msg: 'Token no válido o no proporcionado' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password -token -verified  -__v');
        if (!req.user) {
            return res.status(401).json({ msg: 'Token no válido' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'Token no válido' });
    }
};

export default authMiddleware;
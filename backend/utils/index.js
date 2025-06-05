import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import dotenv from 'dotenv';

function validateObjectId(id, res) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'El id no es válido' });
    }
}

function handleNotFoundError(message, res) {
    const error = new Error(message);
    return res.status(404).json({ msg: message });
}

const genereteJWT = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    return token;
};

function uniqueID() {
    return Date.now().toString(36) + Math.random().toString(36);
}

const formatDate = (date) => {
    return format(new Date(date), 'PPPP', { locale: es });
};

export default {
    validateObjectId,
    handleNotFoundError,
    uniqueID,
    genereteJWT,
    formatDate
};
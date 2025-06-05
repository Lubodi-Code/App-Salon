import express from 'express';
import { register, login, verifyAccount, user, admin } from '../controlers/authController.js';
import { forgotPassword, verifyPasswordReset, updatePassword} from '../controlers/authController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/verify/:token', verifyAccount);

// Área Privada - Requiere un JWT válido
router.get('/user', authMiddleware, user);
router.get('/admin', authMiddleware, adminMiddleware, admin);

router.post('/forgot-password', forgotPassword);
router.route('/reset-password/:token').get(verifyPasswordReset).post(updatePassword); // Assuming you have a reset password controller
export default router;
import express from 'express';
import {createAppointment, getAppointmentsByDate, getAppointmentsById,updateAppointment, deleteAppointment} from '../controlers/appointmentController.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').post(authMiddleware, createAppointment);
router.route('/').post(authMiddleware, createAppointment);
router.route('/').get(authMiddleware, getAppointmentsByDate);
router.route('/:id').get(authMiddleware, getAppointmentsById);
router.route('/:id').put(authMiddleware, updateAppointment);
router.route('/:id').delete(authMiddleware, deleteAppointment);
export default router;
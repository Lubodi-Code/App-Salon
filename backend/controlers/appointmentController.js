import Appointment from '../models/Appointment.js';
import { parse, formatISO, startOfDay, endOfDay, isValid } from 'date-fns';
import { sendEmailNewAppointment, sendEmailCancelAppointment, sendEmailUpdateAppointment } from '../emails/appointmentEmailService.js';
/**
 * Controlador para manejar las citas
 * @module controllers/appointmentController
 */
const createAppointment = async (req, res) => {
  const appointmentData = req.body;
  appointmentData.user = req.user._id.toString();
  
  const appointmentDate = new Date(appointmentData.date);
  
  try {
    const existing = await Appointment.findOne({
      date: {
        $gte: startOfDay(appointmentDate),
        $lt: endOfDay(appointmentDate)
      },
      time: appointmentData.time
    });
    
    if (existing) {
      return res.status(409).json({ msg: 'La hora ya está reservada' });
    }
    
    const newAppointment = new Appointment(appointmentData);
    await newAppointment.save();
    
    // Corrección: Usar appointmentDate en lugar de date
       await sendEmailNewAppointment(appointmentDate, appointmentData.time);
    
    return res.status(201).json({ msg: 'Cita creada exitosamente' });
    
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ msg: 'Error creating appointment' });
  }
};

 const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ msg: 'Error fetching appointments' });
  }
};

const getAppointmentsByDate = async (req, res) => {
  const { date } = req.query;
  
  const newDate = parse(date, 'dd/MM/yyyy', new Date());
  const isoDate = formatISO(newDate);

  if(!isValid(newDate)){
    return res.status(400).json({ msg: 'La fecha no es válida' });
  }
  const appointments = await Appointment.find({
    date: {
      $gte: startOfDay(new Date(isoDate)),
      $lt: endOfDay(new Date(isoDate)),
    },
  }).select('time')

  res.status(200).json(appointments);
};

const getAppointmentsById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id).populate('services');
    
    if (!appointment) {
      return res.status(404).json({ msg: 'Cita no encontrada' });
    }

    // Validar que el usuario que solicita sea el dueño de la cita
    if (!req.user.admin && appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'No tienes permiso para ver esta cita' });
    }

    res.status(200).json(appointment);
  }
  catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ msg: 'Error fetching appointment' });
  }
}

 const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const appointmentData = req.body;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Cita no encontrada' });
    }
    // Validar que el usuario que solicita sea el dueño de la cita
    if (!req.user.admin && appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'No tienes permiso para actualizar esta cita' });
    }
    // Verificación previa: buscar si ya existe una cita para la misma fecha y hora
    const existing = await Appointment
      .findOne({
        _id: { $ne: id }, // Excluir la cita actual
        date: {
          $gte: startOfDay(new Date(appointmentData.date)),
          $lt: endOfDay(new Date(appointmentData.date))
        },
        time: appointmentData.time
      });
    if (existing) {
      return res.status(409).json({ msg: 'La hora ya está reservada' });
    }
    // Actualizar la cita
    appointment.services = appointmentData.services;
    appointment.date = new Date(appointmentData.date);
    appointment.time = appointmentData.time;
    await appointment.save();
    // Enviar correo electrónico de actualización
    await sendEmailUpdateAppointment(appointment.date, appointment.time);
    // Responder con éxito
    res.status(200).json({ msg: 'Cita actualizada exitosamente' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ msg: 'Error updating appointment' });
  }
};

 const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Cita no encontrada' });
    }
    // Validar que el usuario que solicita sea el dueño de la cita
    if (!req.user.admin && appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'No tienes permiso para eliminar esta cita' });
    }

    // Eliminar la cita
    await Appointment.findByIdAndDelete(id);
    // Enviar correo electrónico de cancelación
    await sendEmailCancelAppointment(appointment.date, appointment.time);

    res.status(200).json({ msg: 'Cita eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ msg: 'Error deleting appointment' });
  }
};

// Exporta las funciones que necesites
export {
  createAppointment,
  getAppointments,
  getAppointmentsByDate,
  getAppointmentsById,
  updateAppointment,
  deleteAppointment
};
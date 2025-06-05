import Appointment from "../models/Appointment.js";
import mongoose from "mongoose";
import { startOfDay, endOfDay } from 'date-fns';


const getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.user;

    console.log('----DEBUG INFO----');
    console.log('Usuario autenticado:', req.user);
    console.log('Es admin?:', req.user.admin);
    console.log('userId solicitado:', userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "El ID de usuario no es válido" });
    }
    
    // Solo verificamos permisos si no es admin
    if(!req.user.admin && userId !== req.user._id.toString()){
      return res.status(403).json({ msg: "No tienes permiso para ver estas citas" });
    }
    
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0') + ":00";
    
    // Si es admin, solo aplicamos ordenamiento
    // Si no es admin, aplicamos filtros de usuario y fecha
    const filter = req.user.admin ? {} : {
      user: userId,
      $or: [
        { date: { $gt: endOfDay(now) } },
        {
          date: {
            $gte: startOfDay(now),
            $lte: endOfDay(now)
          },
          time: { $gt: currentHour }
        }
      ]
    };

    console.log('Filtro aplicado:', filter);
    
    const appointments = await Appointment.find(filter)
      .populate("services")
      .populate("user", "name email") // Agregamos populate de usuario para ver quién tiene la cita
      .sort({ date: 1, time: 1 });
    
    console.log('Número de citas encontradas:', appointments.length);
         
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error en getUserAppointments:', error);
    return res.status(500).json({ msg: "Error fetching user appointments" });
  }
};

export {
  getUserAppointments,

};
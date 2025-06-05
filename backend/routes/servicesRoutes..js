import express from 'express';
import { getServices, createService, getServiceById, updateServiceById, deleteServiceById } from '../controlers/servicesController.js';
const router = express.Router();

router.route('/')
    .get(getServices) // Obtener todos los servicios
    .post(createService); // Crear un nuevo servicio
router.route('/:id')
    .get(getServiceById) // Obtener un servicio por ID
    .put(updateServiceById) // Actualizar un servicio por ID
    .delete(deleteServiceById); // Eliminar un servicio por ID

export default router;
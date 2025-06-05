import { services } from '../data/beautyServices.js';
import Service from '../models/Services.js';
import validate from '../utils/index.js';

const getServices = async (req, res) => {
    try {
      const services = await Service.find({});
      res.json(services);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Error al obtener los servicios' });
    }
  };



const createService = async (req, res) => {
    if (Object.values(req.body).includes('')) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }
    try {
        const service = new Service(req.body);
        const result = await service.save();
        res.json({ msg: 'Servicio creado correctamente', service: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al crear el servicio' });
    }
};

const getServiceById = async (req, res) => {
    const invalid = validate.validateObjectId(req.params.id, res);
    if (invalid) return;

    const service = await Service.findById(req.params.id);
    if (!service) {
        return validate.handleNotFoundError('El servicio no existe', res);
    }
    res.json(service);
};

const updateServiceById = async (req, res) => {
    const invalid = validate.validateObjectId(req.params.id, res);
    if (invalid) return;

    const service = await Service.findById(req.params.id);
    if (!service) {
        return validate.handleNotFoundError('El servicio no existe', res);
    }

    // Solo se actualizan los campos "name" y "price"
    const { name, price } = req.body;
    if (name !== undefined) service.name = name;
    if (price !== undefined) service.price = price;

    const result = await service.save();
    res.json(result);
};

const deleteServiceById = async (req, res) => {
    const invalid = validate.validateObjectId(req.params.id, res);
    if (invalid) return;

    const service = await Service.findById(req.params.id);
    if (!service) {
        return validate.handleNotFoundError('El servicio no existe', res);
    }

    await service.deleteOne();
    res.json({ msg: 'Servicio eliminado correctamente' });
};

export {
    getServices,
    createService,
    getServiceById,
    updateServiceById,
    deleteServiceById
};

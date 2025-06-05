import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: "Nombre del servicio",
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
});
const Service = mongoose.model("Services", serviceSchema);

export default Service;
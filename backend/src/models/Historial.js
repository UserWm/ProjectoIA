import mongoose from "mongoose";

const historialSchema = new mongoose.Schema({
    busqueda: { type: String, required: true },
    resultado: { type: String, required: true },
    tipo_producto: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

export default mongoose.model("Historial", historialSchema);

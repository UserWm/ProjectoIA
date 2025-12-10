import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema({
    cliente_id: { type: String, required: true, unique: true },
    nombre: String,
    email: String,
    telefono: String,
    fecha_registro: Date,
    edad: Number,
    sexo: String,
    ciudad: String,
    fuente_adquisicion: String
});

export default mongoose.model("Cliente", ClienteSchema);

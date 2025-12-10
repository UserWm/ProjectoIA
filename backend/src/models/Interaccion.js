import mongoose from "mongoose";

const InteraccionSchema = new mongoose.Schema({
    evento_id: { type: String, required: true, unique: true },
    cliente_id: String,
    fecha: Date,
    tipo_evento: String,
    valor_evento: Number
});

export default mongoose.model("Interaccion", InteraccionSchema);

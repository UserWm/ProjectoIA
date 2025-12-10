import mongoose from "mongoose";

const ComentarioSchema = new mongoose.Schema({
    comentario_id: { type: String, required: true, unique: true },
    cliente_id: { type: String, default: null },
    texto: String,
    fecha: Date,
    plataforma: String
});

export default mongoose.model("Comentario", ComentarioSchema);

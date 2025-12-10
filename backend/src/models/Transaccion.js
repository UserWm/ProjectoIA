import mongoose from "mongoose";

const TransaccionSchema = new mongoose.Schema({
    trans_id: { type: String, required: true, unique: true },
    cliente_id: String,
    fecha: Date,
    monto: Number,
    items: Number,
    categoria_producto: String,
    canal_venta: String
});

export default mongoose.model("Transaccion", TransaccionSchema);

import mongoose from "mongoose";

const ProductoSchema = new mongoose.Schema({
    producto_id: { type: String, required: true, unique: true },
    nombre: String,
    categoria: String,
    precio: Number,
    stock: Number
});

export default mongoose.model("Producto", ProductoSchema);

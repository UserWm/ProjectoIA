import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import productosRoutes from "./src/routes/productos.routes.js";
import generadorRoutes from "./src/routes/generador.routes.js";
import historialRoutes from "./src/routes/historial.routes.js";
import afichesRoutes from "./src/routes/afiches.routes.js";
import historialAfichesRoutes from "./src/routes/historial-afiches.routes.js";
import afichesImageRoutes from "./src/routes/afichesImage.routes.js";
import afichesWebRoutes from "./src/routes/afichesweb.routes.js";
import otrosArtesRoutes from "./src/routes/otros-artes.routes.js";
import otrosArtesImagenRoutes from "./src/routes/otros-artes-imagen.routes.js";
import esloganesRoutes from "./src/routes/esloganes.routes.js";
import speechRoutes from "./src/routes/speech.routes.js";
import comentarioRoutes from "./src/routes/comentario.routes.js";
import clienteRoutes from "./src/routes/cliente.routes.js";
const app = express();

app.use(cors({
    origin: "*",     
    methods: "GET,POST",
}));

app.use(express.json());

connectDB();

app.use("/api", uploadRoutes);
//llenar select de productos reales
app.use("/api/productos", productosRoutes);
//texto publicitario
app.use("/api/crear-texto", generadorRoutes);
//historial de texto publicitario
app.use("/api/historial-texto", historialRoutes);
//afiches
app.use("/api/crear-afiche", afichesRoutes);
//historial de afiches
app.use("/api/historial-afiches", historialAfichesRoutes);
//afiche imagen
app.use("/api/crear-afiche-imagen", afichesImageRoutes);
//afiches web
app.use("/api/afiches-web", afichesWebRoutes);
//artes
app.use("/api/otros-artes", otrosArtesRoutes);
//artes imagenes
app.use("/api/otros-artes-imagen", otrosArtesImagenRoutes);
//esloganes
app.use("/api/esloganes", esloganesRoutes);
//speech
app.use("/api/speech", speechRoutes); 
//comentarios
app.use("/api/comentarios", comentarioRoutes);
//segmentacion de clientes
app.use("/api/clientes", clienteRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor backend corriendo en puerto: ${PORT}`));

import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("❌ Error al conectar:", error);
        process.exit(1);
    }
};

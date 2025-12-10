import { Router } from "express";
import Cliente from "../models/Cliente.js";
import { openai } from "../services/chatgpt.service.js";

const router = Router();

// Obtener todas las ciudades únicas
router.get("/ciudades", async (req, res) => {
    try {
        const ciudades = await Cliente.distinct("ciudad");
        res.json(ciudades);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener ciudades" });
    }
});

// Obtener todas las fuentes de adquisición únicas
router.get("/fuentes", async (req, res) => {
    try {
        const fuentes = await Cliente.distinct("fuente_adquisicion");
        res.json(fuentes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener fuentes" });
    }
});

// Analizar segmento
router.post("/analizar-segmento", async (req, res) => {
    try {
        const { edadMin, edadMax, sexo, ciudad, fuente } = req.body;

        // Construir filtros
        const filtros = {};
        if (edadMin) filtros.edad = { ...filtros.edad, $gte: Number(edadMin) };
        if (edadMax) filtros.edad = { ...filtros.edad, $lte: Number(edadMax) };
        if (sexo) filtros.sexo = sexo;
        if (ciudad) filtros.ciudad = ciudad;
        if (fuente) filtros.fuente_adquisicion = fuente;

        // Obtener clientes filtrados
        const clientes = await Cliente.find(filtros).lean();

        if (!clientes.length) {
            return res.json({ clientes: [], analisis: "No hay clientes que cumplan los filtros." });
        }

        // Crear prompt para IA
        const prompt = `
Analiza el siguiente segmento de clientes de manera detallada. 
Incluye estadísticas y resúmenes sobre edad, sexo, ciudad y fuente de adquisición.
Formato: lista de insights, porcentajes y recomendaciones.

Clientes:
${clientes.map(c => JSON.stringify(c)).join("\n")}
`;

        // Llamada a OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        });

        const analisis = completion.choices[0].message.content;

        res.json({ clientes, analisis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al analizar segmento" });
    }
});

export default router;

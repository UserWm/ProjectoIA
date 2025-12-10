import { Router } from "express";
import Comentario from "../models/Comentario.js";
import { openai } from "../services/chatgpt.service.js";

const router = Router();

// Obtener plataformas únicas
router.get("/plataformas", async (req, res) => {
    try {
        const plataformas = await Comentario.distinct("plataforma");
        res.json(plataformas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener plataformas" });
    }
});

// Analizar comentarios
router.post("/analizar", async (req, res) => {
    try {
        const { plataforma, fechaInicio, fechaFin, palabrasClave } = req.body;

        // Filtros
        let filtro = {};
        if (plataforma) filtro.plataforma = plataforma;
        if (fechaInicio || fechaFin) filtro.fecha = {};
        if (fechaInicio) filtro.fecha.$gte = new Date(fechaInicio);
        if (fechaFin) filtro.fecha.$lte = new Date(fechaFin);
        if (palabrasClave) filtro.texto = { $regex: palabrasClave.split(',').join('|'), $options: 'i' };

        const comentarios = await Comentario.find(filtro).lean();

        if (comentarios.length === 0) {
            return res.json({ mensaje: "No se encontraron comentarios con esos filtros", comentarios: [], analisis: "" });
        }

        // Prompt para la IA
        const prompt = `
Analiza los siguientes comentarios de clientes y genera un resumen con:
- Aspectos positivos
- Aspectos negativos
- Recomendaciones
- Porcentaje de comentarios positivos, neutrales y negativos

Comentarios:
${comentarios.map(c => `- ${c.texto}`).join("\n")}
        `;

        // ✅ Cambio principal: usar chat.completions.create()
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500
        });

        const analisis = gptResponse.choices[0].message.content;

        res.json({ comentarios, analisis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al analizar comentarios" });
    }
});

// Analizar sentimientos por plataforma
router.post("/analizar-sentimientos", async (req, res) => {
  try {
    const { plataforma } = req.body;

    // Filtrar comentarios por plataforma si se seleccionó alguna
    const query = {};
    if (plataforma) query.plataforma = plataforma;

    const comentarios = await Comentario.find(query);

    if (!comentarios.length) {
      return res.json({ comentarios: [], analisis: "", sentimientos: { positivo: 0, neutral: 0, negativo: 0 } });
    }

    // Concatenar todos los comentarios en un solo texto para la IA
    const textos = comentarios.map(c => c.texto).join("\n");

    // Generar análisis con OpenAI
    const prompt = `
Analiza los siguientes comentarios y proporciona un resumen del sentimiento general:
- Indica qué porcentaje es positivo, neutral y negativo
- Devuelve un objeto JSON así: {"positivo": X, "neutral": Y, "negativo": Z}
Comentarios:
${textos}
-Tambien un breve resumen del analisis de sentimientos que se preveen pero siempre para mejorar el negocio.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    const iaResponse = completion.choices[0].message.content;

    // Intentar parsear la respuesta JSON de la IA
    let sentimientos = { positivo: 0, neutral: 0, negativo: 0 };
    try {
      sentimientos = JSON.parse(iaResponse.match(/\{[\s\S]*\}/)[0]);
    } catch (e) {
      console.error("Error parseando sentimientos:", e);
    }

    // Resumen textual (puede usarse para mostrar en PDF)
    const analisis = `Análisis de comentarios para la plataforma: ${plataforma || "Todas"}\n\nTotal de comentarios: ${comentarios.length}\nPositivo: ${sentimientos.positivo}\nNeutral: ${sentimientos.neutral}\nNegativo: ${sentimientos.negativo}`;

    res.json({ comentarios, analisis, sentimientos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al analizar sentimientos" });
  }
});
export default router;

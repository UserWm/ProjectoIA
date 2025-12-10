import { Router } from "express";
import { openai } from "../services/chatgpt.service.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { headline, texto, cta, estilo } = req.body;

        const prompt = `
Diseña un afiche publicitario profesional para redes sociales.
Debe incluir los siguientes textos dentro de la imagen, pero no uses los que llevan # o * que son especificaciones:

Título: ${headline}
Texto: ${texto}
Llamado a la acción: ${cta}

Estilo del diseño: ${estilo}
Formato cuadrado 1:1 optimizado para Instagram y Facebook.
Colores vibrantes, composición profesional, estilo moderno.
        `;

        const image = await openai.images.generate({
            model: "gpt-image-1",
            prompt,
            size: "1024x1024"
        });

        // 🚨 Validación correcta para gpt-image-1
        if (!image.data || !image.data[0] || !image.data[0].b64_json) {
            return res.status(500).json({
                ok: false,
                error: "OpenAI no devolvió imagen"
            });
        }

        // Convertir base64 a imagen usable en <img>
        const base64Image = `data:image/png;base64,${image.data[0].b64_json}`;

        res.json({
            ok: true,
            image: base64Image
        });

    } catch (error) {
        console.error("❌ Error OpenAI:", error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

export default router;

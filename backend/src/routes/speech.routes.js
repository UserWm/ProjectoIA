import { Router } from "express";
import { openai } from "../services/chatgpt.service.js";
import Historial from "../models/Historial.js";
import PDFDocument from "pdfkit";

const router = Router();

/* ============================================================
   🔵 GENERAR SPEECH DE VENTA (solo texto)
============================================================ */
router.post("/generar", async (req, res) => {
    try {
        const filtros = req.body;

        const prompt = `
Genera un speech de ventas persuasivo para un cliente de tipo ${filtros.tipoCliente} sobre el producto:

Producto: ${filtros.producto}
Descripción: ${filtros.descripcion || "Sin descripción adicional"}
Precio: ${filtros.precio || "No especificado"}

Requisitos:
- Breve, persuasivo, adaptado al tipo de cliente
- Llamados a la acción claros
- Solo texto final
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
        });

        const speech = completion.choices[0].message.content.trim();

        // Guardar en historial
        await Historial.create({
            busqueda: JSON.stringify(filtros, null, 2),
            resultado: speech,
            tipo_producto: "Speech"
        });

        res.json({ ok: true, resultado: speech });

    } catch (error) {
        console.error("Error generando speech:", error);
        res.status(500).json({ ok: false, error: "Error generando speech" });
    }
});

/* ============================================================
   🔵 DESCARGAR PDF DEL SPEECH
============================================================ */
router.post("/descargar", async (req, res) => {
    try {
        const { speechText, producto } = req.body;
        if (!speechText) return res.status(400).json({ ok: false, error: "No se recibió texto" });

        const doc = new PDFDocument();
        let buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=speech-${producto}.pdf`);
            res.send(pdfData);
        });

        doc.fontSize(16).text(`Speech de venta: ${producto}`, { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(speechText);
        doc.end();

    } catch (error) {
        console.error("Error descargando PDF:", error);
        res.status(500).json({ ok: false, error: "Error descargando PDF" });
    }
});

/* ============================================================
   🔵 LISTAR HISTORIAL DE SPEECHES
============================================================ */
router.get("/", async (req, res) => {
    try {
        const data = await Historial.find({ tipo_producto: "Speech" })
            .sort({ createdAt: -1 })
            .limit(40);

        res.json(data);

    } catch (error) {
        console.error("Error mostrando historial:", error);
        res.status(500).json([]);
    }
});

export default router;

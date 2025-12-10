import { processJSON } from "../services/upload.service.js";

export const uploadJSON = async (req, res) => {
    try {
        const coleccion = req.body.coleccion;
        const result = await processJSON(req.file, coleccion);

        res.json(result);
    } catch (err) {
        res.status(400).json({ ok: false, msg: err.message });
    }
};

import Cliente from "../models/Cliente.js";
import Comentario from "../models/Comentario.js";
import Interaccion from "../models/Interaccion.js";
import Producto from "../models/Producto.js";
import Transaccion from "../models/Transaccion.js";

const COLLECTION_MAP = {
    Clientes: Cliente,
    Comentarios: Comentario,
    Interacciones: Interaccion,
    Productos: Producto,
    Transacciones: Transaccion
};

export const processJSON = async (file, coleccion) => {
    if (!coleccion) throw new Error("No se envió colección destino");

    const Model = COLLECTION_MAP[coleccion];
    if (!Model) throw new Error("Colección desconocida");

    const json = JSON.parse(file.buffer.toString());

    // Contenido real (la clave raíz)
    const rootKey = Object.keys(json)[0];
    const data = json[rootKey];

    if (!Array.isArray(data)) {
        throw new Error("El archivo JSON debe contener una lista de objetos");
    }

    try {
        // Intento insertar TODOS
        const result = await Model.insertMany(data, {
            ordered: false // continúa incluso si hay duplicados
        });

        return {
            ok: true,
            inserted: result.length,
            msg: `Carga completada. Registros insertados: ${result.length}`
        };

    } catch (error) {
        // Error parcial: algunos se insertan, otros no.
        const inserted = error.result?.result?.nInserted || 0;

        if (inserted > 0) {
            return {
                ok: true,
                inserted,
                msg: `Carga completada con duplicados. Insertados: ${inserted}`
            };
        }

        // Si no se insertó NINGUNO → error total
        throw new Error("Error al insertar datos (posibles duplicados o formato inválido)");
    }
};

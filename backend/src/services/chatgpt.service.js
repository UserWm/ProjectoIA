import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// export async function generarTextoPublicitario(prompt) {
//     try {
//         const response = await openai.chat.completions.create({
//             model: "o4-mini",   // Modelo rápido + barato + nuevo
//             messages: [
//                 { role: "system", content: "Eres un experto en marketing que genera textos profesionales y persuasivos." },
//                 { role: "user", content: prompt }
//             ]
//         });

//         return response.choices[0].message.content;
//     } catch (err) {
//         console.error("Error IA:", err);
//         throw new Error("Error generando contenido con IA");
//     }
// }

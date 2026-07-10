import express from 'express';
import cors from 'cors';
import { validateToken } from './middleware'; 
import { evaluarExamen } from '../src/services/evaluacionService';

const app = express();
app.use(cors());
app.use(express.json());

// --- NUEVO: Endpoint de verificación de salud (Paso 1 del Avance #5) ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Sistema operativo y funcionando' });
});
// ------------------------------------------------------------------------

// Endpoint para procesar la evaluación
app.post('/api/evaluar', validateToken, (req, res) => {
    // Obtenemos los datos necesarios del cuerpo de la petición
    const { examenId, respuestas } = req.body;

    // Validación básica de entrada
    if (!examenId || !respuestas || !Array.isArray(respuestas)) {
        return res.status(400).json({ 
            error: "Datos incompletos. Se requiere 'examenId' y una lista de 'respuestas'." 
        });
    }

    try {
        // Llamamos a tu servicio de lógica de negocio
        const resultado = evaluarExamen(examenId, respuestas);
        res.json(resultado);
    } catch (error: any) {
        // Si el examenId no existe, el servicio lanza un error que atrapamos aquí
        res.status(404).json({ error: error.message });
    }
});

// Iniciamos el servidor en el puerto 8080
app.listen(8080, () => {
    console.log("Servidor de aplicación corriendo en http://localhost:8080");
});

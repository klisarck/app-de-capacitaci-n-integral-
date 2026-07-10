import express from 'express';
import cors from 'cors';
import path from 'path'; // <-- Importamos 'path' para manejar rutas de archivos
import { validateToken } from './middleware'; 
import { evaluarExamen } from '../src/services/evaluacionService';

const app = express();
app.use(cors());
app.use(express.json());

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

// --- CONFIGURACIÓN PARA SERVIR EL FRONTEND ---
// Apuntamos a la carpeta 'dist' que genera Vite al compilar
const frontendDistPath = path.join(__dirname, '../dist');

// Servimos los archivos estáticos (JS, CSS, imágenes)
app.use(express.static(frontendDistPath));

// Cualquier petición que no sea la API, devolverá el index.html de React
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});
// ---------------------------------------------

// Iniciamos el servidor en el puerto 8080
app.listen(8080, () => {
    console.log("Servidor de aplicación corriendo en http://localhost:8080");
});

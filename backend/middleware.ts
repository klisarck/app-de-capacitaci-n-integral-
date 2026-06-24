// backend/middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("Acceso denegado: Falta token");

    const token = authHeader.split(' ')[1]; // El token viene después de "Bearer"
    
    try {
        // Aquí validarías con la clave pública de Supabase
        // Por ahora, simulamos la validación
        next();
    } catch (err) {
        res.status(400).send("Token inválido");
    }
};
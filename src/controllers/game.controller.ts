// Les contrôleurs lisent la requête HTTP (params, body), appellent le service
// et construisent la réponse (code HTTP + JSON). Toute erreur est transmise
// au gestionnaire d'erreurs d'app.ts avec next(error).

import type {NextFunction, Request, Response} from 'express';
import * as gameService from '../services/game.service.js';

export function listGames(_req: Request, res: Response, next: NextFunction): void {
    try {
        res.status(200).json(gameService.getAllGames());
    } catch (error) {
        next(error);
    }
}

export function getGame(req: Request, res: Response, next: NextFunction): void {
    try {
        res.status(200).json(gameService.getGameById(String(req.params.id)));
    } catch (error) {
        next(error);
    }
}

export function createGame(req: Request, res: Response, next: NextFunction): void {
    try {
        res.status(201).json(gameService.createGame(req.body));
    } catch (error) {
        next(error);
    }
}

export function updateGame(req: Request, res: Response, next: NextFunction): void {
    try {
        res.status(200).json(gameService.updateGame(String(req.params.id), req.body));
    } catch (error) {
        next(error);
    }
}

export function deleteGame(req: Request, res: Response, next: NextFunction): void {
    try {
        gameService.deleteGame(String(req.params.id));
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

// Les routes associent une méthode HTTP + un chemin à une fonction de contrôleur.
// Le préfixe /api/games est ajouté par app.use('/api/games', gameRoutes) dans app.ts.

import {Router} from 'express';
import * as gameController from '../controllers/game.controller.js';

export const gameRoutes = Router();

gameRoutes.get('/', gameController.listGames);
gameRoutes.get('/:id', gameController.getGame);
gameRoutes.post('/', gameController.createGame);
gameRoutes.put('/:id', gameController.updateGame);
gameRoutes.delete('/:id', gameController.deleteGame);

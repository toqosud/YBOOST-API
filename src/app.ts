// Configure Express, les routes, la documentation Swagger et la gestion des erreurs.

import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'node:fs';
import path from 'node:path';
import {projectRoot} from './config/paths.js';
import {gameRoutes} from './routes/game.routes.js';
import {HttpError} from './services/game.service.js';

// 1. Créer l'application et lui permettre de lire les requêtes JSON.
export const app = express();
app.use(express.json());

// 2. Ajouter une page d'accueil pour vérifier que l'API fonctionne.
app.get('/', (_req, res) => {
    res.json({message: 'API Jeux Vidéo opérationnelle'});
});

// 3. Lire la documentation et l'afficher avec Swagger.
const swaggerPath = path.join(projectRoot, 'docs/openapi.yaml');
const swaggerText = fs.readFileSync(swaggerPath, 'utf8');
const document = YAML.parse(swaggerText);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(document));

// 4. Brancher les cinq routes de gestion des jeux.
app.use('/api/games', gameRoutes);

// 5. Répondre 404 si aucune route ne correspond à l'URL demandée.
app.use((_req, res) => {
    res.status(404).json({error: 'Route introuvable'});
});

// Certaines erreurs Express contiennent aussi un type et un code HTTP.
interface RequestError extends Error {
    type?: string;
    status?: number;
}

// 6. Gérer les erreurs après les routes.
// Express reconnaît un gestionnaire d'erreurs à ses QUATRE paramètres.
function handleError(err: RequestError, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof HttpError) {
        res.status(err.status).json({error: err.message, details: err.details});
        return;
    }
    if (err.type === 'entity.parse.failed') {
        res.status(400).json({error: 'JSON invalide'});
        return;
    }
    if (err.status && err.status >= 400 && err.status < 500) {
        let message = 'Requête invalide';
        if (err.status === 413) {
            message = 'Corps de requête trop volumineux';
        }
        res.status(err.status).json({error: message});
        return;
    }
    console.error(err);
    res.status(500).json({error: 'Erreur interne du serveur'});
}

app.use(handleError);

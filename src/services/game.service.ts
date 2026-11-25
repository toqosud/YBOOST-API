// Le service applique les règles métier : il valide les données reçues,
// décide des erreurs HTTP à renvoyer (400, 404) et délègue le SQL au repository.

import * as gameRepository from '../repositories/game.repository.js';
import type {CreateGameInput, Game} from '../models/game.model.js';

// Erreur "métier" portant un code HTTP. Le gestionnaire d'erreurs d'app.ts s'en sert
// pour construire la réponse : status -> code HTTP, message + details -> corps JSON.
export class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
        public details?: string[],
    ) {
        super(message);
        this.name = 'HttpError';
    }
}

// Convertit l'identifiant reçu dans l'URL (toujours du texte) en entier strictement positif.
// Exemples : "3" -> 3 ; "abc", "0", "-2", "1.5", "3abc" -> erreur 400.
function parseId(rawId: string): number {
    const id = Number(rawId);
    if (!/^[1-9]\d*$/.test(rawId) || !Number.isSafeInteger(id)) {
        throw new HttpError(400, 'Identifiant invalide', ['L\'identifiant doit être un entier strictement positif']);
    }
    return id;
}

function isNonEmptyText(value: unknown): value is string {
    return typeof value === 'string' && value.trim() !== '';
}

// Vérifie les données RÉELLEMENT reçues (les types TypeScript n'existent plus à l'exécution).
// Renvoie un objet propre (textes sans espaces aux extrémités) ou lève une erreur 400.
function validateGameInput(body: unknown): CreateGameInput {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        throw new HttpError(400, 'Données invalides', ['Le corps de la requête doit être un objet JSON']);
    }

    const {title, editor, releaseYear, genre, rating} = body as Record<string, unknown>;
    const details: string[] = [];

    if (!isNonEmptyText(title)) details.push('Le titre est obligatoire');
    if (!isNonEmptyText(editor)) details.push('L\'éditeur est obligatoire');
    if (!isNonEmptyText(genre)) details.push('Le genre est obligatoire');
    if (!Number.isInteger(releaseYear) || (releaseYear as number) < 1950 || (releaseYear as number) > 2100) {
        details.push('L\'année de sortie doit être un entier compris entre 1950 et 2100');
    }
    if (typeof rating !== 'number' || !Number.isFinite(rating) || rating < 0 || rating > 10) {
        details.push('La note doit être comprise entre 0 et 10');
    }

    if (details.length > 0) {
        throw new HttpError(400, 'Données invalides', details);
    }

    return {
        title: (title as string).trim(),
        editor: (editor as string).trim(),
        releaseYear: releaseYear as number,
        genre: (genre as string).trim(),
        rating: rating as number,
    };
}

// Cherche un jeu ou lève une erreur 404.
function getExistingGame(id: number): Game {
    const game = gameRepository.findById(id);
    if (game === undefined) {
        throw new HttpError(404, 'Jeu introuvable');
    }
    return game;
}

export function getAllGames(): Game[] {
    return gameRepository.findAll();
}

export function getGameById(rawId: string): Game {
    return getExistingGame(parseId(rawId));
}

export function createGame(body: unknown): Game {
    return gameRepository.create(validateGameInput(body));
}

// Ordre des vérifications demandé par le TP : identifiant, existence, puis données.
export function updateGame(rawId: string, body: unknown): Game {
    const id = parseId(rawId);
    getExistingGame(id);
    const input = validateGameInput(body);
    const updated = gameRepository.update(id, input);
    if (updated === undefined) {
        throw new HttpError(404, 'Jeu introuvable');
    }
    return updated;
}

export function deleteGame(rawId: string): void {
    const id = parseId(rawId);
    getExistingGame(id);
    if (!gameRepository.remove(id)) {
        throw new HttpError(404, 'Jeu introuvable');
    }
}

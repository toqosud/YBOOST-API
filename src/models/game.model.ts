// Modèle d'un jeu tel que l'API le manipule et le renvoie en JSON.
export class Game {
    constructor(
        public id: number,
        public title: string,
        public editor: string,
        public releaseYear: number,
        public genre: string,
        public rating: number,
    ) {
    }
}

// Données nécessaires pour créer (ou remplacer) un jeu : tout sauf `id`,
// car l'identifiant est généré par SQLite.
export interface CreateGameInput {
    title: string;
    editor: string;
    releaseYear: number;
    genre: string;
    rating: number;
}

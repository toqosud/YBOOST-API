// Le repository est la SEULE couche qui écrit du SQL.
// Il convertit aussi les noms de colonnes SQL (release_year) en propriétés TypeScript (releaseYear).

import {db} from '../database/database.js';
import {Game} from '../models/game.model.js';
import type {CreateGameInput} from '../models/game.model.js';

// Forme d'une ligne telle que SQLite la renvoie.
interface GameRow {
    id: number;
    title: string;
    editor: string;
    release_year: number;
    genre: string;
    rating: number;
}

function toGame(row: GameRow): Game {
    return new Game(row.id, row.title, row.editor, row.release_year, row.genre, row.rating);
}


const selectAll = db.prepare('SELECT * FROM games ORDER BY id');
const selectById = db.prepare('SELECT * FROM games WHERE id = ?');
const insert = db.prepare(
    'INSERT INTO games (title, editor, release_year, genre, rating) ' +
    'VALUES (@title, @editor, @releaseYear, @genre, @rating)',
);
const updateById = db.prepare(
    'UPDATE games SET title = @title, editor = @editor, release_year = @releaseYear, ' +
    'genre = @genre, rating = @rating WHERE id = @id',
);
const deleteById = db.prepare('DELETE FROM games WHERE id = ?');

export function findAll(): Game[] {
    return (selectAll.all() as GameRow[]).map(toGame);
}

export function findById(id: number): Game | undefined {
    const row = selectById.get(id) as GameRow | undefined;
    return row === undefined ? undefined : toGame(row);
}

export function create(input: CreateGameInput): Game {
    const result = insert.run({
        title: input.title,
        editor: input.editor,
        releaseYear: input.releaseYear,
        genre: input.genre,
        rating: input.rating,
    });
    return new Game(Number(result.lastInsertRowid), input.title, input.editor, input.releaseYear, input.genre, input.rating);
}

export function update(id: number, input: CreateGameInput): Game | undefined {
    const result = updateById.run({
        id,
        title: input.title,
        editor: input.editor,
        releaseYear: input.releaseYear,
        genre: input.genre,
        rating: input.rating,
    });
    if (result.changes === 0) return undefined;
    return new Game(id, input.title, input.editor, input.releaseYear, input.genre, input.rating);
}

export function remove(id: number): boolean {
    return deleteById.run(id).changes > 0;
}

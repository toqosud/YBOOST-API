import {fileURLToPath} from 'node:url';

// Chemin absolu de la racine du projet (le dossier qui contient package.json).
// Il est calculé à partir de l'emplacement de CE fichier, donc il reste correct
// quel que soit le dossier depuis lequel on lance le serveur.
export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));

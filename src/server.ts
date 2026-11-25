// Démarre le serveur HTTP sur le port configuré et signale les erreurs de démarrage.

import {app} from './app.js';

// Utiliser le port 3000, sauf si la variable PORT indique un autre port.
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('PORT doit être un entier entre 0 et 65535');
}

// Démarrer le serveur. Cette fonction s'exécute lorsqu'il est prêt.
const server = app.listen(port, () => {
    // Avec PORT=0, Node choisit un port libre pour les tests automatisés.
    const address = server.address();
    if (address === null || typeof address === 'string') return;

    console.log('API : http://localhost:' + address.port + '/api/games');
    console.log('Swagger : http://localhost:' + address.port + '/api/docs');
});

// Afficher un message si le serveur ne peut pas démarrer (port occupé, etc.).
server.on('error', (error) => {
    console.error('Impossible de démarrer le serveur :', error.message);
    process.exitCode = 1;
});

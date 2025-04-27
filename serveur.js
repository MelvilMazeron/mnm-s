const io = require('socket.io')(3001, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log('Un joueur connecté');

    socket.on('victory', (data) => {
        console.log(`Langage corrigé : ${data.language}`);
        // Tu peux maintenant utiliser data.language pour faire ce que tu veux !
    });
});


module.exports = function(io) {
    var collaborations = []; // participants in one session id
    var socketIdToSessionId = [];
    io.on('connection', (socket) => {
        var sessionId = socket.handshake.query['sessionId'];
        socketIdToSessionId[socket.id] = sessionId;
        if (!(sessionId in collaborations)) {
            collaborations[sessionId] = {
                'participants': []
            }
        }
        collaborations[sessionId]['participants'].push(socket.id);

        socket.on('change', delta => {
            console.log('change' + socketIdToSessionId[socket.id] + ' ' + delta);
            let sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                for (let i = 0; i < participants.length; i++) {
                    if (socket.id != participants[i]) {
                        io.to(participants[i]).emit('change', delta);
                    }
                }
            }else {
                consloe.log("Error on session!!!!");
            }

        });

        socket.on('cursormove', cursor => {
            console.log('change' + socketIdToSessionId[socket.id] + ' ' + delta);
            let sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                for (let i = 0; i < participants.length; i++) {
                    if (socket.id != participants[i]) {
                        io.to(participants[i]).emit('cursorMove', delta);
                    }
                }
            }else {
                consloe.log("Error on session!!!!");
            }

        });

    });
}
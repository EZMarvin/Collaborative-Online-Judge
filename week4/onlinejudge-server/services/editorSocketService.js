var redisClient = require('../modules/redisClient');

const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {
    var collaborations = [];
    var socketIdToSessionId = [];
    var sessionPath = '/onlinejudge_server/';
    
    //response to client request
    io.on('connection', (socket) => {
        var sessionId = socket.handshake.query['sessionId'];
        socketIdToSessionId[socket.id] = sessionId;
        
        // if (!(sessionId in collaborations)) {
        //     collaborations[sessionId] = {
        //         'participants': []
        //     }
        // }
        // collaborations[sessionId]['participants'].push(socket.id);

        if (sessionId in collaborations) {
            collaborations[sessionId]['participants'].push(socket.id);
        } else {
            redisClient.get(sessionPath + sessionId, function(data) {
                if (data) { // have previous coding data
                    console.log('Have previous session, pulling back');
                    collaborations[sessionId] = {
                        'cacheInstructions': JSON.parse(data),
                        'participants': []
                    };
                } else { // first time coding
                    console.log('New session, creating new');
                    collaborations[sessionId] = {
                        'cacheInstructions': [],
                        'participants': []
                    };
                }
                collaborations[sessionId]['participants'].push(socket.id);
            });
        }

        //change listener
        socket.on('change', delta => {
            console.log('change' + socketIdToSessionId[socket.id] + ' ' + delta);
            let sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                collaborations[sessionId]['cacheInstructions'].push(
                    ['change', delta, Date.now()]
                );
            } 
            responseEvent(socket.id, 'change', delta);
        });

        //cursor move listener
        socket.on('cursorMove', cursor => {
            console.log('cursorMove' + socketIdToSessionId[socket.id] + ' ' + cursor);
            cursor = JSON.parse(cursor);
            cursor['socketId'] = socket.id;
            responseEvent(socket.id, 'cursorMove', JSON.stringify(cursor));
        });

        socket.on('restoreBuffer', () => {
            var sessionId = socketIdToSessionId[socket.id];
            console.log('restore buffer to session ' + sessionId);

            if (sessionId in collaborations) {
                let cacheInstructions = collaborations[sessionId]['cacheInstructions'];
                for (let i = 0; i < cacheInstructions.length; i++) {
                    socket.emit(cacheInstructions[i][0], cacheInstructions[i][1]);
                }
            } else {
                console.log('restore ERROR!!!');
            }
        });

        socket.on('disconnect', () => {
            var sessionId = socketIdToSessionId[socket.id];
            console.log('socket ' + socket.id + 'disconnected from session ' + sessionId);
            var foundAndRemoved = false;
            if (sessionId in collaborations) {
                var participants = collaborations[sessionId]['participants'];
                var index = participants.indexOf(socket.id);
                if (index >= 0) {
                    participants.splice(index, 1);
                    foundAndRemoved = true;
                    
                    if (participants.length == 0) {
                        console.log('last user left, saving to redis');

                        let key = sessionPath + sessionId;
                        let value = JSON.stringify(collaborations[sessionId]['cacheInstructions']);
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaborations[sessionId];
                    }
                }
            }
            if (!foundAndRemoved) {
                console.log('disconnect remove ERROR!!!');
            }
        });
    });

    var responseEvent = function(socketId, eventName, dataString) {
        let sessionId = socketIdToSessionId[socketId];
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                for (let i = 0; i < participants.length; i++) {
                    if (socketId != participants[i]) {
                        io.to(participants[i]).emit(eventName, dataString);
                    }
                }
            }else {
                consloe.log("Error on session!!!!");
            }
    }
}
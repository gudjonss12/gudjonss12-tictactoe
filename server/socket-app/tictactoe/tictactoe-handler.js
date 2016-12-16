
module.exports = function(injected){
    var TictactoeState = injected('TictactoeState');

    return function(history){

        var gameState = TictactoeState(history);

        return {
            executeCommand: function(cmd, eventHandler){

                var cmdHandlers = {
                    "CreateGame": function (cmd) {
                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameCreated",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'X'
                        }]);

                    },
                    "JoinGame": function (cmd) {
                        if(gameState.gameFull()){
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "FullGameJoinAttempted",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp
                            }]);
                            return;
                        }

                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameJoined",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'O'
                        }]);
                    },
                    // Check here for conditions which prevent command from altering state
                    "PlaceMove": function(cmd){
                      if(gameState.playerTurn() != cmd.side){
                        eventHandler( [{
                            gameId: cmd.gameId,
                            type: "NotYourMove",
                            cell: cmd.cell,
                            user: cmd.user,
                            timeStamp: cmd.timeStamp,
                            side: cmd.side,
                            name: cmd.name
                        }]);
                        return;
                      };

                      if(!gameState.cellFree(cmd.cell)) {
                        eventHandler( [{
                          gameId: cmd.gameId,
                          type: "IllegalMove",
                          cell: cmd.cell,
                          user: cmd.user,
                          timeStamp: cmd.timeStamp,
                          side: cmd.side,
                          name: cmd.name
                        }])
                        return;
                      };
                      var events = [];

                      events.push ({
                        gameId: cmd.gameId,
                        type: "MovePlaced",
                        cell: cmd.cell,
                        user: cmd.user,
                        timeStamp: cmd.timeStamp,
                        side: cmd.side,
                        name: cmd.name
                      });

                      gameState.processEvents(events);
                      // Check if there is a winner in the game
                      if(gameState.checkWinner(cmd.side)){
                        events.push( {
                        gameId: cmd.gameId,
                        type: "GameWon",
                        user: cmd.user,
                        timeStamp: cmd.timeStamp,
                        side: cmd.side,
                        name: cmd.name
                        })
                      };
                      // Check if the game has ended with a draw
                      if(gameState.checkDraw()){
                        events.push( {
                        gameId: cmd.gameId,
                        type: "GameDraw",
                        timeStamp: cmd.timeStamp,
                        name: cmd.name
                        })
                      };
                      eventHandler(events);
                    }
                };

                if(!cmdHandlers[cmd.type]){
                    throw new Error("I do not handle command of type " + cmd.type)
                }
                cmdHandlers[cmd.type](cmd);
            }
        }
    }
};

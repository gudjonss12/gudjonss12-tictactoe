var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

        var gamefull = false;
        var playerturn = 'X';

        function processEvent(event) {
          if(event.type=="GameJoined") {
            gamefull = true;
          }
          if(event.type == "MovePlaced" && event.side == 'X'){
            playerturn = 'O';
          }
          if(event.type == "MovePlaced" && event.side == 'O'){
            playerturn = 'X';
          }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function gameFull() {
          return gamefull;
        }

        function playerTurn() {
          return playerturn;
        }

        processEvents(history);

        return {
            playerTurn: playerTurn, 
            gameFull: gameFull,
            processEvents: processEvents
        }
    };
};

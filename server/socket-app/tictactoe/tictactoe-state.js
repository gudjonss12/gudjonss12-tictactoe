var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

        var gamefull = false;
        var playersymbol = 'X';

        var board = [null, null, null, null, null, null, null, null, null];

        function processEvent(event) {
          if(event.type=="GameJoined") {
            gamefull = true;
          }
          if(event.type == "MovePlaced" && event.side == 'X'){
            board[event.cell] = event.side;
            playersymbol = 'O';
          }
          if(event.type == "MovePlaced" && event.side == 'O'){
            board[event.cell] = event.side;
            playersymbol = 'X';
          }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function placeSymbol(where) {
          board[where] = playerTurn();
        }

        function cellFree(where) {
          if (board[where] != null) {
            return false;
          }
          return true;
        }

        function gameFull() {
          return gamefull;
        }

        function playerTurn() {
          return playersymbol;
        }

        processEvents(history);

        return {
            cellFree: cellFree,
            placeSymbol: placeSymbol,
            playerTurn: playerTurn,
            gameFull: gameFull,
            processEvents: processEvents
        }
    };
};

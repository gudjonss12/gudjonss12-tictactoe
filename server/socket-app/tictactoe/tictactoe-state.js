var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

        var gamefull = false;
        var playerturn = 'X';

        var board = [null, null, null, null, null, null, null, null, null];

        function processEvent(event) {
          if(event.type=="GameJoined") {
            gamefull = true;
          }
          if(event.type == "MovePlaced" && event.side == 'X'){
            board[event.cell] = event.side;
            playerturn = 'O';
            console.log('board:', board);
          }
          if(event.type == "MovePlaced" && event.side == 'O'){
            board[event.cell] = event.side;
            playerturn = 'X';
            console.log('board:', board);
          }
          /*if(event.type == 'PlaceMove'){
            board[event.cell] = event.side;
            console.log('board:', board);
          }*/
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function placeSymbol(where) {
          board[where] = playerTurn;
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
          return playerturn;
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

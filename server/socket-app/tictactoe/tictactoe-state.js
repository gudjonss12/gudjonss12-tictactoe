var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

        var gamefull = false;
        var playersymbol = 'X';
        var moveCount = 0;

        var board = [null, null, null, null, null, null, null, null, null];

        function processEvent(event) {
          if(event.type=="GameJoined") {
            gamefull = true;
          }
          if(event.type == "MovePlaced" && event.side == 'X'){
            board[event.cell] = event.side;
            moveCount = moveCount + 1;
            playersymbol = 'O';
          }
          if(event.type == "MovePlaced" && event.side == 'O'){
            board[event.cell] = event.side;
            moveCount = moveCount + 1;
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

        function checkDiagonal(symbol) {
          if(board[0] === symbol && board[4] === symbol && board[8] === symbol) {
            return true;
          }
          if(board[2] === symbol && board[4] === symbol && board[6] === symbol) {
            return true;
          }

          return false;
        }

        function checkHorizontal(symbol) {
          if(board[0] === symbol && board[1] === symbol && board[2] === symbol) {
            return true;
          }
          if(board[3] === symbol && board[4] === symbol && board[5] === symbol) {
            return true;
          }
          if(board[6] === symbol && board[7] === symbol && board[8] === symbol) {
            return true;
          }

          return false;
        }

        function checkVertical(symbol) {
          if(board[0] === symbol && board[3] === symbol && board[6] === symbol) {
            return true;
          }
          if(board[1] === symbol && board[4] === symbol && board[7] === symbol) {
            return true;
          }
          if(board[2] === symbol && board[5] === symbol && board[8] === symbol) {
            return true;
          }

          return false;
        }

        function checkWinner(symbol) {
          if(checkHorizontal(symbol) || checkVertical(symbol) || checkDiagonal(symbol)) {
            return true;
          }

          return false;
        }

        function checkDraw() {
          if(moveCount === 9 && !checkWinner('O') && !checkWinner('X')) {
            return true;
          }

          return false;
        }

        function gameFull() {
          return gamefull;
        }

        function playerTurn() {
          return playersymbol;
        }

        processEvents(history);

        return {
            checkDraw: checkDraw,
            checkWinner: checkWinner,
            cellFree: cellFree,
            placeSymbol: placeSymbol,
            playerTurn: playerTurn,
            gameFull: gameFull,
            processEvents: processEvents
        }
    };
};

var should = require('should');
var _ = require('lodash');

var TictactoeState = require('./tictactoe-state')(inject({}));

var tictactoe = require('./tictactoe-handler')(inject({
    TictactoeState
}));

var createEvent = {
    type: "GameCreated",
    user: {userName: "TheGuy"},
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29"
};

var joinEvent = {
    type: "GameJoined",
    user: {userName: "Gummi"},
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29"
};


describe('create game command', function() {


    var given, when, then;

    beforeEach(function(){
        given=undefined;
        when=undefined;
        then=undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function(actualEvents){
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game created event', function(){

        given = [];
        when =
        {
            id:"123987",
            type: "CreateGame",
            user: {userName: "TheGuy"},
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        };
        then = [
            {
                type: "GameCreated",
                user: {userName: "TheGuy"},
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side:'X'
            }
        ];

    })
});


describe('join game command', function () {


    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game joined event...', function () {

        given = [{
            type: "GameCreated",
            user: {userName: "TheGuy"},
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }
        ];
        when =
          {
              type: "JoinGame",
              user: {userName: "Gummi"},
              name: "TheFirstGame",
              timeStamp: "2014-12-02T11:29:29"
          };
        then = [
          {
              type: "GameJoined",
              user: {userName: "Gummi"},
              name: "TheFirstGame",
              timeStamp: "2014-12-02T11:29:29",
              side:'O'
          }
        ];

    });

    it('should emit FullGameJoinAttempted event when game full', function () {
      given = [
        {
          type: "GameCreated",
          user: {userName: "TheGuy"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:29"
        },
        {
          type: "GameJoined",
          user: {userName: "Gummi"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:29",
          side:'O'
        }
      ];
      when =
        {
          type: "JoinGame",
          user: {userName: "Gux"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:30:29"
        };
      then = [
        {
          type: "FullGameJoinAttempted",
          user: {userName: "Gux"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:30:29"
        }
      ];
    });
});

describe('Place move command', function() {


    var given, when, then;

    beforeEach(function(){
        given=undefined;
        when=undefined;
        then=undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function(actualEvents){
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });

    it('should emit MovePlaced after PlaceMove on empty space during your turn', function () {
      given = [
        {
          type: "GameCreated",
          user: {userName: "TheGuy"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:29"
        },
        {
          type: "GameJoined",
          user: {userName: "Gux"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:30",
          side:'O'
        }
      ];
      when =
        {
          type: "PlaceMove",
          cell: 0,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        };
      then = [
        {
          type: "MovePlaced",
          cell: 0,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        }
      ];
    });

    it('should emit MovePlaced after PlaceMove on empty space during your turn on round two', function () {
      given = [
        {
          type: "GameCreated",
          user: {userName: "TheGuy"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:29"
        },
        {
          type: "GameJoined",
          user: {userName: "Gux"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:30",
          side:'O'
        },
        {
          type: "MovePlaced",
          cell: 0,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        }
      ];
      when =
        {
          type: "PlaceMove",
          cell: 1,
          user: {userName: "Gux"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'O',
          name: "TheFirstGame"
        };
      then = [
        {
          type: "MovePlaced",
          cell: 1,
          user: {userName: "Gux"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'O',
          name: "TheFirstGame"
        }
      ];
    });


    it('should emit IllegalMove after PlaceMove on an occupied space during your turn', function () {
      given = [
        {
          type: "GameCreated",
          user: {userName: "TheGuy"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:29"
        },
        {
          type: "GameJoined",
          user: {userName: "Gux"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:30",
          side:'O'
        },
        {
          type: "MovePlaced",
          cell: 0,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        }
      ];
      when = {
          type: "PlaceMove",
          cell: 0,
          user: {userName: "Gux"},
          timeStamp: "2014-12-02T11:30:31",
          side: 'O',
          name: "TheFirstGame"
      };
      then = [
        {
          type: "IllegalMove",
          cell: 0,
          user: {userName: "Gux"},
          timeStamp: "2014-12-02T11:30:31",
          side: 'O',
          name: "TheFirstGame"
        }
      ];
    });

    it('should emit NotYourMove after PlaceMove during other players turn', function () {
      given = [
        {
          type: "GameCreated",
          user: {userName: "TheGuy"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:29"
        },
        {
          type: "GameJoined",
          user: {userName: "Gux"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:30",
          side:'O'
        },
        {
          type: "MovePlaced",
          cell: 0,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        }
      ];
      when = {
          type: "PlaceMove",
          cell: 1,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:31",
          side: 'X',
          name: "TheFirstGame"
      };
      then = [
        {
          type: "NotYourMove",
          cell: 1,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:31",
          side: 'X',
          name: "TheFirstGame"
        }
      ];
    });

    it('should emit MovePlaced and GameWon if playing a winning move, horizontally', function () {
      given = [
        {
          type: "GameCreated",
          user: {userName: "TheGuy"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:29"
        },
        {
          type: "GameJoined",
          user: {userName: "Gux"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:30",
          side:'O'
        },
        {
          type: "MovePlaced",
          cell: 0,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        },
        {
          type: "MovePlaced",
          cell: 3,
          user: {userName: "Gux"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'O',
          name: "TheFirstGame"
        },
        {
          type: "MovePlaced",
          cell: 1,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        },
        {
          type: "MovePlaced",
          cell: 4,
          user: {userName: "Gux"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'O',
          name: "TheFirstGame"
        }];
        when = {
          type: "PlaceMove",
          cell: 2,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        };
        then = [
          {
          type: "MovePlaced",
          cell: 2,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        },
        {
          type: "GameWon",
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        }
      ];
    });

    it('should emit MovePlaced and GameWon if playing a winning move, vertically', function () {
      given = [
        {
          type: "GameCreated",
          user: {userName: "TheGuy"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:29"
        },
        {
          type: "GameJoined",
          user: {userName: "Gux"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:30",
          side:'O'
        },
        {
          type: "MovePlaced",
          cell: 0,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        },
        {
          type: "MovePlaced",
          cell: 1,
          user: {userName: "Gux"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'O',
          name: "TheFirstGame"
        },
        {
          type: "MovePlaced",
          cell: 3,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        },
        {
          type: "MovePlaced",
          cell: 4,
          user: {userName: "Gux"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'O',
          name: "TheFirstGame"
        }];
        when = {
          type: "PlaceMove",
          cell: 6,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        };
        then = [
          {
          type: "MovePlaced",
          cell: 6,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        },
        {
          type: "GameWon",
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        }
      ];
    });

    it('should emit MovePlaced and GameWon if playing a winning move, topleft-bottomright diagonal', function () {
      given = [
        {
          type: "GameCreated",
          user: {userName: "TheGuy"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:29"
        },
        {
          type: "GameJoined",
          user: {userName: "Gux"},
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:30",
          side:'O'
        },
        {
          type: "MovePlaced",
          cell: 0,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        },
        {
          type: "MovePlaced",
          cell: 1,
          user: {userName: "Gux"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'O',
          name: "TheFirstGame"
        },
        {
          type: "MovePlaced",
          cell: 4,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        },
        {
          type: "MovePlaced",
          cell: 2,
          user: {userName: "Gux"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'O',
          name: "TheFirstGame"
        }];
        when = {
          type: "PlaceMove",
          cell: 8,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        };
        then = [
          {
          type: "MovePlaced",
          cell: 8,
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        },
        {
          type: "GameWon",
          user: {userName: "TheGuy"},
          timeStamp: "2014-12-02T11:30:29",
          side: 'X',
          name: "TheFirstGame"
        }
      ];
    });
});

const io = require('socket.io-client');
const RoutingContext = require('../client/src/routing-context');
var UserAPI = require('./fluentapi/user-api');
var TestAPI = require('./fluentapi/test-api');

const userAPI = UserAPI(inject({
    io,
    RoutingContext
}));

const testAPI = TestAPI(inject({
    io,
    RoutingContext
}));

describe('Tictactoe API', function () {
    var userA, userB;

    beforeEach(function (done) {
        var testapi = testAPI();
        testapi.waitForCleanDatabase().cleanDatabase().then(()=> {
            testapi.disconnect();
            userA = userAPI();
            userB = userAPI();
            done();
        });
    });

    afterEach(function () {
        userA.disconnect();
        userB.disconnect();
    });

    it('should be able to play game to end', function (done) {
      /* placeMove sends only 1 parameter as i had made server side logic as 1-D array
      and wanted to keep it that way
      */
        userA.expectGameCreated().createGame().then(()=> {
                userB.expectGameJoined().joinGame(userA.getGame().gameId).then(function () {
                    userA.expectMoveMade().placeMove(0).then(()=> {
                        userA.expectMoveMade();
                        userB.expectMoveMade().placeMove(1).then(()=> {
                            userB.expectMoveMade(); // By other user
                            userA.expectMoveMade().placeMove(3).then(()=> {
                                userA.expectMoveMade(); // By other user
                                userB.expectMoveMade().placeMove(5).then(()=> {
                                    userB.expectMoveMade(); // By other user
                                    userA.expectMoveMade().placeMove(6)
                                        .expectGameWon().then(done); // Winning move
                                })
                            })
                        });
                    })
                })
            }
        );
    });

});

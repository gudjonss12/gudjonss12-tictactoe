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

jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;

describe('Load test', function(){


    beforeEach(function(done){
        var testapi = testAPI();
        testapi.waitForCleanDatabase().cleanDatabase().then(()=>{
            testapi.disconnect();
            done();
        });
    });

    const count = 100;
    const timelimit = 20000;

    it('Should play  ' + count + '  games within  '+ timelimit +'ms',function(done){

        var startMillis = new Date().getTime();

        var user;
        var creators=[];
        var joiners=[];
        for(var i=0; i<count; i++){
            creator = userAPI("Creator#" + i);
            creators.push(creator);
            joiner = userAPI("Joiner#" + i);
            joiners.push(joiner);

            creator.expectGameCreated().createGame().then(()=> {
                    joiner.expectGameJoined().joinGame(creator.getGame().gameId).then(function () {
                        creator.expectMoveMade().placeMove(0).then(()=> {
                            creator.expectMoveMade();
                            joiner.expectMoveMade().placeMove(1).then(()=> {
                                joiner.expectMoveMade(); // By other user
                                creator.expectMoveMade().placeMove(3).then(()=> {
                                    creator.expectMoveMade(); // By other user
                                    joiner.expectMoveMade().placeMove(5).then(()=> {
                                        joiner.expectMoveMade(); // By other user
                                        creator.expectMoveMade().placeMove(6)
                                            .expectGameWon().then(done); // Winning move
                                    })
                                })
                            });
                        })
                    })
                }
            );
        }

        user = userAPI("Final user");
        user.expectChatMessageReceived('TWO')
            .sendChatMessage('TWO')
            .then(function(){
                user.disconnect();
                _.each(creators, function(crtr){
                    crtr.disconnect();
                });
                _.each(joiners, function(jnr) {
                    jnr.disconnect();
                });

                var endMillis = new Date().getTime();
                var duration = endMillis - startMillis;
                if(duration > timelimit){
                    done.fail(duration + " exceeds limit " + timelimit);
                } else {
                    done();

                }
            });
    });
});

module.exports=function(injected){

    const io = require('socket.io-client');
    const RoutingContext = require('../../client/src/routing-context');
    const generateUUID = require('../../client/src/common/framework/uuid');

    var connectCount =0;

    function userAPI(){
        var waitingFor=[];
        var commandId=0;
        var currentGame = {
          gameId: generateUUID()
        };

        var routingContext = RoutingContext(inject({
            io,
            env:"test"
        }));

        connectCount++;
        const me = {
            expectUserAck:(cb)=>{
                waitingFor.push("expectUserAck");
                routingContext.socket.on('userAcknowledged', function(ackMessage){
                    expect(ackMessage.clientId).not.toBeUndefined();
                    waitingFor.pop();
                });

                return me;
            },
            createGame:()=>{
                var thisCmdId = generateUUID();
                var currentTime = new Date();
                routingContext.commandRouter.routeMessage({commandId:thisCmdId, type:"CreateGame", gameId:currentGame.gameId, timeStamp:currentTime});

                return me;
            },
            expectGameCreated:()=>{
                waitingFor.push("expectGameCreated");
                routingContext.eventRouter.on('GameCreated', function(game){
                    expect(game.gameId).not.toBeUndefined();
                    if(game.gameId===currentGame.gameId){
                        waitingFor.pop();
                        // From here on we have access to 'side' in currentGame, as well as other variables
                        currentGame = game;
                    }
                });

                return me;
            },
            joinGame:(inId)=>{
                currentGame.gameId = inId;
                var thisCmdId = generateUUID();
                var currentTime = new Date();

                routingContext.commandRouter.routeMessage({commandId:thisCmdId, type:"JoinGame", gameId:inId, timeStamp:currentTime});

                return me;
            },
            expectGameJoined:()=>{
                waitingFor.push("expectGameJoined");
                routingContext.eventRouter.on('GameJoined', function(game){
                    expect(game.gameId).not.toBeUndefined();
                    if(game.gameId===currentGame.gameId){
                        waitingFor.pop();
                        currentGame = game;
                    }
                });

                return me;
            },
            getGame:()=>{
                return currentGame;
            },
            /* I made changes to tictactoe-spec.js so that placeMove sends only one variable,
               since i made the server side logic with a 1-Dimensional array, i wanted to keep it
               that way.
            */
            placeMove:(inCell)=>{
                var thisCell = inCell;
                var thisCmdId = generateUUID();
                var currentTime = new Date();

                routingContext.commandRouter.routeMessage({commandId:thisCmdId, type:"PlaceMove", gameId:currentGame.gameId, side: currentGame.side, timeStamp:currentTime, cell:thisCell});

                return me;
            },
            expectMoveMade:()=>{
                waitingFor.push("expectMovePlaced");
                routingContext.eventRouter.on('MovePlaced', function(game){
                    expect(game.gameId).not.toBeUndefined();
                    if(game.gameId===currentGame.gameId){
                        waitingFor.pop();
                    }
                });

                return me;
            },
            expectGameWon:()=>{
                waitingFor.push("expectGameWon");
                routingContext.eventRouter.on('GameWon', function(game){
                    expect(game.gameId).not.toBeUndefined();
                    if(game.gameId===currentGame.gameId){
                        waitingFor.pop();
                    }
                });

                return me;
            },
            sendChatMessage:(message)=>{
                var thisCmdId = generateUUID();
                routingContext.commandRouter.routeMessage({commandId:thisCmdId, type:"chatCommand", message });

                return me;
            },
            expectChatMessageReceived:(message)=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('chatMessageReceived', function(chatMessage){
                    expect(chatMessage.sender).not.toBeUndefined();
                    if(chatMessage.message===message){
                        waitingFor.pop();
                    }
                });

                return me;
            },
            cleanDatabase:()=>{
                var thisCmdId = commandId++;
                routingContext.commandRouter.routeMessage({commandId:thisCmdId, type:"cleanDatabase"});

                return me;

            },
            waitForCleanDatabase:()=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('databaseCleaned', function(chatMessage){
                    waitingFor.pop();
                });

                return me;
            },
            then:(whenDoneWaiting)=>{
                function waitLonger(){
                    if(waitingFor.length>0){
                        setTimeout(waitLonger, 0);
                        return;
                    }
                    whenDoneWaiting();
                }
                waitLonger();

                return me;
            },
            disconnect:function(){
                routingContext.socket.disconnect();
            }

        };

        return me;
    }

    return userAPI;
};

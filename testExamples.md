# gudjonss12 tictactoe given/when/then test examples #

## 1. Create game command: ##
- Given[], when[CreateGame], then[GameCreated]

## 2. Join game command ##
- Given[GameCreated], when[JoinGame], then[GameJoined]
- Given[GameCreated], when[JoinGame, GameFull], then[FullGameJoinAttempted]

## 3. Place move command ##
### General game tests ###
- Given[GameCreated, GameJoined], when[PlaceMove(0,0, 'O')], then[MovePlaced(0,0, 'O')].
- Given[GameCreated, GameJoined, MovePlaced(0,0, 'O')], when[PlaceMove(0,0, 'X')], then[IllegalMove(0,0)]
- Given[GameCreated, GameJoined, MovePlaced(0,0, 'O')], when[PlaceMove(0,1, 'O')], then[NotYourMove(O)]

### Game win condition tests ###
#### Horizontal winner ####
- Given[GameCreated, MovePlaced(0,0, 'O'), MovePlaced(0,1, 'O')], when[PlaceMove(0,2, 'O')], then[GameWon('O')]

#### Vertical winner ####        
- Given[GameCreated, MovePlaced(0,0, 'O'), MovePlaced(1,0, 'O')], when[PlaceMove(2,0, 'O')], then[GameWon('O')]

#### Diagonal winner topleft-bottomright
- Given[GameCreated, MovePlaced(0,0, 'X'), MovePlaced(1,1, 'X')], when[PlaceMove(2,2, 'X')], then[GameWon('X')]

#### Diagonal winner bottomleft-topright
- Given[GameCreated, MovePlaced(2,0, 'O'), MovePlaced(1,1, 'O')], when[PlaceMove(0,2, 'O')], then[GameWon('O')]

#### Game draw ####
- Given[GameCreated, moveCount=8], when[MovePlaced(0,0, 'O'), noWinner], then[GameDraw]        

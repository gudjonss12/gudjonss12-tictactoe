# gudjonss12 tictactoe given/when/then test examples #

## 1. Create game command: ##
- Given[], when[CreateGame], then[GameCreated]

## 2. Join game command ##
- Given[GameCreated], when[JoinGame], then[GameJoined]
- Given[GameCreated], when[JoinGame, GameFull], then[FullGameJoinAttempted]

## 3. Place move command ##
### General game tests ###

Given |00 |01 |02 |
      |10 |11 |12 |
      |20 |21 |22 |,
      When[PlaceMove(0,0)],
      Then[MovePlaced].

Given[['O'], ['01'], ['02'], when[PlaceMove(0,0), X-Turn], then[IllegalMove]
      ['10'], ['11'], ['12'],
      ['20'], ['21'], ['22']]

Given[['00'], ['01'], ['02'], when[PlaceMove(0,0), X-turn], then[NotYourMove]
      ['10'], ['11'], ['12'],
      ['20'], ['21'], ['22']]

### Game win condition tests ###
#### Horizontal winner ####
Given[['X'], ['X'], ['02'], when[PlaceMove(0,2), X-turn], then[GameWon(X)]
      ['O'], ['O'], ['12'],
      ['O'], ['X'], ['O']]

#### Vertical winner ####        
Given[['00'], ['X'], ['O'], when[PlaceMove(0,0), O-turn], then[GameWon(O)]
      ['O'], ['X'], ['X'],
      ['O'], ['O'], ['22']]        

#### Diagonal winner topleft-bottomright
Given[['00'], ['X'], ['X'], when[PlaceMove(0,0), O-turn], then[GameWon(O)]
      ['O'], ['O'], ['X'],
      ['X'], ['O'], ['O']]

#### Diagonal winner bottomleft-topright
Given[['X'], ['X'], ['02'], when[PlaceMove(0,2), O-turn], then[GameWon(O)]
      ['X'], ['O'], ['O'],
      ['O'], ['O'], ['X']]

#### Game draw ####

Given[['X'], ['X'], ['O'], when[PlaceMove(2,2), O-turn], then[GameDraw]
      ['O'], ['O'], ['X'],
      ['X'], ['O'], ['22']]        

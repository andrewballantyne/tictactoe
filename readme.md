# Tic Tac Toe

A simple game of tic-tac-toe. This was more for my own sanity; as I was wondering if I could complete it in one sitting (took about 3.5-4 
hours) to get a fully working basic version.

## Future Features

In no particular order, these are the features I still would like to get in:

* A toggle for new Game to manually flip the player instead of making it random
* AI support with difficulty setting
* More styling to give it a bit more flair
* Mobile support

## Release Notes 

### v1.1 \| **Added Better Score Support, Mild Styling Improvements**

* Added Better Score Support
    * Total Score is now calculated
        * Only finished games are recorded, New Games mid-game are not recorded
    * Ties are now recorded and shown
        * When all squares are filled and no winner is awarded, a tie is added
* Mild Styling Improvements
    * Added wells for all items to help flair up the styling

### v1.0 \| **Initial release**

* X and O players
* 8 possible winning paths
    1. Top Row
    2. Middle Row
    3. Bottom Row
    4. First Column
    5. Second Column
    6. Third Column
    7. Top-Left to Bottom-Right
    8. Top-Right to Bottom-Left
* New Game randoms player
    * To be changed later to maintain "who started first" and flip back and forth

# 🚀 Doodle Jump with Face Control

Developed by Damir Zhumatayev - 20210807
email: dameekoh@kaist.ac.kr
source code: https://github.com/dameekoh/doodle311
video: https://youtu.be/fGbONT0qzRQ 
try: https://doodle311.netlify.app

* A description of the game - how it works and what the user has to do

The game is a platformer where the player controls a ball and tries to jump on platforms to reach higher levels. 

* Goal: to keep climbing as high as possible without falling off the screen or touching a black hole. 

The player can perform regular jumps and interact with different types of platforms that provide various effects, such as fragile platforms that break upon landing and spring platforms that give an extra boost. The game <strong>continues until the player falls off the screen </strong> or touches a black hole, at which point they can restart the game by pressing the space bar.

<i>Most of the computer games are programmed in OOP. I decided to challenge myself with functional style.</i>

The code is divided into several files: blackhole.js, player.js, platform.js and sketch.js. The canvas is rendered and updated on sketch.js file.

Main functions: 


1) Draw Function:
* Handles the game's main loop.
* Manages the game logic, such as player and platform movement, collision detection, rendering, and scorekeeping.
* Updates the blackhole object and checks for player-blackhole collisions.
* Adjusts platform speed based on the score.
* Calls ```drawScore()``` and ```calculateAngle() ```functions.
* Handles game over condition and displays the game over screen.
1) Input Handling Functions:

* ```keyPressed()```: Handles keyboard input for game controls.
* ```windowResized()```: Adjusts game elements and variables when the window is resized.
* ```touchStarted()```, ```touchMoved()```, ```touchEnded()```: Handles touch input for mobile devices.
Game Management Functions:

* ```generatePlatforms()```: Generates initial platform objects.
updatePlatforms(): Updates platform positions and generates new platforms as needed.
* ```restartGame()```: Resets game variables and generates new platforms to restart the game.
* ```drawDead()```: Displays the game over message.
3) Face Tracking Function:


* `calculateAngle()`:
   - This function is responsible for calculating the tilt angle of the player based on facial features detected by face tracking.
   - It uses the `tracker.getCurrentPosition()` function to retrieve the current positions of facial features.
   - The nose tip position, left ear position, and right ear position are used to calculate the face width and the tilt angle.
   - The tilt angle is then converted from a range of [0, 1] to [-1, 1] and assigned to the player using `player.setTilt(tilt)`.

Logic: 
1. `generatePlatforms()`:
   - This function generates the initial set of platforms for the game.
   - It calculates the number of platforms to create based on the width of the canvas and a predetermined formula.
   - It uses a loop to create platform objects and push them into the `platforms` array.
   - Each platform is created with a random x-coordinate within the canvas and a y-coordinate calculated based on the platform's index and step size.
   - The platform type is randomly chosen, ensuring that fragile platforms are not initially generated.
   - Additionally, there is a small chance for a platform to be created as a springed platform or for a blackhole to be created.

2. `updatePlatforms()`:
   - This function updates the positions of the platforms based on the player's vertical speed.
   - It iterates over each platform in the `platforms` array and adjusts the y-coordinate by subtracting the player's vertical speed (`player.dy`).
   - If a platform goes off the screen (y-coordinate greater than the canvas height), it is replaced with a new platform at the top of the screen.
   - If the platform is a non-fragile and non-invisible platform, it is repositioned randomly within the canvas, and its type and springed properties are updated accordingly.
   - If the platform is a fragile or invisible platform, it is removed from the `platforms` array.
   - If a platform is removed, there is also a chance to generate a new blackhole.

3. Collision Detection:
   - Collision detection occurs in the `draw()` function as the game loop iterates over the platforms and checks for collisions with the player and blackhole.
   - The function `player.intersects(platform)` is called to check if the player intersects with a platform. This function is likely defined in the `player.js` file.
   - If the player intersects with a platform, various actions are performed based on the type of platform:
     - If the platform is a fragile platform, it plays a sound, changes its type to invisible, and sets the `springed` property to `false`.
     - If the platform is a springed platform, it plays a sound and increases the player's vertical speed (`player.dy`) for an enhanced jump.
     - The `score` variable is incremented when the player jumps on a platform.
   - Collision detection with the blackhole is also performed by calling `player.intersects(blackhole)`.
   - If the player intersects with the blackhole, the game is flagged as over, a sound is played, and a variable `playerEnteredBlackHole` is set to `true`.

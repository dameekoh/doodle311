let score = 0;

function drawScore() {
  textSize(32);
  textAlign(RIGHT);
  fill(0); // Black color
  text('Score: ' + score, width - 10, 50); // Position top-right
}

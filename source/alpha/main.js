(function() {
  var SPACE_KEY = 32;
  var LEFT_KEY = 37;
  var RIGHT_KEY = 39;

  var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var MIN_DIST = 3;

  var gameStarted = false;
  var gameHasEverBeenStarted = false;

  var MAX_COUNTER = 30;
  var counter = MAX_COUNTER;
  var score = 0;

  var interval = null;

  var instructionsElement = document.getElementById('instructions');
  var counterElement = document.getElementById('counter');

  var gameElement = document.getElementById('game');
  var arrowInstructions = document.getElementById('arrow-instructions');

  var scoreElement = document.getElementById('score');
  var endGameTextElement = document.getElementById('end-game-text');

  var defaultBackgroundElement = document.getElementById('defaultbg');
  var successBackgroundElement = document.getElementById('successbg');
  var failBackgroundElement = document.getElementById('failbg');


  var firstLetterElement = document.getElementById('first');
  var secondLetterElement = document.getElementById('second');

  var currentCorrectAnswer = true;

  var distanceArray = [13, 9, 8, 7, 6, 5, 4, 3];
  var DISTANCE_ARRAY_LENGTH = distanceArray.length;
  var currentDistIndex = 0;

  var hammer = new Hammer.Manager(document.body, {
    recognizers: [
      [Hammer.Swipe,{ direction: Hammer.DIRECTION_ALL }],
    ]
  });

  hammer.on('swipe', function(ev) {
    if (!gameStarted) {
      if (ev.direction === Hammer.DIRECTION_UP) {
        spaceKey();
      }
    } else {
      if (ev.direction === Hammer.DIRECTION_LEFT) {
        leftArrow();
      } else if (ev.direction === Hammer.DIRECTION_RIGHT) {
        rightArrow();
      }
    }
  });


  document.onkeydown = function (e) {
    if (!gameStarted) {
      if (e.keyCode === SPACE_KEY) {
        spaceKey();
      }
    } else {
      if (e.keyCode === LEFT_KEY) {
        leftArrow();
      } else if (e.keyCode === RIGHT_KEY) {
        rightArrow();
      }
    }
  };

  function spaceKey() {
    if (!gameHasEverBeenStarted) {
      instructionsElement.style.display = 'none';
      gameHasEverBeenStarted = true;
    }
    startGame();
  }
  function leftArrow() {
    if (!currentCorrectAnswer) {
      correctAnswer();
    } else {
      failGame();
    }
  }

  function rightArrow() {
    if (currentCorrectAnswer) {
      correctAnswer();
    } else {
      failGame();
    }
  }

  function decrementCounterAndUpdateDOM() {
    counter--;
    counterElement.innerHTML = counter;
    return counter;
  }

  function startGame() {
    gameStarted = true;
    updateScore(0);

    gameElement.style.display = 'block';
    arrowInstructions.style.display = 'block';

    defaultBackgroundElement.style.opacity = 1;
    failBackgroundElement.style.opacity = 0;
    successBackgroundElement.style.opacity = 0;
    endGameTextElement.innerHTML = '';
    endGameTextElement.style.opacity = 0;

    decrementCounterAndUpdateDOM();
    interval = setInterval(function() {
      var result = decrementCounterAndUpdateDOM();
      if (result === 0) {
        clearInterval(interval);
        timeUp();
      };
    }.bind(this), 1000);

    generateQuestion();
  }

  function updateScore(newScore) {
    score = newScore;
    scoreElement.innerHTML = score;
  }

  function correctAnswer() {
    updateScore(score+1);
    generateQuestion();
  }

  function generateQuestion() {
    if (currentDistIndex < DISTANCE_ARRAY_LENGTH-1) {
      currentDistIndex++;
    }
    var distance = distanceArray[currentDistIndex];

    var actualDistance = distance;
    if (distance === MIN_DIST) {
      actualDistance = Math.ceil(Math.random()*distance);
    }

    var highestIndex = 26 - actualDistance;

    var firstIndex = Math.ceil(Math.random()*highestIndex)-1;
    var secondIndex = firstIndex + actualDistance;

    var isCorrect = true;

    if (Math.random() > 0.5) {
      isCorrect = false;
    } else {
      var temp = firstIndex;
      firstIndex = secondIndex;
      secondIndex = temp;
    }

    var firstLetter = ALPHABET[firstIndex];
    var secondLetter = ALPHABET[secondIndex];

    firstLetterElement.innerHTML = firstLetter;
    secondLetterElement.innerHTML = secondLetter;

    currentCorrectAnswer = isCorrect;
    return isCorrect;
  }

  function failGame() {
    clearInterval(interval);

    defaultBackgroundElement.style.opacity = 0;
    failBackgroundElement.style.opacity = 1;

    endGameTextElement.innerHTML = 'Ouch. ';
    endGame();
  }

  function timeUp() {
    defaultBackgroundElement.style.opacity = 0;
    successBackgroundElement.style.opacity = 1;

    endGameTextElement.innerHTML = 'You made it to the end! ';
    endGame();
  }

  function endGame() {
    // Show end game text
    var questionText = score === 1 ? ' question ' : ' questions ';
    var endGameText = 'You got ' + score + questionText + 'correct.<br><br>';

    var bestScore = localStorage.getItem('score');


    if ((bestScore === null || bestScore === undefined || score > bestScore) && score !== 0) {
      localStorage.setItem('score', score);
      endGameText += 'You got a new high score of ' + score + '. Hurray!';
    } else if (bestScore !== null && bestScore !== undefined) {
      endGameText += 'Your high score is ' + bestScore + '.';
    }

    endGameText += '<br><br>Press Space to try again.';


    endGameTextElement.innerHTML += endGameText;

    endGameTextElement.style.opacity = 1;

    gameStarted = false;
    counter = MAX_COUNTER;
    gameElement.style.display = 'none';
    arrowInstructions.style.display = 'none';
  }

})();

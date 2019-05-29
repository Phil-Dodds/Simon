

// Define some global variables

var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = '';

var randomChosenColour;

var currentTurnSequence = [];  //start blank

var currentGame = 1;

var ringerCount = 0;



function resetGame () {

    if (gamePattern.length > 19) {

      $("#level-title").text("WOW! You crushed it. (Select to Play)");
      audioEgg1 = new Audio ("sounds/best_thug_life_ringtone.mp3");
      audioEgg1.play();
      delayAmount = 7000;
  } else {

    // initialize vars and screen.   Screen should ask for anykey.  Vars should be ready for new sequence.

    $("#level-title").text("Select HERE to begin").css("border", "5px solid black");
  }

    $("#level-title").click(respondToAnyKey);
    $(".btn").off("click");

    currentGame = 0;

    // Cool special effects

    ringButtonsforFlashy (0);
}

function startGame () {

  console.log("Start Game");

  currentTurnSequence = [];

  gamePattern = [];

  currentGame = 1;

  $("#level-title").text("Simon Says!").css("border", "none");

  // Turn off clicking on the title until the match is over
  $("#level-title").off("click");

  nextTurn();
}


function currentMatchesPattern () {

    // Determine whether the user is correc so far

    for (j = 0; j < currentTurnSequence.length; j++) {

          if (currentTurnSequence[j] !== gamePattern[j]) {

                return 0;
            }
      }

      return 1;

}

// When the user clicks a button, determine whether she is following the sequence, completed the sequence, or erred

function respondToClick() {

    // if we are not playing yet then start the gamePattern

  if (currentGame === 0) {

      startGame();

  }   else {

    currentTurnSequence.push(this.id);

    // the user is not finsished ... let's see if she has made a mistake with the last click...

    if ((currentTurnSequence.length < gamePattern.length) && currentMatchesPattern() ) {

        // So far so good.  Ring the last clicked button and then wait for more user input

        ringButtonAfterUserClick(this.id);

    } else if (currentMatchesPattern()) {

      // You did it!   Lets add one to the stack and let you try again.

      ringButtonAfterUserClick(this.id);

      var audio = new Audio ("sounds/ding.mp3");

      audio.play();

      nextTurn();

    } else {

        // Looks like you made a mistake.   Let the user know and restart from the beginning.

        userErred (this.id);
    }
  }
}


function userErred (buttonColor) {

    if (buttonColor !== "") {

        $("#" + buttonColor).css("border", "10px solid red");
    }

    // Play the mistake sound.

    var audioVar = new Audio ("sounds/wrong.mp3");

    audioVar.play();

    // After a short delay, return button to normal look

    setTimeout (function () {

      if (buttonColor !== "") {

          $("#" + buttonColor).css("border", "10px solid black");
      }

      // Start the game over.

      resetGame();

    }, 500);

}


function respondToAnyKey () {

  console.log("in respondtoanykey");

    // If the game is in motion then ignore

    if (currentGame === 0) {

        // Let's get this game going!

        startGame ();
      }
  }

function nextSequence (){

    //determine next color number

    var randomnumber = Math.floor(Math.random()*4);

    // Translate from a number to a color

    randomChosenColour = buttonColours[randomnumber];

    // Add to the sequence

    gamePattern.push(randomChosenColour);

}


function ringButtonsforFlashy (buttonNumber) {

    //  The button border is already black so flash to yellow

    $('#'+ buttonColours[buttonNumber]).css("border","10px solid yellow");

    // Play a sound special to the button

    var audioVar = new Audio ("sounds/blue.mp3");

    //audioVar.play();

    // Now for the magic delay ... wait a moment to turn the color back to black AND ring the next button in sequence.

    setTimeout(function () {

        $('#'+buttonColours[buttonNumber]).css("border","10px solid black");

        if (buttonNumber < 3) {
          ringButtonsforFlashy(buttonNumber + 1);
          }
      }, 300);

  }

function ringButtonAfterUserClick (buttonColor) {

  //  The button border is already black so flash to yellow

    $('#'+buttonColor).css("border","10px solid #7CFC00");

  // Play a sound special to the button

  var audioVar = new Audio ("sounds/" + buttonColor + ".mp3");

  audioVar.play();

  // Now for the magic delay ... wait a moment to turn the color back to black AND ring the next button in sequence.

  setTimeout(function () {

      $('#'+buttonColor).css("border","10px solid black");
      },   300);

}

function ringButtonAndNextInSequence () {

  // Ignore user clicks of the buttons while we are ringing the sequence

  $(".btn").off("click");

  // Determine what button we are ringing ... using the global variable

  var buttonColor = gamePattern[ringerCount];

  // "Ringing a button consists of flashing the border from black to yellow to black and playing a special sound."

  //  The button border is already black so flash to yellow

  $('#'+buttonColor).css("border","10px solid yellow");

  // Play a sound special to the button

  var audioVar = new Audio ("sounds/" + buttonColor + ".mp3");

  audioVar.play();

  // Now for the magic delay ... wait a moment to turn the color back to black AND ring the next button in sequence.

  setTimeout(function () {

        $('#'+buttonColor).css("border","10px solid black");

      ringerCount++;

      // If we have not gone past the end then ring the next button

      if (ringerCount < gamePattern.length) {
          setTimeout (function () {ringButtonAndNextInSequence();}, 200);
      } else {

        // The whole sequence has been rung. Time to allow button clicks again

        $(".btn").click(respondToClick);
      }

    },   600);
}

function displaySequence () {

   // Reset the sequence counter/pointer to the beginning

   ringerCount = 0;

   // If the game pattern exists at actually

   if (gamePattern.length !== 0) {

        // Ring the first button ... and then let the sequence play out to the end.

      ringButtonAndNextInSequence ();
  }
}

function nextTurn () {

    var delayAmount = 1500;
    //Easter egg after 10 in a row

    if (gamePattern.length === 9) {

        $("#level-title").text("WOW! Lucky 9s! Keep going!");
        audioEgg1 = new Audio ("sounds/Despacito-Marimba-Remix.mp3");
        audioEgg1.play();
        delayAmount = 7000;
    }  else {

      if (gamePattern.slice(gamePattern.length - 2, gamePattern.length) === "red, red") {

        audioEgg2 = new Audio ("sounds/Maroon-5-Girls-Like-You-Ringtone.mp3");
        audioEgg2.play();
        delayAmount = 7000;
      }

    }

    // Select the next color for overall sequence

    nextSequence ();

    // Display the result sequence to the user.  Add a little delay before starting.

    setTimeout (function () {
            displaySequence ();
    }, delayAmount);

    // Clear the user sequence for the user to start over
    currentTurnSequence = [];
}


// MAIN SECTION

resetGame ();

// try to load sounds to improve usability due to lang

var audioPreLoad = new Audio("sounds/blue.mp3");
audioPreLoad =  new Audio("sounds/ding.mp3");
audioPreLoad =  new Audio("sounds/green.mp3");
audioPreLoad =  new Audio("sounds/red.mp3");
audioPreLoad =  new Audio("sounds/wrong.mp3");
audioPreLoad =  new Audio("sounds/yellow.mp3");

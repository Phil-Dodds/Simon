

// Define some global variables

var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern;

var randomChosenColour;

var currentTurnSequence = [];  //start blank

var currentGame = 1;

var ringerCount = 0;



function resetGame () {

    //console.log("Reset Game");

    // initialize vars and screen.   Screen should ask for anykey.  Vars should be ready for new sequence.

    $("#level-title").text("Select any key to begin");


    currentGame = 0;

    // Cool special effects

    ringButtonsforFlashy (0);
}

function startGame () {

  console.log("Start Game");

  currentTurnSequence = [];

  gamePattern = [];

  currentGame = 1;

  $("#level-title").text("Simon Says!");

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


    console.log(buttonColours[buttonNumber] + ' ' + buttonNumber);

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

  // Determine what button we are ringing ... using the global variable

  var buttonColor = gamePattern[ringerCount];

  // "Ringing a button consists of flashing the border from black to yellow to black and playing a special sound."

  //  The button border is already black so flash to yellow

  $('#'+buttonColor).css("border","10px solid yellow");

  // Play a sound special to the button

  var audioVar = new Audio ("sounds/" + buttonColor + ".mp3");

  audioVar.play();

  console.log ("played audio for " + buttonColor + "?");

  // Now for the magic delay ... wait a moment to turn the color back to black AND ring the next button in sequence.

  setTimeout(function () {

      console.log("actually running the timer end");

      $('#'+buttonColor).css("border","10px solid black");

      ringerCount++;

      // If we have not gone past the end then ring the next button

      if (ringerCount < gamePattern.length) {
          setTimeout (function () {ringButtonAndNextInSequence();}, 200);
      } else {

      }

    },   600);
}

function displaySequence () {

   // Reset the sequence counter/pointer to the beginning

   ringerCount = 0;

   // If the game pattern exists at actually

   if (gamePattern.length !== 0) {

      // (Consider) doing something to keep the user from clicking while the sequence is going

     //TBD

      // Ring the first button ... and then let the sequence play out to the end.

      ringButtonAndNextInSequence ();
  }
}

function nextTurn () {

    // Select the next color for overall sequence

    nextSequence ();

    // Display the result sequence to the user.  Add a little delay before starting.

    setTimeout (function () {
            displaySequence ();
    }, 1500);

    // Clear the user sequence for the user to start over
    currentTurnSequence = [];
}


// MAIN SECTION

resetGame ();

// Wait for a click of a button ...

$(".btn").click(respondToClick);

// Wait for any key ... to start gamePattern

$(document).keydown(respondToAnyKey);

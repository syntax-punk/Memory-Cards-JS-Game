//
// Lorem Memo Cards Game
// Designed by: voogieJames
// UIS 2017
//

// global variables
var gameStarted;
var flips;
var points1;
var points2;
var player;
var totalTicks;
var ticker;
var maxPoints;

$(document).ready(function() {
  initFields();
  $("form").submit(prepareBoard);
  $("#cardboard").on("click", ".card", clickhandler);
  $("#player1").addClass("turn");
});

// init fields
function initFields() {
  gameStarted = false;
  flips = 0;
  points1 = 0;
  points2 = 0;
  player = true;
  totalTicks = 0;
  maxPoints= 8;

  $("#cardboard").hide();
  $("#winner").hide();
  $("header").hide();
  $("#time").text("00:00");
  $("#totalflips").text(flips);
  $("#score1").text(points1);
  $("#score2").text(points2);
}

// board construct
function prepareBoard() {
  hidePlayButton();
  cols = 4;
  rows = 4;
  var array = shuffle();
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var div = $("<div></div>").addClass("card");
      var divFront = $("<div></div>").addClass("front");
      var divBack = $("<div></div>").addClass("back");
      var img = $("<img>");
      img.attr("src", "images/img" +array.shift() +".jpg");
      if (c === 0) {
        div.addClass("clearleft");
      }
      divBack.append(img);
      div.append(divFront).append(divBack);
      // set card on the board
      $("#cardboard").append(div);
    }
  }
  var wd = $(".card").outerWidth(true) * cols;
  $("#cardboard").width(wd).show();
  $("header").show();

  $('.card').each(function() {
    $(this).flip();
  });

  return false;
}

// on card click handler
function clickhandler () {
  // check if matched
  if ($(this).hasClass('matched')) {
    return;
  }

  $(this).flip().toggleClass("flipped");
  flips ++;
  // start timer on first flip
  if (flips === 1) {
    ticker = setInterval(updateTimer, 1000);
  }
  $("#totalflips").text(flips);
  var flipped = $(".flipped").not("matched");
  // if two cards were flipped over
  if ( flipped.length === 2 ) {
     var firstCard = flipped.first();
     var secondCard = flipped.last();
     // compare cards
     if ( firstCard.html() === secondCard.html() ) {
       player === true ? $("#score1").text(++points1) : $("#score2").text(++points2)
       firstCard.addClass("matched");
       secondCard.addClass("matched");
       setTimeout(checkWinner, 800);
     } else {
       firstCard.removeClass("flipped");
       secondCard.removeClass("flipped");
       if (player) {
         player = false;
         $("#player1").toggleClass("turn");
         $("#player2").toggleClass("turn");
       } else {
         player = true;
         $("#player2").toggleClass("turn");
         $("#player1").toggleClass("turn");
       }
       // flip cards back
       setTimeout(function() {
         firstCard.flip('toggle');
         secondCard.flip('toggle');
       }, 600);
     }
  }
  // fade matched cards
  $(".matched").each(function() {
    $(this).fadeTo(800, 0).removeClass("flipped");
  });
}

function hidePlayButton() {
  $("#startbtn").animate({
    left: "10%",
    top: "90%"
  }, 200).fadeOut("fast");
}

// cards shuffling function based on Fisher-Yates shuffle
function shuffle() {
  var array = ["1", "1", "2", "2", "3", "3", "4", "4", "5", "5", "6", "6", "7", "7", "8", "8"];
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);
      // Decrease counter by 1
      counter--;
      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }
  return array;
}

// timer ticker
function updateTimer() {
    ++totalTicks;
    var m = Math.floor(totalTicks / 60);
    var s = totalTicks - 60 * m;
    $("#time").text(((m < 10) ? "0" : "") + m + ":" + ((s < 10) ? "0" : "") + s);
}

// check for winner
function checkWinner() {
  // check for winner if points sum == maxPoints
  if ((points1 + points2) === maxPoints) {
    clearInterval(ticker);
    var msg;
    if (points1 === points2) {
      msg = "Oh, It's Tie!"
    } else {
      var w;
      if (points1 > points2) {
        w = "Player 1";
      } else {
        w = "Player 2";
      }
      msg = "Terrific! " +w +" Is a Winner!";
    }
    $("#winner").text(msg);
    $("#winner").show();
  }
}

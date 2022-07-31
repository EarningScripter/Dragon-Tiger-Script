$(function(){
//app's state (variables)
var deck;
var stack1;
var stack2;
var play1;
var play2;

//references
var $play = $('#play');
var $deal = $('#deal');
var $war = $('#war');
var $back = $('#back');
var $inMenu = $('.inMenu');
var $inPlay = $('.inPlay');
var $gifs = $('.gifs');
var $gif1 = $('#gif1');
var $gif2 = $('#gif2');
var $h1 = $('h1');
var $h4 = $('h4');
var $bomb = $('#bomb');
var $play1 = $('#play1');
var $play2 = $('#play2');
var $score1 = $('#score1');
var $score2 = $('#score2');
var warGifs = ['https://media.giphy.com/media/3reGZ5XDFWPte/giphy.gif', 'https://media.giphy.com/media/TKFPaEt0YWwyk/giphy.gif', 'https://media.giphy.com/media/3og0IGYBSB8WykDt16/giphy.gif', 'https://media.giphy.com/media/vlbVMxsUYSLQs/giphy.gif', 'https://media.giphy.com/media/cAiQiBZEWWzAI/giphy.gif', 'https://media.giphy.com/media/9umH7yTO8gLYY/giphy.gif', 'https://media.giphy.com/media/DMvK89Svcx7t6/giphy.gif', 'https://media.giphy.com/media/aoNxAPcc5hyQo/giphy.gif', 'https://media.giphy.com/media/l1J3Tqz2fpsx60MDe/giphy.gif', 'https://media.giphy.com/media/yyoHU6mOdu6UU/giphy.gif', 'https://media.giphy.com/media/Pn1232jBLN0TC/giphy.gif', 'https://media.giphy.com/media/scmqsNR8Zyf9m/giphy.gif'];
var loseGifs = ['https://media.giphy.com/media/11n2IHjhycUAc8/giphy.gif', 'https://media.giphy.com/media/EizPK3InQbrNK/giphy.gif', 'https://media.giphy.com/media/Z5R4RxA1xwVnq/giphy.gif', 'https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif', 'https://media.giphy.com/media/Hwq45iwTIUBGw/giphy.gif', 'https://media.giphy.com/media/Ll5vSMprGdwe4/giphy.gif', 'https://media.giphy.com/media/26BGqofNXjxluwX0k/giphy.gif', 'https://media.giphy.com/media/ZeB4HcMpsyDo4/giphy.gif'];

//event listeners
$play.on('click', playGame);
$deal.on('click', deal);
$war.on('click', war);
$back.on('click', backToMenu);

//functions
function init() {
  deck = [];
  stack1 = [];
  stack2 = [];
  play1 = [];
  play2 = [];
  mainDisplay();
  buildDeck();
}

function buildDeck() {
  var ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
  var suits = ['h', 'd', 'c', 's'];
  var lookup = {'02': 2, '03': 3, '04': 4, '05': 5, '06': 6, '07': 7, '08': 8, '09': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
  suits.forEach(function(suit) {
		ranks.forEach(function(rank) {
      var card = {
        css: suit + rank,
        value: lookup[rank]
      }; deck.push(card);
    });
  });
  while (deck.length) {
    stack1.push(deck.splice(Math.floor(Math.random() * deck.length), 1) [0])
  }; 
  stack2 = stack1.splice(0, 26);
}

function playGame() {
  $deal.animate({borderSpacing: 720}, {
    step: function(now,fx) {
      $(this).css('transform','rotate('+now+'deg)');
    },
    duration:'slow'
  },'linear');
  mainDisplay();
}

function backToMenu() {
  $('h4.inPlay').html('Good luck!');
  $play1.removeClass().addClass('xlarge card back');
  $play2.removeClass().addClass('xlarge card back');
  $deal.removeAttr('disabled', '');
  $bomb.attr('src', "https://openclipart.org/image/2400px/svg_to_png/252171/bomb.png").css({'left':'15px', 'width':'100px'});
  $deal.animate({borderSpacing: -720}, {
    step: function(now,fx) {
      $(this).css('transform','rotate('+now+'deg)');
    },
    duration:'fast'
  },'linear');
  $deal.show();
  init();
}

function win() {
  var $loser = stack1.length === 0 ? $gif1 : $gif2;
  var $winner = stack1.length === 0 ? $gif2 : $gif1;
  $winner === $gif1 ? $h1.html('P1 WINS') : $h1.html('P2 WINS');
  $gifs.show();
  $deal.attr('disabled', '');
  $bomb.attr('src', 'https://media.giphy.com/media/oe33xf3B50fsc/giphy.gif').css('width', '200px');
  $winner.attr('src', 'https://media.giphy.com/media/MFU0Bp8LmK5GM/giphy.gif');
  $loser.attr('src', loseGifs[Math.floor(Math.random() * (loseGifs.length))]);
  $('h4.inPlay').html('Good job!');
  setTimeout (function() {
    $deal.hide();
    $back.show();
  }, 1000);
}

function render() {
  $score1.html(stack1.length);
  $score2.html(stack2.length);
  if (stack1.length === 0 || stack2.length === 0) {
    win();
  };
}

function compare() {
  if (play1[0].value === play2[0].value) {
    warDisplay();
    $war.attr('disabled', '');
    setTimeout(function() {
      $war.removeAttr('disabled', '')
    }, 1000);
    return;
  };
  playWin(play1[0].value > play2[0].value ? 1 : 2);
  render();
}

function playWin(player) {
  var numMoves = play1.length + play2.length;
  var targetStack = player === 1 ? stack1 : stack2;
  var moveBomb = player === 1 ? '+=6px' : '-=6px';
  if (player === 1) {
    targetStack.push(...play1.splice(0), ...play2.splice(0));
  } else {
    targetStack.push(...play2.splice(0), ...play1.splice(0));
  };
  for (var i = numMoves; i > 0; i--) {
    $bomb.animate({'left':moveBomb}, 50);
  };
}

function deal() {
  play1.push(stack1.shift());
  play2.push(stack2.shift());
  changeCardFront();
  compare();
}

function war() {
  var numDeal = Math.min(stack1.length, 4);
  play1.unshift(...stack1.splice(0, numDeal));
  numDeal = Math.min(stack2.length, 4);
  play2.unshift(...stack2.splice(0, numDeal));
  changeCardFront();
  warDisplay();
  compare();
}



function changeCardFront() {
  $play1.removeClass();
  $play2.removeClass();  
  $play1.addClass('card').addClass('xlarge').addClass(play1[0].css);
  $play2.addClass('card').addClass('xlarge').addClass(play2[0].css); 
}

function mainDisplay() {
  $inMenu.toggle();
  $inPlay.toggle();
  $war.hide();
  $back.hide();
  $gifs.hide();
  $score1.html(stack1.length);
  $score2.html(stack2.length);
  $h1.html('Dragon V/S Tiger Hack Script');
}



$inMenu.hide();
init();
});
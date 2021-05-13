const SlidingGame = {
    dimension: null,
    values: null,
    current: null,
};

// Fisher-Yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const aux = array[i];
        array[i] = array[j];
        array[j] = aux;
    }
}

function moveSquare(event) {
    // right
    if (event.keyCode == '39') {
        if (SlidingGame.current.y - 1 < 0) {
            return;
        }
        const missing = $('#square_' + SlidingGame.current.x + '_' + SlidingGame.current.y--);
        const square = $('#square_' + SlidingGame.current.x + '_' + SlidingGame.current.y);
        missing.html(square.html()).css('borderColor', 'black');
        square.html('').css('borderColor', 'white');
    }
    // left
    else if (event.keyCode == '37') {
        if (SlidingGame.current.y + 1 > SlidingGame.dimension - 1) {
            return;
        }
        const missing = $('#square_' + SlidingGame.current.x + '_' + SlidingGame.current.y++);
        const square = $('#square_' + SlidingGame.current.x + '_' + SlidingGame.current.y);
        missing.html(square.html()).css('borderColor', 'black');
        square.html('').css('borderColor', 'white');
    }
    // up
    else if (event.keyCode == '38') {
        if (SlidingGame.current.x + 1 > SlidingGame.dimension - 1) {
            return;
        }
        const missing = $('#square_' + SlidingGame.current.x++ + '_' + SlidingGame.current.y);
        const square = $('#square_' + SlidingGame.current.x + '_' + SlidingGame.current.y);
        missing.html(square.html()).css('borderColor', 'black');
        square.html('').css('borderColor', 'white');
    }
    // down
    else if (event.keyCode == '40') {
        if (SlidingGame.current.x - 1 < 0) {
            return;
        }
        const missing = $('#square_' + SlidingGame.current.x-- + '_' + SlidingGame.current.y);
        const square = $('#square_' + SlidingGame.current.x + '_' + SlidingGame.current.y);
        missing.html(square.html()).css('borderColor', 'black');
        square.html('').css('borderColor', 'white');
    }
}

// restarts a game 
function newGame(dimension) {
    $('.square').remove()
    $('#game').remove();
    setTimeout(function() {
        start(dimension);
    }, 700);
}

// initializes and starts a game
function startGame() {
    for (let i = 0; i < SlidingGame.dimension * SlidingGame.dimension - 1; i++) {
        SlidingGame.values.push(i + 1);
    }
    shuffle(SlidingGame.values);
    SlidingGame.values.push(SlidingGame.dimension * SlidingGame.dimension);
    let pos = 0;
    for (let x = 0; x < SlidingGame.dimension; x++) {
        for (let y = 0; y < SlidingGame.dimension; y++) {
            if (x == SlidingGame.dimension - 1 && y == SlidingGame.dimension - 1) {
                $('<div></div>')
                .appendTo($('#game'))
                .attr('id', 'square_' + x + '_' + y)
                .attr('class', 'square')
                .css('borderColor', 'white')
                .click(function() {
                    showNumber($(this));
                });
            }
            else {
                $('<div></div>')
                .appendTo($('#game'))
                .attr('id', 'square_' + x + '_' + y)
                .attr('class', 'square')
                .html(SlidingGame.values[pos++])
                .click(function() {
                    showNumber($(this));
                });
            }
        }
    }
}

// generates a game
function start(dimension) {
    $(document).off('keydown').on('keydown', moveSquare);
    $('<div></div>').appendTo('body').attr('id', 'game').css('gridTemplateColumns', 'repeat(' + dimension + ', 1fr)');
    SlidingGame.dimension = dimension;
    SlidingGame.values = [];
    SlidingGame.current = { x: dimension - 1, y: dimension - 1 };
    $('.dimButton').off().click(function() {
        newGame($(this).val());
    });
    startGame();
}

$(document).ready(function() {
    $('.dimButton').click(function() {
        start($(this).val());
    });
});
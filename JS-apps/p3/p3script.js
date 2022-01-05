const MemoryGame = {
    dimension: null,
    squares_found: null,
    squares_shown: null,
    values: null
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

function newGame(dimension) {
    $('.square').remove()
    $('#game').remove();
    setTimeout(function() {
        start(dimension);
    }, 700);
}

function hideNumbers() {
    MemoryGame.squares_shown[0].html('');
    MemoryGame.squares_shown[1].html('');
    MemoryGame.squares_shown[0].css('backgroundColor', 'white');
    MemoryGame.squares_shown[1].css('backgroundColor', 'white');
    MemoryGame.squares_shown = [];
}

function showNumber(square) {
    if (MemoryGame.squares_shown.length == 2 || square.html() != '') {
        return;
    }
    square.html(square.attr('hiddenvalue'));
    MemoryGame.squares_shown.push(square);
    if (MemoryGame.squares_shown.length == 2) {
        if (MemoryGame.squares_shown[0].attr('hiddenvalue') == MemoryGame.squares_shown[1].attr('hiddenvalue')) {
            MemoryGame.squares_shown[0].css('backgroundColor', 'lightgreen');
            MemoryGame.squares_shown[1].css('backgroundColor', 'lightgreen');
            MemoryGame.squares_found += 2;
            MemoryGame.squares_shown = [];
        }
        else {
            MemoryGame.squares_shown[0].css('backgroundColor', 'lightcoral');
            MemoryGame.squares_shown[1].css('backgroundColor', 'lightcoral');
            setTimeout(hideNumbers, 1000);
        }
    }
    if (MemoryGame.squares_found == MemoryGame.dimension * MemoryGame.dimension) {
        alert('Mission Passed!\nRespect+\nAlegeți dimensiunea pentru un nou joc!');
    }
}

function startGame() {
    for (let i = 0; i < MemoryGame.dimension * MemoryGame.dimension / 2; i++) {
        MemoryGame.values.push(i, i);
    }
    shuffle(MemoryGame.values);
    for (let square_id = 0; square_id < MemoryGame.dimension * MemoryGame.dimension; square_id++) {
        $('<div></div>')
        .appendTo($('#game'))
        .attr('id', 'square_' + square_id)
        .attr('class', 'square')
        .attr('hiddenvalue', MemoryGame.values[square_id])
        .click(function() {
            showNumber($(this));
        });
    }
}

function start(dimension) {
    $('<div></div>').appendTo('body').attr('id', 'game').css('gridTemplateColumns', 'repeat(' + dimension + ', 1fr)');
    MemoryGame.dimension = dimension;
    MemoryGame.squares_found = 0;
    MemoryGame.squares_shown = [];
    MemoryGame.values = [];
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


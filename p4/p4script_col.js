function checkIfAllAreNumbers(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (isNaN(arr[i])) {
            return false;
        }
    }
    return true;
}

function initialize() {
    $('tr').each(function() {
        $($(this).children('th')[0]).attr('sorted', 'no').click(function() {
            sortContents($(this));
        });
    });
}

// sort function that also remembers the final positions
function posSort(arr, compare) {
    const positions = []
    for (let i = 0; i < arr.length; i++) {
        positions.push(i);
    }
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if(compare(arr[i], arr[j])) {
                let aux = arr[i];
                arr[i] = arr[j];
                arr[j] = aux;
                aux = positions[i];
                positions[i] = positions[j];
                positions[j] = aux;
            }
        }
    }
    return positions;
}

function sortContents(header) {
    const selected_data = [];
    header.siblings('td').each(function() {
        selected_data.push($(this).html());
    });

    if (header.attr('sorted') == 'no') {
        let positions = [];
        if (checkIfAllAreNumbers(selected_data)) {
            positions = posSort(selected_data, ((x, y) => {
                if (parseFloat(x) > parseFloat(y)) {
                    return 1;
                }
                return 0;
            }));
        }
        else {
            positions = posSort(selected_data, ((x, y) => {
                if (x.toUpperCase() > y.toUpperCase()) {
                    return 1;
                }
                return 0;
            }));
        }

        // mark the selected row as sorted
        header.attr('sorted', 'yes');
        header.siblings('td').each(function(i, _e) {
            $(this).html(selected_data[i]);
        });
        
        const other_rows = header.parent().siblings();
        for (let i_row = 0; i_row < other_rows.length; i_row++) {
            const other_cells = $(other_rows[i_row]).children('td');
            const other_data = [];

            other_cells.each(function() {
                other_data.push($(this).html());
            });

            other_cells.each(function(i, _e) {
                $(this).html(other_data[positions[i]]);
            });

            // mark the other rows as not sorted
            $($(other_rows[i_row]).children('th')[0]).attr('sorted', 'no');
        }
    }
    else if (header.attr('sorted') == 'yes') {
        selected_data.reverse();
        header.siblings('td').each(function(i, _e) {
            $(this).html(selected_data[i]);
        });

        const other_rows = header.parent().siblings();
        for (let i_row = 0; i_row < other_rows.length; i_row++) {
            const other_cells = $(other_rows[i_row]).children('td');
            const other_data = [];

            other_cells.each(function() {
                other_data.push($(this).html());
            });

            other_data.reverse();

            other_cells.each(function(i, _e) {
                $(this).html(other_data[i]);
            });
        }
    }
}

$(document).ready(function() {
    initialize();
});
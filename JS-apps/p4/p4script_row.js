function checkIfAllAreNumbers(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (isNaN(arr[i])) {
            return false;
        }
    }
    return true;
}

function extractColumn(table, i_col) {
    const col = []
    $(table).find('tr').each(function() {
        const col_data = $(this).children()[i_col];
        col.push(col_data);
    });
    return col;
}

function initialize() {
    const tables = $('table');
    for (let i_table = 0; i_table < tables.length; i_table++) {
        const no_columns = $(tables[i_table]).find('th').length;
        for (let i_col = 0; i_col < no_columns; i_col++) {
            const col = extractColumn(tables[i_table], i_col);
            $(col[0]).attr('sorted', 'no').click(function() {
                sortContents(col);
            });
        }
    }
}

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

function sortContents(col) {
    const selected_data = [];
    const no_columns = $(col[0]).siblings().length + 1;
    const table = $(col[0]).parent().parent().parent()[0];
    
    for (let i = 1; i < col.length; i++) {
        selected_data.push($(col[i]).html());
    }

    if ($(col[0]).attr('sorted') == 'no') {
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

         // mark the selected column as sorted
         $(col[0]).attr('sorted', 'yes');
         for (let i = 1; i < col.length; i++) {
             $(col[i]).html(selected_data[i - 1]);
         }

        for (let i_col = 0; i_col < no_columns; i_col++) {
            const other_col = extractColumn(table, i_col);
            if ($(other_col[0]).html() == $(col[0]).html()) {
               continue;
            }
            else {
                const other_data = [];
                for (let i = 1; i < other_col.length; i++) {
                    other_data.push($(other_col[i]).html());
                }
                for (let i = 1; i < other_col.length; i++) {
                    $(other_col[i]).html(other_data[positions[i - 1]]);
                }
                // mark the other columns as not sorted
                $(other_col[0]).attr('sorted', 'no');
            }
        }
    }
    else if ($(col[0]).attr('sorted') == 'yes'){
        selected_data.reverse();
        for (let i = 1; i < col.length; i++) {
            $(col[i]).html(selected_data[i - 1]);
        }

        for (let i_col = 0; i_col < no_columns; i_col++) {
            const other_col = extractColumn(table, i_col);
            if ($(other_col[0]).html() == $(col[0]).html()) {
               continue;
            }
            else {
                const other_data = [];
                for (let i = 1; i < other_col.length; i++) {
                    other_data.push($(other_col[i]).html());
                }
                other_data.reverse();
                for (let i = 1; i < other_col.length; i++) {
                    $(other_col[i]).html(other_data[i - 1]);
                }
            }
        }
    }
}

$(document).ready(function() {
    initialize();
});
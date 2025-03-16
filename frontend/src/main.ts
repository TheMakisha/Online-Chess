

function okej() {
    let row = 6, column = 4;
    function blabla(row: number, column: number, rowIncr: number, columnIncr: number): number[][] {
        const arr: number[][] = [];
        while (row > 0 && row < 7 && column > 0 && column < 7) {
            row += rowIncr;
            column += columnIncr;
            arr.push([row, column]);
        }
    
        return arr;
    }
    return [[1, 0], [-1, 0], [0, 1], [0, -1]].map(arr => blabla(row, column, arr[0], arr[1]));
}

function bishop() {
    let row = 6, column = 4;
    function blabla(row: number, column: number, rowIncr: number, columnIncr: number): number[][] {
        const arr: number[][] = [];
        while (row > 0 && row < 7 && column > 0 && column < 7) {
            row += rowIncr;
            column += columnIncr;
            arr.push([row, column]);
        }
    
        return arr;
    }
    return [[1, -1], [1, 1], [-1, 1], [-1, -1]].map(arr => blabla(row, column, arr[0], arr[1]));
}
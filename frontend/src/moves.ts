


enum Name {
  PAWN,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING,
  EMPTY
}

enum Color {
  WHITE,
  BLACK
}

interface ChessPiece {
  name: Name;
  color: Color;
}

interface Pawn extends ChessPiece {
  isEnPassant: boolean;
}

interface Position {
  row: number;
  column: number;
}

interface Move {
  position: Position;
  canRemove: boolean;
}

function getMoves(board: ChessPiece[][], position: Position): Move[] {
  const moves: Move[] = [];

  const piece = board[position.row][position.column];

  const isKingInCheck = checkIfTheKingIsInCheck(board, piece.color);

  if (!isKingInCheck) {
    moves.push(...calculateMoves(board, position));
  }

  return moves;
}

function calculateMoves(board: ChessPiece[][], position: Position): Move[] {
  const moves: Move[] = [];

  const piece = board[position.row][position.column];

  switch (piece.name) {
    case Name.PAWN: moves.push(...getPawnMoves(piece as Pawn, board, position)); break;
    case Name.ROOK: moves.push(...getRookMoves(piece, board, position)); break;
    case Name.BISHOP: moves.push(...getBishopMoves(piece, board, position)); break;
    case Name.QUEEN: moves.push(...getQueenMoves(piece, board, position)); break;
    case Name.KNIGHT: moves.push(...getKnightMoves(piece, board, position)); break;
    //case Name.KING: moves.push(...getKingMoves(piece, board, position)); break;
  }

  return moves;
}

function checkIfTheKingIsInCheck(board: ChessPiece[][], color: Color) {
  const enemyPiecesMoves: Move[] = getAllEnemyPieces(board, color == Color.WHITE ? Color.BLACK : Color.WHITE);
  const myKingPosition = findTheKingPosition(board, color);
  const isKingInCheck = enemyPiecesMoves.map(move => move.position)
  .filter(position => position.row == myKingPosition.row && position.column == myKingPosition.column)
  .length == 0 ? false : true;

  return isKingInCheck;
}

function findTheKingPosition(board: ChessPiece[][], color: Color): Position {
  const position: Position = {row: 0, column: 0};
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j].name == Name.KING && board[i][j].color == color) {
        position.row = i;
        position.column = j;
        break;
      }
    }
  }
  return position;
}

function getAllEnemyPieces(board: ChessPiece[][], color: Color): Move[] {
  const moves: Move[] = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j].name != Name.EMPTY && board[i][j].color == color) {
        moves.push(...calculateMoves(board, {row: i, column: j}));
      }
    }
  }

  return moves;
}


function isPawnFirstMove(pawn: Pawn, position: Position): boolean {
  if (pawn.color == Color.WHITE && position.row == 1) 
    return true;
  if (pawn.color == Color.WHITE && position.row == 6) 
    return true;
  return false;
} 

function getPawnMoves(pawn: Pawn, board: ChessPiece[][], position: Position): Move[] {
  const moves: Move[] = [];
  const move: Move = {position: position, canRemove: false};

  const currRow = position.row, currColumn = position.column;

  let nRow = position.row + (pawn.color == Color.WHITE ? 1 : -1);
  let nColumn = position.column;
  const isFirstMove = isPawnFirstMove(pawn, position);
  let isKingInCheck;
  if (board[nRow][nColumn].name == Name.EMPTY) {
    swapTwoPositionsOnTheBoard(board, {row: currRow, column: currColumn}, {row: nRow, column: nColumn});
    isKingInCheck = checkIfTheKingIsInCheck(board, pawn.color);
    if (!isKingInCheck) {
      move.position.row = nRow;
      move.position.column = nColumn;
      move.canRemove = false;
      moves.push(move);
    }
    swapTwoPositionsOnTheBoard(board, {row: currRow, column: currColumn}, {row: nRow, column: nColumn});
    nRow = position.row + (pawn.color == Color.WHITE ? 2 : -2);
    if (isFirstMove && board[nRow][nColumn].name == Name.EMPTY) {
      swapTwoPositionsOnTheBoard(board, {row: currRow, column: currColumn}, {row: nRow, column: nColumn});
      isKingInCheck = checkIfTheKingIsInCheck(board, pawn.color);
      if (!isKingInCheck) {
        move.position.row = nRow;
        move.position.column = nColumn;
        move.canRemove = false;
        moves.push(move);
      }
      swapTwoPositionsOnTheBoard(board, {row: currRow, column: currColumn}, {row: nRow, column: nColumn});
    }
  }
  
  nRow = position.row + (pawn.color == Color.WHITE ? 1 : -1)
  nColumn = position.column + 1;
  if (board[nRow][nColumn].name != Name.EMPTY) {
    swapTwoPositionsOnTheBoard(board, {row: currRow, column: currColumn}, {row: nRow, column: nColumn});
    if (!isKingInCheck) {
      move.position.row  = nRow;
      move.position.column = nColumn;
      move.canRemove = true;
      moves.push(move);
    }
    swapTwoPositionsOnTheBoard(board, {row: currRow, column: currColumn}, {row: nRow, column: nColumn});
  }

  nRow = position.row + (pawn.color == Color.WHITE ? -1 : 1),
  nColumn = position.column - 1;
  if (board[nRow][nColumn].name != Name.EMPTY) {
    swapTwoPositionsOnTheBoard(board, {row: currRow, column: currColumn}, {row: nRow, column: nColumn});
    if (!isKingInCheck) {
      move.position.row  = nRow;
      move.position.column = nColumn;
      move.canRemove = true;
      moves.push(move);
    }
    swapTwoPositionsOnTheBoard(board, {row: currRow, column: currColumn}, {row: nRow, column: nColumn});
  }

  return moves;
}

function getRookMoves(rook: ChessPiece, board: ChessPiece[][], position: Position): Move[] {
  const moves: Move[] = [];

  let cRow, cColumn;
  let canLeft = true, canRight = true, canUp = true, canDown = true;
  let piece;
  let move: Move = {position: position, canRemove: false};
  for (let i = 1, j = 1; canLeft && canRight && canUp && canDown; i++, j++) {
    //dole i gore za belog i crnog
    cRow = position.row - i;
    cColumn = position.column;
    piece = board[cRow][cColumn];
    if (piece) {
      if (piece.name == Name.EMPTY) {
        move.position.row = cRow;
        move.position.column = cColumn;
        move.canRemove = false;
        moves.push(move);
      }
      else {
        if (piece.color != rook.color) {
          move.position.row = cRow;
          move.position.column = cColumn;
          move.canRemove = true;
          moves.push(move);
        } 
        canDown = false;
      }
    } 
    else {
      canDown = false;
    }

    //gore i dole za belog i crnog
    cRow = position.row + i;
    cColumn = position.column;
    piece = board[cRow][cColumn];
    if (piece) {
      if (piece.name == Name.EMPTY) {
        move.position.row = cRow;
        move.position.column = cColumn;
        move.canRemove = false;
        moves.push(move);
      }
      else {
        if (piece.color != rook.color) {
          move.position.row = cRow;
          move.position.column = cColumn;
          move.canRemove = true;
          moves.push(move);
        } 
        canUp = false;
      }
    } 
    else {
      canUp = false;
    }

    //levo i desno za belog i crnog
    cRow = position.row;
    cColumn = position.column - 1;
    piece = board[cRow][cColumn];
    if (piece) {
      if (piece.name == Name.EMPTY) {
        move.position.row = cRow;
        move.position.column = cColumn;
        move.canRemove = false;
        moves.push(move);
      }
      else {
        if (piece.color != rook.color) {
          move.position.row = cRow;
          move.position.column = cColumn;
          move.canRemove = true;
          moves.push(move);
        } 
        canLeft = false;
      }
    } 
    else {
      canLeft = false;
    }

    //desno i levo za belog i crnog
    cRow = position.row;
    cColumn = position.column + 1;
    piece = board[cRow][cColumn];
    if (piece) {
      if (piece.name == Name.EMPTY) {
        move.position.row = cRow;
        move.position.column = cColumn;
        move.canRemove = false;
        moves.push(move);
      }
      else {
        if (piece.color != rook.color) {
          move.position.row = cRow;
          move.position.column = cColumn;
          move.canRemove = true;
          moves.push(move);
        } 
        canRight = false;
      }
    } 
    else {
      canRight = false;
    }

  }

  return moves;
}

function getBishopMoves(bishop: ChessPiece, board: ChessPiece[][], position: Position): Move[] {
  const moves: Move[] = [];

  let cRow, cColumn;
  let canTopLeftDia = true, canTopRightDia = true, canDownLeftDia = true, canDownRightDia = true;
  let piece;
  let move: Move = {position: position, canRemove: false};
  for (let i = 1; canTopLeftDia && canTopRightDia && canDownLeftDia && canDownRightDia; i++) {
    
    cRow = position.row + i;
    cColumn = position.column - i;
    piece = board[cRow][cColumn];
    if (piece) {
      if (piece.name == Name.EMPTY) {
        move.position.row = cRow;
        move.position.column = cColumn;
        move.canRemove = false;
        moves.push(move);
      }
      else {
        if (piece.color != bishop.color) {
          move.position.row = cRow;
          move.position.column = cColumn;
          move.canRemove = true;
          moves.push(move);
        } 
        canTopLeftDia = false;
      }
    } 
    else {
      canTopLeftDia = false;
    }

    cRow = position.row + i;
    cColumn = position.column - i;
    piece = board[cRow][cColumn];
    if (piece) {
      if (piece.name == Name.EMPTY) {
        move.position.row = cRow;
        move.position.column = cColumn;
        move.canRemove = false;
        moves.push(move);
      }
      else {
        if (piece.color != bishop.color) {
          move.position.row = cRow;
          move.position.column = cColumn;
          move.canRemove = true;
          moves.push(move);
        } 
        canTopRightDia = false;
      }
    } 
    else {
      canTopRightDia = false;
    }

    cRow = position.row - 1;
    cColumn = position.column - 1;
    piece = board[cRow][cColumn];
    if (piece) {
      if (piece.name == Name.EMPTY) {
        move.position.row = cRow;
        move.position.column = cColumn;
        move.canRemove = false;
        moves.push(move);
      }
      else {
        if (piece.color != bishop.color) {
          move.position.row = cRow;
          move.position.column = cColumn;
          move.canRemove = true;
          moves.push(move);
        } 
        canDownLeftDia = false;
      }
    } 
    else {
      canDownLeftDia = false;
    }

    cRow = position.row - 1;
    cColumn = position.column + 1;
    piece = board[cRow][cColumn];
    if (piece) {
      if (piece.name == Name.EMPTY) {
        move.position.row = cRow;
        move.position.column = cColumn;
        move.canRemove = false;
        moves.push(move);
      }
      else {
        if (piece.color != bishop.color) {
          move.position.row = cRow;
          move.position.column = cColumn;
          move.canRemove = true;
          moves.push(move);
        } 
        canDownRightDia = false;
      }
    } 
    else {
      canDownRightDia = false;
    }

  }

  return moves;
}

function getQueenMoves(queen: ChessPiece, board: ChessPiece[][], position: Position): Move[] {
  const moves: Move[] = [];

  moves.push(...getRookMoves(queen, board, position));
  moves.push(...getBishopMoves(queen, board, position));

  return moves;
}

function getKnightMoves(knight: ChessPiece, board: ChessPiece[][], position: Position): Move[] {
  return [ [1, 2], [1, -2], [-1, 2], [1, 2], [-2, 1], [-2, -1], [2, 1], [2, -1] ].map(pair => {
    return getKnightMove(knight, board, {row: position.row + pair[0], column: position.column + pair[1]});
  }).filter(move => move != null);
}

function getKnightMove(knight: ChessPiece, board: ChessPiece[][], position: Position): Move | null {
  let move: Move | null = null;

  if (board[position.row][position.column]) {
    if (board[position.row][position.column].name == Name.EMPTY) {
      move = {position: position, canRemove: false};
    }
    else if (board[position.row][position.column].color != knight.color) {
      move = {position: position, canRemove: true};
    }
  }

  return move;
}

function swapTwoPositionsOnTheBoard(board: ChessPiece[][], position1: Position, position2: Position) {
  const piece = board[position1.row][position1.column];
  board[position1.row][position1.column] = board[position2.row][position2.column];
  board[position2.row][position2.column] = piece;
}

// function getKingMoves(king: ChessPiece, board: ChessPiece[][], position: Position): Move[] {
//   const threatPositions = findPiecesThatThreatenTheKing(king, board);

//   //[ [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1] ].
// }


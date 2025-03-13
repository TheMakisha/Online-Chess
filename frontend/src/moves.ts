

//Ulaz: Pozicija figure
//Izlaz: Pozicije na koje figura sme da ode i ako ima neka figura koju moze da skloni polje ce biti obelezeno
/*

//Izlaz format: {
  field: "A1",
  canRemove?: true
}

*/
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

function getPawnMoves(pawn: Pawn, board: ChessPiece[][], position: Position): Move[] {
  if (pawn.color == Color.WHITE) return getWhitePawnMoves(pawn, board, position);
  else return getBlackPawnMoves(pawn, board, position);
}

function isPawnFirstMove(pawn: Pawn, position: Position): boolean {
  if (pawn.color == Color.WHITE && position.row == 1) 
    return true;
  if (pawn.color == Color.WHITE && position.row == 6) 
    return true;
  return false;
}

function getWhitePawnMoves(pawn: Pawn, board: ChessPiece[][], position: Position): Move[] {
  const moves: Move[] = [];
  let move: Move = {position: position, canRemove: false};

  const isFirstMove = isPawnFirstMove(pawn, position);
  if (board[position.row + 1][position.column].name == Name.EMPTY) {
    move = {position: {row: position.row + 1, column: position.column}, canRemove: false};
    moves.push(move);
    if (isFirstMove && board[position.row + 2][position.column].name == Name.EMPTY) {
      move = {position: {row: position.row + 2, column: position.column}, canRemove: false};
      moves.push(move);
    }
  }
  
  if (board[position.row + 1][position.column + 1].name != Name.EMPTY) {
    move.position.row += 1;
    move.position.column += 1;
    move.canRemove = true;
    moves.push(move);
  }

  if (board[position.row + 1][position.column - 1].name != Name.EMPTY) {
    move.position.row += 1;
    move.position.column -= 1;
    move.canRemove = true;
    moves.push(move);
  }

  return moves;
}

function getBlackPawnMoves(pawn: Pawn, board: ChessPiece[][], position: Position): Move[] {
  const moves: Move[] = [];
  let move: Move = {position: position, canRemove: false};
  
  const isFirstMove = isPawnFirstMove(pawn, position);
  if (board[position.row - 1][position.column].name == Name.EMPTY) {
    move = {position: {row: position.row - 1, column: position.column}, canRemove: false};
    moves.push(move);
    if (isFirstMove && board[position.row - 2][position.column].name == Name.EMPTY) {
      move = {position: {row: position.row - 2, column: position.column}, canRemove: false};
      moves.push(move);
    }
  }

  if (board[position.row - 1][position.column - 1].name != Name.EMPTY) {
    move.position.row -= 1;
    move.position.column -= 1;
    move.canRemove = true;
    moves.push(move);
  }

  if (board[position.row - 1][position.column + 1].name != Name.EMPTY) {
    move.position.row -= 1;
    move.position.column += 1;
    move.canRemove = true;
    moves.push(move);
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

// function getKingMoves(king: ChessPiece, board: ChessPiece[][], position: Position): Move[] {
//   const threatPositions = findPiecesThatThreatenTheKing(king, board);

//   //[ [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1] ].
// }

function findPiecesThatThreatenTheKing(king: ChessPiece, board: ChessPiece[][]): Position[] {
  const chessPiecePositions: Position[] = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j].name != Name.EMPTY && board[i][j].color != king.color) {
        const moves = getMoves(board, {row: i, column: j});
        moves.map(move => move.position).forEach(position => chessPiecePositions.push(position));
      }
    }
  }

  return chessPiecePositions;
}
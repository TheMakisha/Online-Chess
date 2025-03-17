
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

const EmptyPiece: ChessPiece = {
  name: Name.EMPTY,
  color: Color.WHITE
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

  //Dobili smo figuru na tabli koju igrac zeli da odigra
  //Prvo moramo da vidimo da li je igracev kralj u opasnosti(u checku)
  //Ako nije, onda cemo za izabranu figuru da generisemo sve one poteze koji ne stavljaju njegovog kralja u check
  //A to znaci da cemo za svaki moguci potez te figure(koja postuje osnovna pravila oko preskanja i slicno)
  //da vidimo da li ona stavlja kralja u opasnost
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

function isPawnFirstMove(pawn: Pawn, position: Position): boolean {
  if (pawn.color == Color.WHITE && position.row == 1) 
    return true;
  if (pawn.color == Color.WHITE && position.row == 6) 
    return true;
  return false;
} 

function getRookMoves(rook: ChessPiece, board: ChessPiece[][], position: Position): Move[] {
  return [[1, 0], [-1, 0], [0, 1], [0, -1]]
  .map(offset => {
    const positions: Position[] = [];
    let row = position.row, column = position.column;
    while (row > 0 && row < 7 && column > 0 && column < 7) {
      row += offset[0];
      column += offset[1];
      positions.push({row, column});
    }
    return positions;
  })
  .flatMap(direction => getRookMovesForOneDirection(rook, position, board, direction))
} 

function getRookMovesForOneDirection(rook: ChessPiece, rookPositon: Position, board: ChessPiece[][], positions: Position[]): Move[] {
  const moves: Move[] = [];

  for (const pos of positions) {
    if (board[pos.row][pos.column].name == Name.EMPTY) {
      swapTwoPositionsOnTheBoard(board, rookPositon, pos);
      const isKingInCheck = checkIfTheKingIsInCheck(board, rook.color);
      if (!isKingInCheck) {
        const move: Move = {position: pos, canRemove: false};
        moves.push(move);
      }
      swapTwoPositionsOnTheBoard(board, rookPositon, pos);
    }
    else {
      if (board[pos.row][pos.column].color != rook.color) {
        //moramo da uklonimo protivnicku figuru da bismo uspesno proverili da li se pravi check situacija za naseg kralja
        //jer ako samo swapujemo figure i proverimo moze se desiti da ta figura blokira neku svoju i dobijemo laznu potvrdu
        //da nema checka, a treba da skinemo figuru da bi utvrdili da li check nastaje.
        const piece = board[pos.row][pos.column];
        board[pos.row][pos.column] = EmptyPiece;
        swapTwoPositionsOnTheBoard(board, rookPositon, pos);
        const isKingInCheck = checkIfTheKingIsInCheck(board, rook.color);
        if (!isKingInCheck) {
          const move: Move = {position: pos, canRemove: true};
          moves.push(move);
        }
        swapTwoPositionsOnTheBoard(board, rookPositon, pos);
        board[pos.row][pos.column] = piece;
      }
    }
  }

  return moves;
}

function getBishopMoves(bishop: ChessPiece, board: ChessPiece[][], position: Position): Move[] {
  return [[1, -1], [1, 1], [-1, 1], [-1, -1]]
  .map(offset => {
    const positions: Position[] = [];
    let row = position.row, column = position.column;
    while (row > 0 && row < 7 && column > 0 && column < 7) {
      row += offset[0];
      column += offset[1];
      positions.push({row, column});
    }
    return positions;
  })
  .flatMap(direction => getBishopMovesForOneDirection(bishop, position, board, direction))
}

function getBishopMovesForOneDirection(bishop: ChessPiece, bishopPosition: Position, board: ChessPiece[][], positions: Position[]): Move[] {
  const moves: Move[] = [];

  for (const pos of positions) {
    if (board[pos.row][pos.column].name == Name.EMPTY) {
      swapTwoPositionsOnTheBoard(board, bishopPosition, pos);
      const isKingInCheck = checkIfTheKingIsInCheck(board, bishop.color);
      if (!isKingInCheck) {
        const move: Move = {position: pos, canRemove: false};
        moves.push(move);
      }
      swapTwoPositionsOnTheBoard(board, bishopPosition, pos);
    }
    else {
      if (board[pos.row][pos.column].color != bishop.color) {
        //moramo da uklonimo protivnicku figuru da bismo uspesno proverili da li se pravi check situacija za naseg kralja
        //jer ako samo swapujemo figure i proverimo moze se desiti da ta figura blokira neku svoju i dobijemo laznu potvrdu
        //da nema checka, a treba da skinemo figuru da bi utvrdili da li check nastaje.
        const piece = board[pos.row][pos.column];
        board[pos.row][pos.column] = EmptyPiece;
        swapTwoPositionsOnTheBoard(board, bishopPosition, pos);
        const isKingInCheck = checkIfTheKingIsInCheck(board, bishop.color);
        if (!isKingInCheck) {
          const move: Move = {position: pos, canRemove: true};
          moves.push(move);
        }
        swapTwoPositionsOnTheBoard(board, bishopPosition, pos);
        board[pos.row][pos.column] = piece;
      }
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
  return [ [1, 2], [1, -2], [-1, 2], [1, 2], [-2, 1], [-2, -1], [2, 1], [2, -1] ]
  .filter(pair => board[position.row + pair[0]][position.column + pair[1]] != undefined)
  .map(pair => {
    return getKnightMove(knight, position, board, {row: pair[0], column: pair[1]});
  })
  .filter(move => move != null);
}

function getKnightMove(knight: ChessPiece, knightPosition: Position, board: ChessPiece[][], position: Position): Move | null {
  let move: Move | null = null;

  if (board[position.row][position.column].name == Name.EMPTY) {
    swapTwoPositionsOnTheBoard(board, knightPosition, position);
    const isKingInCheck = checkIfTheKingIsInCheck(board, knight.color);
    if (!isKingInCheck) {
      move = {position, canRemove: false};
    }
    swapTwoPositionsOnTheBoard(board, knightPosition, position);
  }
  else {
    if (board[position.row][position.column].color != knight.color) {
      const piece = board[position.row][position.column];
      board[position.row][position.column] = EmptyPiece;
      swapTwoPositionsOnTheBoard(board, knightPosition, position);
      const isKingInCheck = checkIfTheKingIsInCheck(board, knight.color);
      if (!isKingInCheck) {
        move = {position, canRemove: true};
      }
      swapTwoPositionsOnTheBoard(board, knightPosition, position);
      board[position.row][position.column] = piece;
    }
  }

  return move;
}

function getKingMoves(king: ChessPiece, board: ChessPiece[][], position: Position): Move[] {
  return [ [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1] ]
  .filter( pair => board[position.row + pair[0]][position.column + pair[1]] != undefined)
  .map( pair => getKingMove(king, position, board, {row: pair[0], column: pair[1]}) )
  .filter(move => move != null);
}

function getKingMove(king: ChessPiece, kingPosition: Position, board: ChessPiece[][], position: Position): Move | null {
  let move: Move | null = null;

  if (board[position.row][position.column].name == Name.EMPTY) {
    swapTwoPositionsOnTheBoard(board, kingPosition, position);
    const isKingInCheck = checkIfTheKingIsInCheck(board, king.color);
    if (!isKingInCheck) {
      move = {position, canRemove: false};
    }
    swapTwoPositionsOnTheBoard(board, kingPosition, position);
  }
  else {
    if (board[position.row][position.column].color != king.color) {
      const piece = board[position.row][position.column];
      board[position.row][position.column] = EmptyPiece;
      swapTwoPositionsOnTheBoard(board, kingPosition, position);
      const isKingInCheck = checkIfTheKingIsInCheck(board, king.color);
      if (!isKingInCheck) {
        move = {position, canRemove: true};
      }
      swapTwoPositionsOnTheBoard(board, kingPosition, position);
      board[position.row][position.column] = piece;
    }
  }

  return move;
}

function swapTwoPositionsOnTheBoard(board: ChessPiece[][], position1: Position, position2: Position) {
  const piece = board[position1.row][position1.column];
  board[position1.row][position1.column] = board[position2.row][position2.column];
  board[position2.row][position2.column] = piece;
}

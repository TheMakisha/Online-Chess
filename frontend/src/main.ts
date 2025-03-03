
type PieceType = "pawn" | "rook" | "king" | "queen" | "bishop" | "knight";
type PieceColor = "black" | "white";
type ChessField = Piece | "EMPTY";

//knight - skakac - ide u L
//bishop - lovac - ide dijagonalno
//rook - top - gore/dole/levo desno

interface Piece {
  type: PieceType;
  color: PieceColor;
}

interface GameState {
  board: ChessField[][];
}


function gMoves(board: ChessField[][], i: number, j: number) {
  const piece = board[i][j] as Piece;
  const positions = [];
  if (piece.type === "pawn") {
    gPawnMoves(board, i, j);
  }
  else if (piece.type === "rook") {
    gRookMoves(board, i, j);
  }
  else if (piece.type === "knight") {
    gKnightMoves(board, i, j);
  }
  else if (piece.type === "bishop") {
    gBishopMoves(board, i, j);
  }
  else if (piece.type === "queen") {
    gQueenMoves(board, i, j);
  }
  else {
    gKingMoves(board, i, j);
  }
}

function gPawnMoves(board: ChessField[][], i: number, j: number) {
  const piece = board[i][j] as Piece;
  const positions = [];

  if (piece.color === "white") {
    if (board[i + 1][j - 1] !== undefined) {
      const otherPiece = board[i + 1][j - 1] as Piece;
      if (board[i + 1][j - 1] !== "EMPTY" && otherPiece.color === "black") {
        positions.push({
          field: { i: i + 1, j: j - 1 },
          canRemove: true
        });
      }
    }
    if (board[i + 1][j - 1] !== undefined) {
      const otherPiece = board[i + 1][j - 1] as Piece;
      if (board[i + 1][j - 1] !== "EMPTY" && otherPiece.color === "black") {
        positions.push({
          field: { i: i + 1, j: j - 1 },
          canRemove: true
        });
      }
    }
    if (board[i + 1][j] !== undefined && board[i + 1][j] === "EMPTY") {
      positions.push({
        field: { i: i + 1, j: j }
      });
    }
    if (i === 1) {
      if (board[3][j] !== "EMPTY") {
        positions.push({
          field: { i: 3, j: j }
        });
      }
    }
  }
  else {
    if (board[i - 1][j - 1] !== undefined) {
      const otherPiece = board[i - 1][j - 1] as Piece;
      if (board[i - 1][j - 1] !== "EMPTY" && otherPiece.color === "white") {
        positions.push({
          field: { i: i - 1, j: j - 1 },
          canRemove: true
        });
      }
    }
    if (board[i - 1][j - 1] !== undefined) {
      const otherPiece = board[i - 1][j - 1] as Piece;
      if (board[i - 1][j - 1] !== "EMPTY" && otherPiece.color === "white") {
        positions.push({
          field: { i: i - 1, j: j - 1 },
          canRemove: true
        });
      }
    }
    if (board[i - 1][j] !== undefined && board[i - 1][j] === "EMPTY") {
      positions.push({
        field: { i: i - 1, j: j }
      });
    }
    if (i === 6) {
      if (board[6][j] !== "EMPTY") {
        positions.push({
          field: { i: 6, j: j }
        });
      }
    }
  }

  return positions;
}

function gRookMoves(board: ChessField[][], i: number, j: number): any {
  const piece = board[i][j] as Piece;
  const positions = [];

  //idemo gore
  for (let k = 1; board[i + k][j]; k++) {
    if (board[i + k][j] === "EMPTY") {
      positions.push({
        field: {
          i: i + k, 
          j: j
        }
      })
    }
    else {
      if ((<Piece>board[i + k][j]).color !== piece.color) {
        positions.push({
          field: {
            i: i + k,
            j: j
          },
          canRemove: true
        });
      }
      break;
    }
  }
  //idemo dole
  for (let k = 1; board[i - k][j]; k++) {
    if (board[i - k][j] === "EMPTY") {
      positions.push({
        field: {
          i: i - k, 
          j: j
        }
      })
    }
    else {
      if ((<Piece>board[i - k][j]).color !== piece.color) {
        positions.push({
          field: {
            i: i - k,
            j: j
          },
          canRemove: true
        });
      }
      break;
    }
  }
  //idemo levo
  for (let k = 1; board[i][j - k]; k++) {
    if (board[i][j - k] === "EMPTY") {
      positions.push({
        field: {
          i: i, 
          j: j - k
        }
      })
    }
    else {
      if ((<Piece>board[i][j - k]).color !== piece.color) {
        positions.push({
          field: {
            i: i,
            j: j - k
          },
          canRemove: true
        });
      }
      break;
    }
  }
  //idemo desno
  for (let k = 1; board[i][j + k]; k++) {
    if (board[i][j + k] === "EMPTY") {
      positions.push({
        field: {
          i: i, 
          j: j + k
        }
      })
    }
    else {
      if ((<Piece>board[i][j + k]).color !== piece.color) {
        positions.push({
          field: {
            i: i,
            j: j + k
          },
          canRemove: true
        });
      }
      break;
    }
  }
}

//Skakac potezi
function gKnightMoves(board: ChessField[][], i: number, j: number): any {
  const piece = board[i][j] as Piece;
  const positions = [];
  
  positions.push(...gLeftKnightMoves(board, i, j));
  positions.push(...gRightKnightMoves(board, i, j));
  positions.push(...gTopKnightMoves(board, i, j));
  positions.push(...gBottomKnightMoves(board, i, j));

  return positions;

}

function gLeftKnightMoves(board: ChessField[][], i: number, j: number): any {
  const piece = board[i][j] as Piece;
  const positions = [];

  if (board[i + 1][j - 2]) {
    if (board[i + 1][j - 2] === "EMPTY") {
      positions.push({
        field: {i: i + 1, j: j - 2}
      });
    }
    else {
      if ((<Piece>board[i + 1][j - 2]).color !== piece.color) {
        positions.push({
          field: {i: i + 1, j: j - 2},
          canRemove: true
        })
      }
    }
  }
  if (board[i - 1][j - 2]) {
    if (board[i - 1][j - 2] === "EMPTY") {
      positions.push({
        field: {i: i - 1, j: j - 2}
      });
    }
    else {
      if ((<Piece>board[i - 1][j - 2]).color !== piece.color) {
        positions.push({
          field: {i: i - 1, j: j - 2},
          canRemove: true
        });
      }
    }
  }
}

function gRightKnightMoves(board: ChessField[][], i: number, j: number): any {
  const piece = board[i][j] as Piece;
  const positions = [];

  if (board[i + 1][j + 2]) {
    if (board[i + 1][j + 2] === "EMPTY") {
      positions.push({
        field: {i: i + 1, j: j + 2}
      });
    }
    else {
      if ((<Piece>board[i + 1][j + 2]).color !== piece.color) {
        positions.push({
          field: {i: i + 1, j: j + 2},
          canRemove: true
        })
      }
    }
  }
  if (board[i - 1][j + 2]) {
    if (board[i - 1][j + 2] === "EMPTY") {
      positions.push({
        field: {i: i - 1, j: j + 2}
      });
    }
    else {
      if ((<Piece>board[i - 1][j + 2]).color !== piece.color) {
        positions.push({
          field: {i: i - 1, j: j + 2},
          canRemove: true
        });
      }
    }
  }
}

function gTopKnightMoves(board: ChessField[][], i: number, j: number): any {
  const piece = board[i][j] as Piece;
  const positions = [];

  if (board[i + 2][j - 1]) {
    if (board[i + 2][j - 1] === "EMPTY") {
      positions.push({
        field: {i: i + 2, j: j - 1}
      });
    }
    else {
      if ((<Piece>board[i + 2][j - 1]).color !== piece.color) {
        positions.push({
          field: {i: i + 2, j: j - 1},
          canRemove: true
        })
      }
    }
  }

  if (board[i + 2][j + 1]) {
    if (board[i + 2][j + 1] === "EMPTY") {
      positions.push({
        field: {i: i + 2, j: j + 1}
      });
    }
    else {
      if ((<Piece>board[i + 2][j - 1]).color !== piece.color) {
        positions.push({
          field: {i: i + 2, j: j - 1},
          canRemove: true
        });
      }
    }
  }
}

function gBottomKnightMoves(board: ChessField[][], i: number, j: number): any {
  const piece = board[i][j] as Piece;
  const positions = [];

  if (board[i - 2][j - 1]) {
    if (board[i - 2][j - 1] === "EMPTY") {
      positions.push({
        field: {i: i - 2, j: j - 1}
      });
    }
    else {
      if ((<Piece>board[i - 2][j - 1]).color !== piece.color) {
        positions.push({
          field: {i: i - 2, j: j - 1},
          canRemove: true
        })
      }
    }
  }

  if (board[i - 2][j + 1]) {
    if (board[i - 2][j + 1] === "EMPTY") {
      positions.push({
        field: {i: i - 2, j: j + 1}
      });
    }
    else {
      if ((<Piece>board[i - 2][j + 1]).color !== piece.color) {
        positions.push({
          field: {i: i - 2, j: j + 1},
          canRemove: true
        });
      }
    }
  }
}

function gBishopMoves(board: ChessField[][], i: number, j: number): any {
  const piece = board[i][j] as Piece;
  const positions = [];
  
  for (let k = 1; board[i + k][j + k]; k++) {
    if (board[i + k][j + k] === "EMPTY") {
      positions.push({
        field: {i: i + k, j: j + k}
      });
    }
    else {
      if ((<Piece>board[i + k][j + k]).color !== piece.color) {
        positions.push({
          field: {i: i + k, j: j + k},
          canRemove: true
        });
      }
      break;
    }
  }

  for (let k = 1; board[i + k][j - k]; k++) {
    if (board[i + k][j - k] === "EMPTY") {
      positions.push({
        field: {i: i + k, j: j - k}
      });
    }
    else {
      if ((<Piece>board[i + k][j - k]).color !== piece.color) {
        positions.push({
          field: {i: i + k, j: j - k},
          canRemove: true
        });
      }
      break;
    }
  }

  for (let k = 1; board[i - k][j + k]; k++) {
    if (board[i - k][j + k] === "EMPTY") {
      positions.push({
        field: {i: i - k, j: j + k}
      });
    }
    else {
      if ((<Piece>board[i - k][j + k]).color !== piece.color) {
        positions.push({
          field: {i: i - k, j: j + k},
          canRemove: true
        });
      }
      break;
    }
  }

  for (let k = 1; board[i - k][j - k]; k++) {
    if (board[i - k][j - k] === "EMPTY") {
      positions.push({
        field: {i: i - k, j: j - k}
      });
    }
    else {
      if ((<Piece>board[i - k][j - k]).color !== piece.color) {
        positions.push({
          field: {i: i - k, j: j - k},
          canRemove: true
        });
      }
      break;
    }
  }
}

function gQueenMoves(board: ChessField[][], i: number, j: number) {
  const positions = [];
  positions.push(...gRookMoves(board, i, j))
  positions.push(...gBishopMoves(board, i, j));
  return positions;
}

function gKingMoves(board: ChessField[][], i: number, j: number) {
  
}


const board: ChessField[][] = [];
boardInit(board);
printBoard(board);


function printBoard(board: ChessField[][]) {
  for (let i = 0; i < 8; i++) {
    console.log(board[i]);
  }
}

function boardInit(board: ChessField[][]) {
  for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i][j] = "EMPTY";
    }
  }

  board[0][0] = board[0][7] = { color: "white", type: "rook" };
  board[0][1] = board[0][6] = { color: "white", type: "knight" };
  board[0][2] = board[0][5] = { color: "white", type: "bishop" };
  board[0][3] = { color: "white", type: "queen" };
  board[0][4] = { color: "white", type: "king" };
  board[1].fill({ color: "white", type: "pawn" });

  board[7][0] = board[7][7] = { color: "black", type: "rook" };
  board[7][1] = board[7][6] = { color: "black", type: "knight" };
  board[7][2] = board[7][5] = { color: "black", type: "bishop" };
  board[7][3] = { color: "black", type: "queen" };
  board[7][4] = { color: "black", type: "king" };
  board[6].fill({ color: "black", type: "pawn" });

}
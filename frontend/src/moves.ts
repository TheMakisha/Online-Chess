

//Ulaz: Pozicija figure
//Izlaz: Pozicije na koje figura sme da ode i ako ima neka figura koju moze da skloni polje ce biti obelezeno
/*

//Izlaz format: {
  field: "A1",
  canRemove?: true
}

*/

import { ChessField, OutputMoves, Piece } from "./types";


function generateMoves(board: ChessField[][], row: number, column: number): OutputMoves[] {
  const piece = <Piece> board[row][column];
  let moves: OutputMoves[] = [];

  switch (piece.type) {
    case "pawn": moves.push(...generatePawnMoves(board, row, column)); break;
    case "rook": moves.push(...generateRookMoves(board, row, column)); break;
    case "knight": moves.push(...generateKnightMoves(board, row, column)); break;
    case "bishop": moves.push(...generateBishopMoves(board, row, column)); break;
    case "queen": moves.push(...generateQueenMoves(board, row, column)); break;
  }

  return moves;
}

function generatePawnMoves(board: ChessField[][], row: number, column: number): OutputMoves[] {
  return [];
}

function generateRookMoves(board: ChessField[][], row: number, column: number): OutputMoves[] {
  return [];
}

function generateKnightMoves(board: ChessField[][], row: number, column: number): OutputMoves[] {
  return [];
}

function generateBishopMoves(board: ChessField[][], row: number, column: number): OutputMoves[] {
  return [];
}

function generateQueenMoves(board: ChessField[][], row: number, column: number): OutputMoves[] {
  return [];
}
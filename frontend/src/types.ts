

export interface Piece {
    type: PieceType;
    color: PieceColor;
}

export interface OutputMoves {
    field: {
      row: number, 
      column: number
    },
    canRemove: boolean
  }

export type PieceType = "pawn" | "rook" | "king" | "queen" | "bishop" | "knight";
export type PieceColor = "black" | "white";
export type ChessField = Piece | "EMPTY";
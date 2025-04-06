export interface BaseWinner {
  wins: number,
  time: number
}

export interface Winner extends BaseWinner {
  id: number,
}

export interface getWinnersResponse {
  winners: Winner[];
  total: number;
}

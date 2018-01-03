import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class BluffGameService {
  static apiUrl = 'https://cardsgameapi.herokuapp.com/bluff/';
  // static apiUrl = 'http://localhost:8989/bluff/';
  static playerKey = '';

  constructor(private http: HttpClient) { }

  startGame(deckCount: number): Observable<boolean> {
    return this.http.get<boolean>(BluffGameService.apiUrl + 'start?deckCount=' + deckCount);
  }

  isGameStarted(): Observable<boolean> {
    return this.http.get<boolean>(BluffGameService.apiUrl + 'started');
  }

  createPlayer(playerName: string): Observable<any> {
    return this.http.post(BluffGameService.apiUrl + 'addPlayer', playerName, {responseType: 'json'});
  }

  getPlayers(): Observable<any> {
    return this.http.get(BluffGameService.apiUrl + 'players');
  }

  getWinners(): Observable<any> {
    return this.http.get(BluffGameService.apiUrl + 'winners');
  }

  getActivePlayer(): Observable<any> {
    return this.http.get(BluffGameService.apiUrl + 'activePlayer');
  }

  getPlayerCards(): Observable<any> {
    return this.http.get(BluffGameService.apiUrl + BluffGameService.playerKey + '/cards');
  }

  throwCards(cards: any, bluffedCard: string): Observable<boolean> {
    return this.http.post<boolean>(BluffGameService.apiUrl + BluffGameService.playerKey + '/throughCards/' + bluffedCard, cards);
  }

  show(): Observable<any> {
    return this.http.get(BluffGameService.apiUrl + BluffGameService.playerKey + '/showCards');
  }

  bluffed(): Observable<any> {
    return this.http.get(BluffGameService.apiUrl + 'bluffed');
  }

  pass(): Observable<boolean> {
    return this.http.get<boolean>(BluffGameService.apiUrl + BluffGameService.playerKey + '/pass');
  }

  leaveGame(): Observable<boolean> {
    return this.http.delete<boolean>(BluffGameService.apiUrl + BluffGameService.playerKey + '/removePlayer');
  }

  stopGame(): Observable<boolean> {
    return this.http.delete<boolean>(BluffGameService.apiUrl + '/stop');
  }
}

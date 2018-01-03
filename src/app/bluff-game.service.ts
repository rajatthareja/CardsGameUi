import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import { environment } from '../environments/environment';

@Injectable()
export class BluffGameService {
  private apiUrl = environment.production ? 'https://cardsgameapi.herokuapp.com/bluff/' : 'http://localhost:8989/bluff/';
  playerKey = '';

  constructor(private http: HttpClient) { }

  startGame(deckCount: number): Observable<boolean> {
    return this.http.get<boolean>(this.apiUrl + 'start?deckCount=' + deckCount);
  }

  isGameStarted(): Observable<boolean> {
    return this.http.get<boolean>(this.apiUrl + 'started');
  }

  createPlayer(playerName: string): Observable<any> {
    return this.http.post(this.apiUrl + 'addPlayer', playerName, {responseType: 'json'});
  }

  getPlayers(): Observable<any> {
    return this.http.get(this.apiUrl + 'players');
  }

  getWinners(): Observable<any> {
    return this.http.get(this.apiUrl + 'winners');
  }

  getActivePlayer(): Observable<any> {
    return this.http.get(this.apiUrl + 'activePlayer');
  }

  getPlayerCards(): Observable<any> {
    return this.http.get(this.apiUrl + this.playerKey + '/cards');
  }

  throwCards(cards: any, bluffedCard: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl + this.playerKey + '/throughCards/' + bluffedCard, cards);
  }

  show(): Observable<any> {
    return this.http.get(this.apiUrl + this.playerKey + '/showCards');
  }

  bluffed(): Observable<any> {
    return this.http.get(this.apiUrl + 'bluffed');
  }

  pass(): Observable<boolean> {
    return this.http.get<boolean>(this.apiUrl + this.playerKey + '/pass');
  }

  leaveGame(): Observable<boolean> {
    return this.http.delete<boolean>(this.apiUrl + this.playerKey + '/removePlayer');
  }
}

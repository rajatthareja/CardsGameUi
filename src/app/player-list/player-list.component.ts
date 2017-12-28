import { Component, OnInit } from '@angular/core';
import {BluffGameService} from "../bluff-game.service";

@Component({
  selector: 'player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {
  players = {};
  playersIds = [];
  winners = [];

  get activePlayerId(): string {
    return BluffGameService.activePlayerId;
  }

  constructor(private service: BluffGameService) { }

  updatePlayersList(): void {
    this.service.getPlayers().subscribe(players => {
      this.players = players;
      this.playersIds = Object.keys(this.players);
    });
  }

  updateWinnerList(): void {
    this.service.getWinners().subscribe(players => {
      this.winners = players;
    });
  }

  updateActivePlayerId(): void {
    this.service.getActivePlayer().subscribe(playerId => {
      BluffGameService.activePlayerId = playerId;
    });
  }

  ngOnInit(): void {
    this.updatePlayersList();
    this.updateWinnerList();
    this.updateActivePlayerId();
    setInterval(() => this.updatePlayersList(), 1000);
    setInterval(() => this.updateWinnerList(), 1000);
    setInterval(() => this.updateActivePlayerId(), 1000);
  }
}

import {Component, HostListener} from '@angular/core';
import {BluffGameService} from "./bluff-game.service";

@Component({
  selector: 'app-bluff',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  playerName = '';
  playerCreated = false;
  gameStarted = false;
  deckCount = 1;

  constructor(private service: BluffGameService) { }

  startGame() {
    this.service.startGame(this.deckCount).subscribe(started => {
      this.gameStarted = started;
    });
  }

  leaveGame() {
    this.service.leaveGame().subscribe(leave => {
      if (leave) {
        this.playerCreated = false;
        BluffGameService.playerKey = '';
        BluffGameService.playerId = '';
      }
    });
  }

  updateGame() {
    this.service.isGameStarted().subscribe(started => {
      this.gameStarted = started;
    });
  }

  createPlayer() {
    if (this.playerName != '') {
      this.service.createPlayer(this.playerName);
      this.playerCreated = true;
    }
  }

  ngOnInit() {
    this.updateGame();
    setInterval(() => this.updateGame(), 1000);
  }

  @HostListener('window:beforeunload', [ '$event' ])
  onUnload(event) {
    if (this.playerCreated) {
      this.service.leaveGame().subscribe();
      event.returnValue = "Are you sure?";
    }
  }
}

import {Component, HostListener} from '@angular/core';
import {BluffGameService} from "./bluff-game.service";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../environments/environment';

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
  players = {};
  playersIds = [];
  winners = [];
  cards = [];
  selectedCards = [];
  selectedBluffedCardRank = '';
  bluffedCardRank = 'null';
  bluffed = {};
  activePlayerId = '';
  playerId = '';

  openCards = [];
  info = [];
  infoIcon = ' ⓘ';
  winnerColors = ['yellow-text text-darken-2', 'grey-text text-darken-5', 'brown-text text-darken-2'];
  cardRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  private socketUrl = environment.production ? 'https://cardsgameapi.herokuapp.com/socket' : 'http://localhost:8989/socket';
  private stompClient;

  constructor(private service: BluffGameService) {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(){
    let ws = new SockJS(this.socketUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/players", (message) => {
        if(message.body) {
          that.players = JSON.parse(message.body);
          that.playersIds = Object.keys(that.players);
        }
      });
      that.stompClient.subscribe("/started", (message) => {
        if(message.body) {
          that.gameStarted = message.body == 'true';
        }
      });
      that.stompClient.subscribe("/activePlayerId", (message) => {
        if(message.body) {
          that.activePlayerId = message.body;
          that.getCards();
          that.getBluffedData();
          that.getPlayersList();
          that.getWinnerList();
        }
      });
    });
  }

  update(update: string ) {
    this.stompClient.send("/app/update", {}, update);
  }

  get isBluffedRankNull(): boolean {
    return this.bluffedCardRank == "null";
  }

  get isPlayerActive(): boolean {
    return this.playerId == this.activePlayerId
  }

  createPlayer() {
    if (this.playerName != '') {
      if (this.service.playerKey == '') {
        this.service.createPlayer(this.playerName).subscribe(playerData => {
          this.playerId = playerData['id'];
          this.service.playerKey = playerData['key'];
          this.playerCreated = true;
          this.update('players');
        });
      }
    }
  }

  leaveGame() {
    this.service.leaveGame().subscribe(leave => {
      if (leave) {
        this.playerCreated = false;
        this.service.playerKey = '';
        this.playerId = '';
        this.update('started');
        this.update('activePlayerId');
      }
    });
  }

  startGame() {
    this.service.startGame(this.deckCount).subscribe(started => {
      this.gameStarted = started;
      this.update('started');
      this.update('activePlayerId');
    });
  }

  getGameStatus() {
    this.service.isGameStarted().subscribe(started => {
      this.gameStarted = started;
    });
  }

  getPlayersList(): void {
    this.service.getPlayers().subscribe(players => {
      this.players = players;
      this.playersIds = Object.keys(this.players);
      if (!this.players[this.playerId]) {
        this.playerCreated = false;
        this.service.playerKey = '';
        this.playerId = '';
        this.getGameStatus();
      }
    });
  }

  getWinnerList(): void {
    this.service.getWinners().subscribe(players => {
      this.winners = players;
    });
  }

  getActivePlayerId(): void {
    this.service.getActivePlayer().subscribe(playerId => {
      this.activePlayerId = playerId;
    });
  }

  getBluffedData() {
    this.service.bluffed().subscribe(bluffed => {
      this.bluffed = bluffed;
      this.bluffedCardRank = this.bluffed['cardRank']
    });
  }

  getCards() {
    if (this.service.playerKey != '') {
      this.service.getPlayerCards().subscribe(cards => {
        this.cards = cards;
      });
    }
  }

  throwCards() {
    if (this.selectedCards.length > 0){
      if (this.selectedBluffedCardRank == '') {
        this.selectedBluffedCardRank = this.bluffedCardRank;
      }
      if (this.selectedBluffedCardRank != 'null'){
        this.service.throwCards(this.selectedCards, this.selectedBluffedCardRank).subscribe(isThrow => {
          if (isThrow) {
            this.selectedCards = [];
            this.update('activePlayerId');
            this.selectedBluffedCardRank = '';
          }
        });
      }
    }
  }

  show() {
    this.service.show().subscribe(cards =>{
      this.openCards = cards;
      this.update('activePlayerId');
      this.selectedCards = [];
    });
  }

  pass() {
    this.service.pass().subscribe(isPass => {
      if (isPass) {
        this.selectedCards = [];
        this.update('activePlayerId');
      }
    });
  }

  selectCard(event, card) {
    if (this.isPlayerActive){
      if (event.currentTarget.className.search("selected") == -1){
        event.currentTarget.className = "card red lighten-4 hoverable valign-wrapper center-align selected z-depth-4";
        this.selectedCards.push(card);
      } else {
        event.currentTarget.className = "card red lighten-5 hoverable valign-wrapper center-align";
        this.selectedCards = this.selectedCards.filter(function (element, index, newCards) {
          return !(element['rank'] === card['rank'] && element['suit'] === card['suit']);
        });
      }
    }
  }

  selectRank(event, rank){
    if (this.selectedBluffedCardRank != ''){
      for(let rk of event.currentTarget.parentElement.children){
        rk.className = "collection-item center";
      }
    }
    this.selectedBluffedCardRank = rank;
    event.currentTarget.className = "collection-item center active";
  }

  getInfo(event){
    if(this.infoIcon == ' ⓘ'){
      this.info = ['Throw', 'Show', 'Pass'];
      this.infoIcon = " X";
    } else {
      this.info = ['', '', ''];
      this.infoIcon = ' ⓘ';
    }
  }

  clearOpenCards(){
    this.openCards = [];
  }

  ngOnInit() {
    this.getGameStatus();
    this.getPlayersList();
    this.getWinnerList();
    this.getActivePlayerId();
    this.getBluffedData();
  }

  @HostListener('window:beforeunload', [ '$event' ])
  onUnload(event) {
    if (this.playerCreated) {
      this.leaveGame();
      event.returnValue = "Are you sure?";
    }
  }
}

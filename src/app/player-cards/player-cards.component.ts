import { Component, OnInit } from '@angular/core';
import {BluffGameService} from "../bluff-game.service";

@Component({
  selector: 'player-cards',
  templateUrl: './player-cards.component.html',
  styleUrls: ['./player-cards.component.css']
})
export class PlayerCardsComponent implements OnInit {
  cards = [];
  selectedCards = [];
  cardRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  bluffedCardRank = '';
  bluffed = {};
  openCards = [];
  info = [];
  infoIcon = '>>';

  getBluffedData() {
    this.service.bluffed().subscribe(bluffed => {
      this.bluffed = bluffed;
      BluffGameService.bluffedCardRank = this.bluffed['cardRank']
    });
  }

  get isBluffedRankNull(): boolean {
    return BluffGameService.bluffedCardRank == "null";
  }

  get isPlayerActive(): boolean {
    return BluffGameService.playerId == BluffGameService.activePlayerId
  }

  constructor(private service: BluffGameService) { }

  getCards() {
    this.service.getPlayerCards().subscribe(cards => {
      this.cards = cards;
    });
  }

  updateCards() {
    if (!this.isPlayerActive) {
      this.getCards();
    }
  }

  selectCard(event, card) {
    if (this.isPlayerActive){
      if (event.currentTarget.className.search("selected") == -1){
        event.currentTarget.className = "card red lighten-4 hoverable valign-wrapper center-align selected z-depth-4";
        this.selectedCards.push(card);
      } else {
        event.currentTarget.className = "card red lighten-5 hoverable valign-wrapper center-align";
        var newCards = this.selectedCards.filter(function (element, index, newCards) {
          return !(element['rank'] === card['rank'] && element['suit'] === card['suit']);
        });
        this.selectedCards = newCards;
      }
    }
  }

  getInfo(event){
    if(this.infoIcon == '>>'){
      this.info = ['throw', 'show', 'pass'];
      this.infoIcon = "<<";
    } else {
      this.info = ['', '', ''];
      this.infoIcon = ">>";
    }
  }

  selectRank(event, rank){
    if (this.bluffedCardRank != ''){
      for(let rk of event.currentTarget.parentElement.children){
        rk.className = "collection-item center";
      }
    }
    this.bluffedCardRank = rank;
    event.currentTarget.className = "collection-item center active";
  }

  clearOpenCards(){
    this.openCards = [];
  }

  throwCards() {
    if (this.selectedCards.length > 0){
      if (this.bluffedCardRank == '') {
        this.bluffedCardRank = BluffGameService.bluffedCardRank;
      }
      if (this.bluffedCardRank != 'null'){
        this.service.throwCards(this.selectedCards, this.bluffedCardRank).subscribe(isThrow => {
          if (isThrow) {
            this.selectedCards = [];
          }
        });
        this.getCards();
      }
    }
    this.bluffedCardRank = '';
  }

  show() {
    this.service.show().subscribe(cards =>{
      this.openCards = cards;
    });
    this.getCards();
    this.selectedCards = [];
  }

  pass() {
    this.service.pass().subscribe(isPass => {
      if (isPass) {
        this.selectedCards = [];
      }
    });
  }

  ngOnInit() {
    this.getCards();
    this.getBluffedData();
    setInterval(() => this.updateCards(), 1000);
    setInterval(() => this.getBluffedData(), 1000);
  }
}

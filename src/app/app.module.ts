import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { PlayerListComponent } from './player-list/player-list.component';
import {BluffGameService} from "./bluff-game.service";
import { PlayerCardsComponent } from './player-cards/player-cards.component';


@NgModule({
  declarations: [
    AppComponent,
    PlayerListComponent,
    PlayerCardsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [BluffGameService],
  bootstrap: [AppComponent]
})
export class AppModule { }

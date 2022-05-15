import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { LgButtonComponent } from './components/lg-button/lg-button.component';
import { LgInputComponent } from './components/lg-input/lg-input.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LgButtonComponent,
    LgInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

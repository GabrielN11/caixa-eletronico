import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { LgButtonComponent } from './components/lg-button/lg-button.component';
import { PanelComponent } from './pages/panel/panel.component';
import { WarningComponent } from './components/warning/warning.component';
import { LoadingComponent } from './components/loading/loading.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { BalanceComponent } from './pages/balance/balance.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { AdminPanelComponent } from './pages/admin/admin-panel/admin-panel.component';
import { ClientFormComponent } from './pages/admin/client-form/client-form.component';
import { ClientListComponent } from './pages/admin/client-list/client-list.component';
import { AccountFormComponent } from './pages/admin/account-form/account-form.component';
import { AccountListComponent } from './pages/admin/account-list/account-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LgButtonComponent,
    PanelComponent,
    WarningComponent,
    LoadingComponent,
    TransactionsComponent,
    BalanceComponent,
    TransferComponent,
    DepositComponent,
    WithdrawComponent,
    AdminLoginComponent,
    AdminPanelComponent,
    ClientFormComponent,
    ClientListComponent,
    AccountFormComponent,
    AccountListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

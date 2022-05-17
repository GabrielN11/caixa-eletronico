import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './pages/main/main.component';
import { PanelComponent } from './pages/panel/panel.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { BalanceComponent } from './pages/balance/balance.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'client',
    component: PanelComponent
  },
  {
    path: 'transactions',
    component: TransactionsComponent
  },
  {
    path: 'balance',
    component: BalanceComponent
  },
  {
    path: 'transfer',
    component: TransferComponent
  },
  {
    path: 'deposit',
    component: DepositComponent
  },
  {
    path: 'withdraw',
    component: WithdrawComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

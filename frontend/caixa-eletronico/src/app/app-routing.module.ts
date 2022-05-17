import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './pages/main/main.component';
import { PanelComponent } from './pages/panel/panel.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { BalanceComponent } from './pages/balance/balance.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { AdminPanelComponent } from './pages/admin/admin-panel/admin-panel.component';

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
  },
  {
    path: 'admin',
    component: AdminLoginComponent
  },
  {
    path: 'admin/panel',
    component: AdminPanelComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

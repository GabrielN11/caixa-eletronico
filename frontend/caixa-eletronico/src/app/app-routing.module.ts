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
import { ClientFormComponent } from './pages/admin/client-form/client-form.component';
import { ClientListComponent } from './pages/admin/client-list/client-list.component';
import { AccountFormComponent } from './pages/admin/account-form/account-form.component';
import { AccountListComponent } from './pages/admin/account-list/account-list.component';
import { AtmComponent } from './pages/admin/atm/atm.component';
import { AtmDepositComponent } from './pages/admin/atm-deposit/atm-deposit.component';

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
  },
  {
    path: 'admin/client-form',
    component: ClientFormComponent
  },
  {
    path: 'admin/client-list',
    component: ClientListComponent
  },
  {
    path: 'admin/account-form',
    component: AccountFormComponent
  },
  {
    path: 'admin/account-list',
    component: AccountListComponent
  },
  {
    path: 'admin/atm',
    component: AtmComponent
  },
  {
    path: 'admin/atm-deposit',
    component: AtmDepositComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

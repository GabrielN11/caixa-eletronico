import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { ClientService } from 'src/app/services/client.service';
import { LoadingService } from 'src/app/services/loading.service';
import { WarningService } from 'src/app/services/warning.service';
import Account from 'src/models/classes/Account';
import Client from 'src/models/classes/Client';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {

  accounts: Account[] = [];

  constructor(private accountService: AccountService, private loadingService: LoadingService,
    private warningService: WarningService, private _router: Router) { }

  ngOnInit(): void {
    this.listAccounts();
  }

listAccounts():void{
  this.loadingService.setTrue();
    this.accountService.getAllAccounts().subscribe(accounts => {
      this.accounts = accounts.map(account => {
        const client = new Client(account.client.cpf, account.client.name, account.client.surname, account.client.id);
        return new Account(account.client_id, account.balance, account.number, account.token, client, account.id, account.last_access);
      });
      this.loadingService.setFalse();
    }, error => {
      this.warningService.displayWarning('danger', error.error, 4000);
      this.loadingService.setFalse();
      this._router.navigateByUrl('/admin/panel');
  });
}

handleDelete(id: any): void {
  this.loadingService.setTrue();
  this.accountService.deleteAccount(id).subscribe(resp => {
    this.loadingService.setFalse();
    this.warningService.displayWarning('success', resp, 3000);
    this.listAccounts();
  }, error => {
    this.loadingService.setFalse();
    this.warningService.displayWarning('danger', error.error, 4000);
  });
}

goToAccount(id: any):void{
  this._router.navigate(['/admin/account-form'], { queryParams: { id } });
}

}

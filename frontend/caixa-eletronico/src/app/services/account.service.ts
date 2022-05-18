import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Account from 'src/models/classes/Account';
import { environment } from 'src/environments/environment';
import Client from 'src/models/classes/Client';
import { Router } from '@angular/router';
import { ClientService } from './client.service';
import { WarningService } from './warning.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  account: Account | undefined;

  constructor(private http: HttpClient, private _router: Router, private clientService: ClientService,
    private warningService: WarningService, private loadingService: LoadingService) { }

  login(number: string, password: string): void {
    this.loadingService.setTrue();
    const resp = this.getLogin(number, password).subscribe((account) => {
      const client = new Client(account.client.cpf, account.client.name, account.client.surname, account.client.id);
      this.account = new Account(account.id, account.client_id, account.balance, account.last_access, account.number,
        account.token, client)
      this.clientService.setClient(client);
      this.warningService.displayWarning('success', `Bem-vindo(a) ${client.name}!`, 4000);
      this.loadingService.setFalse();
      this._router.navigateByUrl('/client');
    },
      error => {
        this.warningService.displayWarning('danger', error.error, 4000);
        this.loadingService.setFalse();
      }
    )
  }

  getLogin(number: string, password: string): Observable<Account> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify({ number, password })
    return this.http.post<Account>(environment.apiUrl + '/enter', body, { headers: headers })
  }

  logout():void{
    this.account = undefined;
    this.clientService.setClient(undefined);
    this.warningService.displayWarning('success', 'Obrigado por utilizar nossos serviços, volte sempre!', 4500);
    this._router.navigateByUrl('/');
  }
}

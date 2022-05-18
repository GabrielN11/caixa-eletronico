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
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  account: Account | undefined;

  constructor(private http: HttpClient, private _router: Router, private clientService: ClientService,
    private warningService: WarningService, private loadingService: LoadingService, private adminService: AdminService) { }

  login(number: string, password: string): void {
    this.loadingService.setTrue();
    const resp = this.getLogin(number, password).subscribe((account) => {
      const client = new Client(account.client.cpf, account.client.name, account.client.surname, account.client.id);
      this.account = new Account(account.client_id, account.balance, account.number,
        account.token, client, account.id, account.last_access);
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

  createAccount(number: string, client_id: number, password: string):void{
    this.loadingService.setTrue();
    this.postAccount(number, client_id, password).subscribe(resp => {
      this.loadingService.setFalse();
      this.warningService.displayWarning('success', resp, 4000);
      this._router.navigateByUrl('/admin/panel');
    },
      error => {
        this.loadingService.setFalse();
        this.warningService.displayWarning('danger', error.error, 4000);
      }
    );
  }

  alterAccount(id:any, number: string, client_id: number, password: string):void{
    this.loadingService.setTrue();
    this.putAccount(id, number, client_id, password).subscribe(resp => {
      this.loadingService.setFalse();
      this.warningService.displayWarning('success', resp, 4000);
      this._router.navigateByUrl('/admin/account-list');
    },
      error => {
        this.loadingService.setFalse();
        this.warningService.displayWarning('danger', error.error, 4000);
      }
    );
  }
  
  getLogin(number: string, password: string): Observable<Account> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify({ number, password });
    return this.http.post<Account>(environment.apiUrl + '/enter', body, { headers: headers });
  }

  logout():void{
    this.account = undefined;
    this.clientService.setClient(undefined);
    this.warningService.displayWarning('success', 'Obrigado por utilizar nossos serviços, volte sempre!', 4500);
    this._router.navigateByUrl('/');
  }

  getAccount(id: number):Observable<Account>{
    const url = `${environment.apiUrl}/account?token=${this.adminService.admin?.token}&id=${this.adminService.admin?.id}&account_id=${id}`;
    const headers = { 'content-type': 'application/json' };
    return this.http.get<Account>(url, { headers: headers });
  }

  getAllAccounts(): Observable<any[]> {
    const url = `${environment.apiUrl}/account-list?token=${this.adminService.admin?.token}&id=${this.adminService.admin?.id}`;
    const headers = { 'content-type': 'application/json' };
    return this.http.get<any[]>(url, { headers: headers });
  }

  postAccount(number: string, client_id: number, password: string): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const url = `${environment.apiUrl}/account?token=${this.adminService.admin?.token}&id=${this.adminService.admin?.id}`;
    const body = JSON.stringify({ number, client: client_id, password });
    return this.http.post(url, body, { headers: headers });
  }

  putAccount(id: number, number: string, client_id: number, password: string):Observable<any>{
    const headers = { 'content-type': 'application/json' };
    const url = `${environment.apiUrl}/account?token=${this.adminService.admin?.token}&id=${this.adminService.admin?.id}`;
    const body = JSON.stringify({id, number, client: client_id, password });
    return this.http.put(url, body, { headers: headers });
  }

  deleteAccount(id: number):Observable<any>{
    const headers = { 'content-type': 'application/json' };
    const url = `${environment.apiUrl}/account?token=${this.adminService.admin?.token}&id=${this.adminService.admin?.id}&account_id=${id}`;
    return this.http.delete(url, { headers: headers });
  }
}

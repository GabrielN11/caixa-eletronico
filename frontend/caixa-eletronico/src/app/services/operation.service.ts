import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import { LoadingService } from './loading.service';
import { WarningService } from './warning.service';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  headers = { 'content-type': 'application/json' };

  constructor(private http: HttpClient, private accountService: AccountService,
    private loadingService: LoadingService, private warningService: WarningService,
    private _router: Router) { }


  transfer(number: string, value: number): void {
    this.loadingService.setTrue();
    this.transferPost(number, value).subscribe(resp => {
      this.warningService.displayWarning('success', resp.message, 5000);
      const token = this.accountService.account?.token;
      resp.account.token = token;
      this.accountService.account = resp.account;
      this.loadingService.setFalse();
      this._router.navigateByUrl('/client')
    }, err => {
      this.warningService.displayWarning('danger', err.error, 5000);
      this.loadingService.setFalse();
    });
  }

  deposit(notes: any, value: number): void {
    this.loadingService.setTrue();
    this.depositPost(notes, value).subscribe(resp => {
      this.warningService.displayWarning('success', resp.message, 5000);
      const token = this.accountService.account?.token;
      resp.account.token = token;
      this.accountService.account = resp.account;
      this.loadingService.setFalse();
      this._router.navigateByUrl('/client')
    }, err => {
      this.warningService.displayWarning('danger', err.error, 5000);
      this.loadingService.setFalse();
    });
  }

  depositPost(notes: any, value: number): Observable<any> {
    const url = `${environment.apiUrl}/deposit?token=${this.accountService.account?.token}&id=${this.accountService.account?.id}`;
    const body = JSON.stringify({ id: this.accountService.account?.id, value, money: notes });
    return this.http.post<any>(url, body, { headers: this.headers });

  }

  transferPost(number: string, value: number): Observable<any> {
    const url = `${environment.apiUrl}/transfer?token=${this.accountService.account?.token}&id=${this.accountService.account?.id}`;
    const body = JSON.stringify({ id: this.accountService.account?.id, receiver: number, value });
    return this.http.post<any>(url, body, { headers: this.headers });
  }
}

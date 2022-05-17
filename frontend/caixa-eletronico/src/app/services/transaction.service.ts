import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Transaction from 'src/models/classes/Transaction';
import { AccountService } from './account.service';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading.service';
import { WarningService } from './warning.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private subject = new Subject()

  constructor(private http: HttpClient, private accountService: AccountService,
    private loadingService: LoadingService, private warningService: WarningService,
    private _router: Router) { }

  getTransactions():void{
    this.loadingService.setTrue();
    this.get().subscribe((transactions: any[]) => {
      transactions.reverse()
      this.subject.next(transactions);
      this.loadingService.setFalse();
    }, err => {
      this.warningService.displayWarning('danger', err.error, 4000);
      this.loadingService.setFalse();
      this._router.navigateByUrl('/client');
    })
  }

  get(): Observable<Transaction[]>{
    const headers = { 'content-type': 'application/json' };
    const url = `${environment.apiUrl}/transaction/${this.accountService.account?.id}?token=${this.accountService.account?.token}&id=${this.accountService.account?.id}`;
    return this.http.get<Transaction[]>(url, {headers: headers});
  }

  onChange():Observable<any>{
    return this.subject.asObservable();
  }
}

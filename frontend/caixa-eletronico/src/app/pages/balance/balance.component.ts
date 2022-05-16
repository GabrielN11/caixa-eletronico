import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {

  balance: number;
  strBalance: string;

  constructor(private accountService: AccountService, private _router: Router) {
    if(!this.accountService.account){
      _router.navigateByUrl('/')
    }
    this.balance = accountService.account?.balance || 0;
    this.strBalance = this.balance.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
   }

  ngOnInit(): void {

  }

}

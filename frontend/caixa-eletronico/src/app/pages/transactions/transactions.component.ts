import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { TransactionService } from 'src/app/services/transaction.service';
import Transaction from 'src/models/classes/Transaction';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[] = [new Transaction()];

  constructor(private transactionService: TransactionService, private _router: Router,
    private accountService: AccountService) {
    if (!this.accountService.account) {
      this._router.navigateByUrl('/')
    } else {
      this.transactionService.getTransactions();
      this.transactionService.onChange().subscribe(transactions => this.transactions = transactions);
    }
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  constructor(private _router: Router, private accountService: AccountService) {
    if(!accountService.account){
      _router.navigateByUrl('/')
    }
   }

  ngOnInit(): void {

  }

  finish():void{
    this.accountService.logout();
  }

}

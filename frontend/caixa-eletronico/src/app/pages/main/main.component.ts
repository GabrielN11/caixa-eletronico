import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { WarningService } from 'src/app/services/warning.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  accountNumber: string = '';
  accountPassword: string = '';
  step: number = 1;
  bla:any;

  constructor(private accountService: AccountService, private warningService: WarningService) { }

  ngOnInit(): void {
  }

  stepForwards():void{
    if(this.step === 1 && this.accountNumber === '')
      this.warningService.displayWarning('danger', 'Digite o número da conta!', 3000);
    else if(this.step === 1)
      this.step += 1;
    else if (this.step === 2 && this.accountPassword === '')
      this.warningService.displayWarning('danger', 'Digite a senha de sua conta!', 3000);
    else if(this.step === 2)
      this.accountService.login(this.accountNumber, this.accountPassword)
  }

  submitLogin():void{
    this.accountService.login(this.accountNumber, this.accountPassword);
  }

}

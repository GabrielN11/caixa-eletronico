import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { OperationService } from 'src/app/services/operation.service';
import { WarningService } from 'src/app/services/warning.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  number: string = '';
  value: number = 0;

  constructor(private operationService: OperationService, private warningService: WarningService,
    private _router:Router, private accountService: AccountService) {
    if(!accountService.account)
      this._router.navigateByUrl('/')  
    }

  ngOnInit(): void {
  }

  handleSubmit():void{
    if(this.number !== '' && this.value > 0){
      if(!isNaN(this.value)){
        this.operationService.transfer(this.number, this.value);
      }else{
        this.warningService.displayWarning('danger', 'Valor a ser transferido precisa ser um número!', 6000);
      }
    }else{
      this.warningService.displayWarning('danger', 'É necessário digitar o número e uma quantia!', 6000);
    }
  }

}

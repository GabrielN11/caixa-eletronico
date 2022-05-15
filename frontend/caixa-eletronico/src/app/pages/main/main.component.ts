import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  accountNumber: string = '';
  accountPassword: string = '';
  step: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

  changeAccountNumber(input: any):void{
    if(input.data !== null)
      this.accountNumber += input.data;
    else
      this.accountNumber = this.accountNumber.slice(0, -1);
  }

  changePassword(input: any):void{
    if(input.data !== null)
      this.accountPassword += input.data;
    else
      this.accountPassword = this.accountPassword.slice(0, -1);
  }

  stepForwards():void{
    if(this.step === 1)
      this.step += 1;
  }

}

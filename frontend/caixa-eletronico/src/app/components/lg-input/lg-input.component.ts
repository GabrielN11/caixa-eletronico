import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lg-input',
  templateUrl: './lg-input.component.html',
  styleUrls: ['./lg-input.component.css']
})
export class LgInputComponent implements OnInit {

  @Input() label: string = 'Digite a informação abaixo';
  @Input() placeholder: string = 'Digite aqui...';
  @Input() type:string = 'text'
  @Output() input: EventEmitter<string> = new EventEmitter()

  constructor() {
   }

  ngOnInit(): void {
    
  }

  onChange(e:any):void{
    this.input.emit(e.target.value)
  }

}

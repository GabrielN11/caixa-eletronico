import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lg-button',
  templateUrl: './lg-button.component.html',
  styleUrls: ['./lg-button.component.css']
})
export class LgButtonComponent implements OnInit {

  @Input() text: string = 'Clique';
  @Input() mode: string = 'primary';
  @Output() state: EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  handleClick():void{
    this.state.emit()
  }

}

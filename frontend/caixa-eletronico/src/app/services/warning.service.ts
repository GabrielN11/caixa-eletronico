import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import Warning from 'src/models/classes/Warning';

@Injectable({
  providedIn: 'root'
})
export class WarningService {

  warning: Warning;


  private subject = new Subject()

  constructor() {
    this.warning = new Warning()
  }

  displayWarning(mode: string, text: string, timer: number):void{
    this.warning.mode = mode;
    this.warning.text = text;
    this.warning.timer = timer;
    this.warning.enable();
    this.subject.next(this.warning)
  }

  onActivate(): Observable<any> {
    return this.subject.asObservable()
  }
}

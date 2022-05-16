import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private subject = new Subject()

  loading: boolean = false;

  constructor() { }

  setTrue():void{
    this.loading = true;
    this.subject.next(true)
  }

  setFalse():void{
    this.loading = false;
    this.subject.next(false)
  }

  onChange(): Observable<any> {
    return this.subject.asObservable()
  }

}

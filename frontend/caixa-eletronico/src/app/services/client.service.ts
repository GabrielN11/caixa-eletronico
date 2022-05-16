import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import Client from 'src/models/classes/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  client: Client | undefined;
  private subject = new Subject()

  constructor(private http: HttpClient) {

  }

  setClient(client: Client | undefined):void{
    this.client = client;
    this.subject.next(client)
  }

  onChange(): Observable<any> {
    return this.subject.asObservable()
  }
}

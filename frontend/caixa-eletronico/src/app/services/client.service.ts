import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import Client from 'src/models/classes/Client';
import { environment } from 'src/environments/environment';
import { WarningService } from './warning.service';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  headers = { 'Content-Type': 'application/json' };
  client: Client | undefined;
  private subject = new Subject();
  private subject2 = new Subject();

  constructor(private http: HttpClient, private warningService: WarningService,
    private loadingService: LoadingService, private _router: Router, 
    private adminService: AdminService) {

  }

  setClient(client: Client | undefined): void {
    this.client = client;
    this.subject.next(client)
  }
  
  createClient(client: Client): void {
    this.postClient(client).subscribe(
      (res: any) => {
        this.loadingService.setFalse();
        this.warningService.displayWarning('success', res, 3000);
        this._router.navigateByUrl('/admin/panel');
      },
      (err: any) => {
        this.loadingService.setFalse();
        this.warningService.displayWarning('danger', err.error, 5000);
      }
    )
  }

  updateClient(client: Client): void {
    this.loadingService.setTrue();
    this.putClient(client).subscribe(
      (res: any) => {
        this.loadingService.setFalse();
        this.warningService.displayWarning('success', res, 3000);
        this._router.navigateByUrl('/admin/client-list');
      },
      (err: any) => {
        this.loadingService.setFalse();
        this.warningService.displayWarning('danger', err.error, 5000);
      }
    )
  }

  deleteClientFromList(id: string): void {
    this.loadingService.setTrue();
    this.deleteClient(id).subscribe(
      (res: any) => {
        this.loadingService.setFalse();
        this.warningService.displayWarning('success', res, 3000);
        this.subject2.next(res);
      },
      (err: any) => {
        this.loadingService.setFalse();
        this.warningService.displayWarning('danger', err.error, 5000);
      }
    )
  }


  getAllClients(): Observable<Client[]> {
    const url = `${environment.apiUrl}/client-list?token=${this.adminService.admin?.token}&id=${this.adminService.admin?.id}`;
    return this.http.get<Client[]>(url, { headers: this.headers });
  }

  getClient(id: string): Observable<Client> {
    const url = `${environment.apiUrl}/client?token=${this.adminService.admin?.token}&id=${this.adminService.admin?.id}&client_id=${id}`;
    return this.http.get<Client>(url, { headers: this.headers });
  }

  postClient(client: Client): Observable<any> {
    const url = `${environment.apiUrl}/client?token=${this.adminService.admin?.token}&id=${this.adminService.admin?.id}`;
    const body = JSON.stringify(client);
    return this.http.post(url, client, { headers: this.headers });
  }

  putClient(client: Client): Observable<any> {
    const url = `${environment.apiUrl}/client?token=${this.adminService.admin?.token}&id=${this.adminService.admin?.id}&client_id=${client.id}`;
    const body = JSON.stringify(client);
    return this.http.put(url, client, { headers: this.headers });
  }

  deleteClient(id: string): Observable<any> {
    const url = `${environment.apiUrl}/client?token=${this.adminService.admin?.token}&id=${this.adminService.admin?.id}&client_id=${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  onChange(): Observable<any> {
    return this.subject.asObservable()
  }

  onDelete(): Observable<any> {
    return this.subject2.asObservable()
  }
}

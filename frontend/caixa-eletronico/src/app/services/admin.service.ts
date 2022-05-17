import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Admin from 'src/models/classes/Admin';
import { LoadingService } from './loading.service';
import { WarningService } from './warning.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  admin: Admin | undefined;

  headers = { 'content-type': 'application/json' };

  constructor(private http: HttpClient, private loadingService: LoadingService,
    private warningService: WarningService, private _router: Router) { }

  login(username: string, password: string): void {
    this.loadingService.setTrue();
    this.postLogin(username, password).subscribe(resp => {
      this.admin = resp;
      this.loadingService.setFalse();
      this._router.navigateByUrl('/admin/panel');
    }, err => {
      this.loadingService.setFalse();
      this.warningService.displayWarning('danger', err.error, 4000);
    });
  }

  logout(): void {
    this.admin = undefined;
    this._router.navigateByUrl('/admin');
  }

  postLogin(username: string, password: string): Observable<Admin> {
    const url = `${environment.apiUrl}/enter-admin`;
    const body = JSON.stringify({ username, password });
    return this.http.post<Admin>(url, body, { headers: this.headers });
  }

}

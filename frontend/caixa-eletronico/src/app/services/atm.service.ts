import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class AtmService {

  constructor(private http: HttpClient, private adminService: AdminService) { }

  getAllNotes():Observable<any>{
    const url = `${environment.apiUrl}/atm?token=${this.adminService.admin?.token}&id=${this.adminService.admin?.id}`;
    return this.http.get(url);
  }
}

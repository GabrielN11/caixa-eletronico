import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private adminService: AdminService, private _router: Router) {
    if(!this.adminService.admin) {
      this._router.navigateByUrl('/admin');
    }
   }

  ngOnInit(): void {
  }

  logout(){
    this.adminService.logout();
  }

}

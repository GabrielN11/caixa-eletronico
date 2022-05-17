import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { WarningService } from 'src/app/services/warning.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor(private adminService: AdminService, private warningService: WarningService) { }

  ngOnInit(): void {
  }

  handleSubmit(): void {
    if(this.username === '' || this.password === '') {
      this.warningService.displayWarning('danger', 'Preencha todos os campos.', 4000);
      return;
    }
    this.adminService.login(this.username, this.password);
  }

}

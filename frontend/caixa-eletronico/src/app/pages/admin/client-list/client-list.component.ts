import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClientService } from 'src/app/services/client.service';
import { LoadingService } from 'src/app/services/loading.service';
import { WarningService } from 'src/app/services/warning.service';
import Client from 'src/models/classes/Client';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  clients: Client[] = [];

  constructor(private clientService: ClientService, private warningService: WarningService,
    private loadingService: LoadingService, private _router: Router, private adminService: AdminService) {
    if(!this.adminService.admin){
      this._router.navigateByUrl('/admin')
    }
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void{
    this.loadingService.setTrue();
    this.clientService.getAllClients().subscribe(clients => {
      this.clients = clients;
      this.loadingService.setFalse();
    }, err => {
      this.loadingService.setFalse();
      this.warningService.displayWarning('danger', err.error, 5000);
      this._router.navigateByUrl('/admin/panel');
    })
  }

  handleDelete(id: any): void{
    this.clientService.deleteClientFromList(id);
    this.clientService.onDelete().subscribe(() => {
      this.clients = this.clients.filter(client => client.id !== id);
    }
    );
  }

  goToClient(id: any): void{
    this._router.navigate(['/admin/client-form'], {queryParams: {id}});
  }

}

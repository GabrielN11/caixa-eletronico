import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClientService } from 'src/app/services/client.service';
import { WarningService } from 'src/app/services/warning.service';
import { LoadingService } from 'src/app/services/loading.service';
import Client from 'src/models/classes/Client';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  alter: boolean = false;
  name: string = '';
  surname: string = '';
  cpf: string = '';
  id?: number;

  constructor(private warningService: WarningService, private clientService: ClientService,
    private adminService: AdminService, private _router: Router, private atvRoute: ActivatedRoute,
    private loadingService: LoadingService) {
    if (!adminService.admin) {
      _router.navigateByUrl('/admin')
    }
  }

  ngOnInit(): void {
    this.atvRoute.queryParamMap.subscribe(({ params }: any) => {
      if (params.id) {
        this.alter = true;
        this.loadingService.setTrue();
        this.clientService.getClient(params['id']).subscribe(client => {
          console.log(client)
          this.name = client.name;
          this.surname = client.surname;
          this.cpf = client.cpf;
          this.id = client.id;
          this.loadingService.setFalse();
        }, err => {
          this.loadingService.setFalse();
          this.warningService.displayWarning('danger', err.error, 5000);
          this._router.navigateByUrl('/admin/client-list');
        })
      }
    })
  }

  handleSubmit(): void {
    if (this.name === '' || this.surname === '' || this.cpf === '') {
      this.warningService.displayWarning('danger', 'Preencha todos os campos', 3000);
    } else {
      if (this.alter) {
        this.handleSubmitAlter();
      } else {
        this.handleSubmitCreate();
      }
    }
  }

  handleSubmitCreate(): void {
    const client: Client = new Client(this.cpf, this.name, this.surname);
    this.clientService.createClient(client);

  }

  handleSubmitAlter(): void {
    const client: Client = new Client(this.cpf, this.name, this.surname, this.id);
    this.clientService.updateClient(client);

  }
}

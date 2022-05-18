import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { ClientService } from 'src/app/services/client.service';
import { LoadingService } from 'src/app/services/loading.service';
import { WarningService } from 'src/app/services/warning.service';
import Client from 'src/models/classes/Client';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {

  alter: boolean = false;
  clients: Client[] = [];

  clientId: number = 0;
  id?: number;
  number: string = '';
  password: string = '';

  constructor(private accountService: AccountService, private clientService: ClientService,
    private loadingService: LoadingService, private warningService: WarningService,
    private _router: Router, private atvRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadingService.setTrue();
    this.clientService.getAllClients().subscribe(clients => {
      this.clients = clients;
      this.loadingService.setFalse();
      this.atvRoute.queryParams.subscribe((params : any) => {
        if (params.id) {
          this.alter = true;
          this.accountService.getAccount(params.id).subscribe(account => {
            this.number = account.number;
            this.clientId = account.client_id;
            this.id = account.id;      
          },
            error => {
              this.loadingService.setFalse();
              this.warningService.displayWarning('danger', error.error, 4000);
              this._router.navigateByUrl('/admin/panel');
            }
          );
        }
      });
    },
      error => {
        this.loadingService.setFalse();
        this.warningService.displayWarning('danger', error.error, 4000);
        this._router.navigateByUrl('/admin/panel');
      }
    )
}

  onChange(e: any): void {
    this.clientId = e.target.value;
  }

  handleSubmit():void{
    if (this.number === '' || this.password === '') {
      this.warningService.displayWarning('danger', 'Preencha todos os campos!', 4000);
    } else {
      if (this.alter) {
        this.accountService.alterAccount(this.id, this.number, this.clientId, this.password);
      } else {
        this.accountService.createAccount(this.number, this.clientId, this.password);
      }
    }
  }
}

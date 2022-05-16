import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  loading: boolean = false;

  constructor(private loadingService: LoadingService) {
    loadingService.onChange().subscribe(state => this.loading = state)
   }

  ngOnInit(): void {

  }

}

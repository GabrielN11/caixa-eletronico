import { Component, OnInit } from '@angular/core';
import { WarningService } from 'src/app/services/warning.service';
import Warning from 'src/models/classes/Warning';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css']
})
export class WarningComponent implements OnInit {

  warning: Warning = new Warning;

  constructor(private warningService: WarningService) {
    warningService.onActivate().subscribe(warning => {
      this.warning = warning;
    })
  }

  ngOnInit(): void {
  }

}

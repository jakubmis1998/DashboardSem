import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  sideBarOpened = false;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dashboardService.setCpuData();
    setInterval(() => {
      if (this.router.url === '/image') {
        this.dashboardService.setCpuData();
      }
    }, 2000);
  }

  sideBarToggler(event) {
    this.sideBarOpened = !this.sideBarOpened;
  }

}

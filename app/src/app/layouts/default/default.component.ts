import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, OnDestroy {

  interval: ReturnType<typeof setInterval>;
  allSubscription = new Subscription();

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.allSubscription.add(
      this.dashboardService.intervalSubject.subscribe(
        response => {
          if (!response) {
            clearInterval(this.interval);
          } else {
            this.followSystemUsage();
          }
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.allSubscription.unsubscribe();
  }

  private followSystemUsage(): void {
    this.interval = setInterval(() => {
      if (this.router.url === '/processing') {
        this.dashboardService.setSystemData();
      }
    }, 2000);
  }

}

import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  bigChartData = [];
  cardsData = [];
  pieChartData = [];
  barChartData = [];
  tableData = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.bigChartData = this.dashboardService.bigChartData();
    this.cardsData = this.dashboardService.cardsData();
    this.pieChartData = this.dashboardService.pieChartData();
    this.barChartData = this.dashboardService.barChartData();
    this.tableData = this.dashboardService.tableData();
  }
}

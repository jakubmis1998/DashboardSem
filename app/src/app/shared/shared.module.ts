import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MultiParamsComponent } from './components/multi-params/multi-params.component';
import { AreaComponent } from './widgets/area/area.component';
import { CardComponent } from './widgets/card/card.component';
import { PieComponent } from './widgets/pie/pie.component';
import { TableComponent } from './widgets/table/table.component';
import { BarComponent } from './widgets/bar/bar.component';

import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { FlexLayoutModule } from '@angular/flex-layout';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    TableComponent,
    BarComponent,
    MultiParamsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    NgxMatFileInputModule,
    FlexLayoutModule,
    HighchartsChartModule,
    ChartsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    TableComponent,
    BarComponent,
    MultiParamsComponent
  ]
})
export class SharedModule { }

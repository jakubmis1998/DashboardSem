import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MultiParamsComponent } from './components/multi-params/multi-params.component';
import { BarComponent } from './widgets/bar/bar.component';

import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BarComponent,
    MultiParamsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    NgxMatFileInputModule,
    ChartsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    BarComponent,
    MultiParamsComponent
  ]
})
export class SharedModule { }

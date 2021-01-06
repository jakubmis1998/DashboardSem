import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ApiService } from 'src/app/services/api.service';

import { DefaultComponent } from './default.component';
import { ImageComponent } from 'src/app/modules/image/image.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    DefaultComponent,
    ImageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatDividerModule,
    NgxMatFileInputModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    DashboardService,
    ApiService
  ]
})
export class DefaultModule { }

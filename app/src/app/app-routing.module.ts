import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { ImageComponent } from './modules/image/image.component';

const routes: Routes = [{
  path: '', component: DefaultComponent, children: [
    { path: 'processing', component: ImageComponent }
  ],
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

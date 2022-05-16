import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { PanelComponent } from './pages/panel/panel.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'client',
    component: PanelComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

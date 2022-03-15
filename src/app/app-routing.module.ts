import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditEmployeeComponent } from './components/smarts/add-edit-employee/add-edit-employee.component';
import { DashboardComponent } from './components/smarts/dashboard/dashboard.component';

const routes: Routes = [{ path: '', component: DashboardComponent},
                          {path: 'add', component: AddEditEmployeeComponent},
                          {path: 'edit/:id', component: AddEditEmployeeComponent},
                          {path: '**', redirectTo: '', pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

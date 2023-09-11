import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from 'src/details/details.component';
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/home/home.component';

const routes: Routes = [
  {
    path: '', component: AppComponent,
    children: [
      { path: 'details/:name', component: DetailsComponent },
      { path: 'accueil', component: HomeComponent },
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

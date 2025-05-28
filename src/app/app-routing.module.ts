import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResidencesComponent } from './Components/residences/residences.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { AddResidenceComponent } from './Components/residences/add-residence/add-residence.component';
import { ApartmentsComponent } from './Components/Apartments/apartments/apartments.component';
import { AddApartmentComponent } from './Components/Apartments/add-apartment/add-apartment.component';
import { ApartmentsByResidenceComponent } from './Components/Apartments/apartments-by-residence/apartments-by-residence.component';
import { ResidenceDetailsComponent } from './Components/residences/residence-details/residence-details.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
// import { adminGuard } from './guards/admin.guard';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ClientComponent } from './Components/clients/clients.component';
import { ReservationsComponent } from './Components/reservations/reservations.component';

const routes: Routes = [
  { path: 'residences', component: ResidencesComponent },
  { path: 'residences', redirectTo: '/residences', pathMatch: 'full' },
  { path: 'details/:id', component: ResidenceDetailsComponent },
  { path: 'residence/add', component: AddResidenceComponent },
  { path: 'apartments', component: ApartmentsComponent },
  { path: 'apartment/add/:idR', component: AddApartmentComponent },
  { path: 'residence/show/:id', component: ApartmentsByResidenceComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  {path: 'clients',component:ClientComponent},
  {path: 'reservation',component:ReservationsComponent},
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

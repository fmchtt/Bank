import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PixComponent } from './pix/pix.component';
import { EmprestimoComponent } from './emprestimo/emprestimo.component';
import { ExtratoComponent } from './extrato/extrato.component';
import { PoupancaComponent } from './poupanca/poupanca.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './register/register.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'pix', component: PixComponent, canActivate: [AuthGuard] },
  { path: 'emprestimo', component: EmprestimoComponent, canActivate: [AuthGuard] },
  { path: 'extrato', component: ExtratoComponent, canActivate: [AuthGuard] },
  { path: 'poupanca', component: PoupancaComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

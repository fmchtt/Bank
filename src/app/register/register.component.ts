import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private account: AccountService, private auth: AuthService, private route: Router) { }
  public email: string = '';
  public name: string = ''
  public password: string = '';

  ngOnInit(): void {
    if(this.account.getAccount()){
      this.route.navigate(['home'])
    }
  }

  async registrate() {
    this.account.registrar(this.name, this.email, this.password).then(() => {
      this.auth.isLoggedIn = true;
      this.route.navigate(['login']);
    })
  }
}

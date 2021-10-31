import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../model/account.model';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private account: AccountService, private auth: AuthService, private route: Router) { }
  public email: string = '';
  public password: string = '';

  ngOnInit(): void {
    if(this.account.getAccount()){
      this.route.navigate(['home'])
    }
  }

  async login() {
    if(await this.account.login(this.email, this.password)) {
      this.auth.isLoggedIn = true;
      this.route.navigate(['home']);
    }
  }

}

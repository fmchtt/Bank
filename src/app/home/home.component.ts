import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../model/account.model';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public account: Account | undefined;
  constructor(private accounts: AccountService, private auth: AuthService, private route: Router) { }

  ngOnInit(): void {
    this.account = this.accounts.getAccount()
  }

  logout() {
    this.accounts.authenticatedUser = undefined;
    this.auth.isLoggedIn = false;
    this.route.navigate(['login'])
  }
}

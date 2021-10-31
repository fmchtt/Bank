import { Component, OnInit } from '@angular/core';
import { Transaction } from '../model/account.model';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.css']
})
export class ExtratoComponent implements OnInit {
  public transactions: Array<Transaction> | undefined;
  constructor(private accounts: AccountService) { }

  ngOnInit(): void {
    this.transactions = this.accounts.getTransactions()
  }

}

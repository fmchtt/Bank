import { Component, OnInit } from '@angular/core';
import { Account, Transaction } from '../model/account.model';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-poupanca',
  templateUrl: './poupanca.component.html',
  styleUrls: ['./poupanca.component.css'],
})
export class PoupancaComponent implements OnInit {
  public transactions: Array<Transaction> | undefined;
  public account: Account | undefined;
  public valueToAdd: number = 0;
  public valueToRemove: number = 0;

  constructor(private accounts: AccountService) {}

  ngOnInit(): void {
    this.transactions = this.accounts.getSavingsTransactions();
    this.account = this.accounts.getAccount();
  }

  public savingAdd() {
    this.accounts.savingsAdd(this.valueToAdd);
    this.valueToAdd = 0;
  }

  public savingRemove() {
    this.accounts.savingsRemove(this.valueToRemove);
    this.valueToRemove = 0;
  }
}

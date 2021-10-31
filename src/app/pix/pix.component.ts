import { Component, OnInit } from '@angular/core';
import { PixKey, Transaction } from '../model/account.model';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-pix',
  templateUrl: './pix.component.html',
  styleUrls: ['./pix.component.css'],
})
export class PixComponent implements OnInit {
  public transactions: Array<Transaction> | undefined;
  public keys: Array<PixKey> | undefined;
  public type: 'phoneNumber' | 'cpf' | null = null;
  public name: string = '';
  public key: string = '';
  public keyToTransfer: string = '';
  public value: number = 0;
  constructor(private accounts: AccountService) {}

  ngOnInit(): void {
    this.keys = this.accounts.getPixKeys();
    this.transactions = this.accounts.getPixTransactions();
  }

  createKey() {
    if (this.type !== null)
      this.accounts.createPixKey(this.name, this.type, this.key);
    this.name = '';
    this.type = null;
    this.key = '';
  }

  tranferMoney() {
    this.accounts.transferPix(this.keyToTransfer, this.value);
  }
}

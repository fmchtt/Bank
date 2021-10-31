import { Component, OnInit } from '@angular/core';
import { Account, Loan } from '../model/account.model';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-emprestimo',
  templateUrl: './emprestimo.component.html',
  styleUrls: ['./emprestimo.component.css'],
})
export class EmprestimoComponent implements OnInit {
  public loans: Array<Loan> | undefined;
  public value = 0;
  public name = '';
  public installment = 0;
  public installmentsToPay = 0
  public loanId = -1
  constructor(private accounts: AccountService) {}

  ngOnInit(): void {
    this.loans = this.accounts.getLoans();
  }

  create() {
    this.accounts.createLoan(this.name, this.value, this.installment);
  }

  setLoanId(loanId: number) {
    this.loanId = loanId
  }

  payInstallments() {
    this.accounts.payInstallments(this.loanId, this.installmentsToPay)
    this.loanId = -1;
  }
}

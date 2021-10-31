import { Injectable } from '@angular/core';
import { Account, Loan, PixKey, Transaction } from '../model/account.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  public authenticatedUser: Account | undefined = undefined;

  public async login(email: string, password: string) {
    const users = await this.http
      .get<Account[]>(
        `http://localhost:3000/accounts?email=${email}&_embed=loans&_embed=transactions&_embed=pixKeys`
      )
      .toPromise();
    if (users.length > 0) {
      if (users[0].password == password) {
        this.authenticatedUser = users[0];
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public async registrar(name: string, email: string, password: string) {
    const account = await this.http.post<Account>('http://localhost:3000/accounts', JSON.stringify({name: name, email: email, password: password, balance: 0, savingBalance: 0}), httpOptions).toPromise()
    this.authenticatedUser = account
  }

  public getAccount() {
    return this.authenticatedUser;
  }

  public getLoans() {
    return this.getAccount()?.loans;
  }

  public createLoan(name: string, value: number, installment: number) {
    if (installment < 0 || name === '' || value < 0) {
      return;
    }
    let user = this.getAccount();
    if (!user || user.id == undefined) {
      return;
    }
    const loan = new Loan(
      value,
      name,
      installment,
      new Date().toLocaleDateString(),
      value,
      installment,
      user.id
    );

    const trans = new Transaction(
      'Pedido de emprestimo',
      'Bank',
      'credit',
      value,
      new Date().toLocaleDateString(),
      user.id
    );

    user.transactions.push(trans);
    user.balance += value;

    this.http
      .post<Loan>(
        `http://localhost:3000/loans/`,
        JSON.stringify(loan),
        httpOptions
      )
      .subscribe((res) => {
        user?.loans.push(res);
        this.http
          .post<Transaction>(
            `http://localhost:3000/transactions/`,
            JSON.stringify(trans),
            httpOptions
          )
          .subscribe((response) => {
            user?.transactions.push(response);
          });
      });
  }

  public async payInstallments(loanId: number, installments: number) {
    if (loanId === undefined || !installments || installments < 0) {
      return;
    }
    let user = this.getAccount();
    if (!user || user.id == undefined) {
      return;
    }
    let loan = user.loans.find((x) => x.id === loanId);
    if (!loan) {
      return;
    }
    let installmentValue = loan.value / loan.installment;
    if (user.balance < installments * installmentValue) {
      return;
    }
    if (loan.remainingInstallments < installments) {
      return;
    }
    if (loan.remainingInstallments == installments) {
      user.loans.splice(
        user.loans.findIndex((x) => x.id === loanId),
        1
      );
      await this.http
        .delete<Loan>(`http://localhost:3000/loans/${loan.id}/`)
        .toPromise();
    } else {
      loan.remainingInstallments -= installments;
      loan.remainingValue -= installmentValue * installments;

      await this.http
        .patch<Loan>(`http://localhost:3000/loans/${loan.id}/`, {
          remainingValue: loan.remainingValue,
          remainingInstallments: loan.remainingInstallments,
        }, httpOptions)
        .toPromise();

      await this.http
        .patch<Account>(`http://localhost:3000/accounts/${user?.id}/`, {
          balance: user.balance,
        }, httpOptions)
        .toPromise();
    }
    user.balance -= loan.value / loan.installment;

    this.http
      .post<Transaction>(
        `http://localhost:3000/accounts/${user?.id}/transactions/`,
        JSON.stringify(
          new Transaction(
            'Adiantamento de parcelas de emprestimo',
            'Bank',
            'debit',
            -1 * (installmentValue * installments),
            new Date().toLocaleDateString(),
            user.id
          )
        ),
        httpOptions
      )
      .subscribe((response) => {
        user?.transactions.push(response);
      });
  }

  public getTransactions() {
    return this.getAccount()?.transactions.filter(
      (x) => x.operation !== 'savingCredit' && x.operation !== 'savingDebit'
    );
  }

  public getPixTransactions() {
    return this.getAccount()?.transactions.filter(
      (x) => x.operation === 'pixReceive' || x.operation === 'pixTransfer'
    );
  }

  public getPixKeys() {
    return this.getAccount()?.pixKeys;
  }

  public createPixKey(name: string, type: 'phoneNumber' | 'cpf', key: string) {
    if (!name || name === '' || !type || !key || key === '') {
      return;
    }
    let user = this.getAccount();
    if (!user || user.id == undefined) {
      return;
    }

    const pix = new PixKey(type, name, key, user.id);

    this.http
      .post<PixKey>(`http://localhost:3000/pixKeys`, JSON.stringify(pix), httpOptions)
      .subscribe(async (key) => {
        user?.pixKeys.push(key);
      });
  }

  public async transferPix(pixKey: string, value: number) {
    if (!pixKey || pixKey === '' || !value) {
      return;
    }
    let user = this.getAccount();
    if (!user || user.id == undefined || user.balance < value) {
      return;
    }

    this.http
      .get<PixKey[]>(`http://localhost:3000/pixKeys?key=${pixKey}`)
      .subscribe(async (key) => {
        const receiver = await this.http
          .get<Account>(`http://localhost:3000/accounts/${key[0].accountId}`)
          .toPromise();

        if (!receiver || !user || user.id == undefined) {
          return;
        }

        user.balance -= value;
        receiver.balance += value;
        user.transactions.push(
          new Transaction(
            'Transferencia PIX',
            receiver.name,
            'pixTransfer',
            value * -1,
            new Date().toLocaleDateString(),
            user.id
          )
        );
        receiver.transactions.push(
          new Transaction(
            'Transferencia PIX',
            user.name,
            'pixReceive',
            value,
            new Date().toLocaleDateString(),
            user.id
          )
        );
      });
  }

  public getSavingsTransactions() {
    return this.getAccount()?.transactions.filter(
      (x) => x.operation === 'savingCredit' || x.operation === 'savingDebit'
    );
  }

  public async savingsAdd(value: number) {
    if (value < 0) {
      return;
    }
    let user = this.getAccount();
    if (!user || user.balance < value || user.id == undefined) {
      return;
    }
    user.balance -= value;
    user.savingBalance += value;

    await this.http
      .patch<Account>(
        `http://localhost:3000/accounts/${user?.id}/`,
        JSON.stringify({
          balance: user.balance,
          savingBalance: user.savingBalance,
        }), httpOptions
      )
      .toPromise();

    user.transactions.push(
      await this.http
        .post<Transaction>(
          `http://localhost:3000/transactions/`,
          JSON.stringify(
            new Transaction(
              'Dinheiro Guardado da poupança',
              'Você',
              'savingCredit',
              value,
              new Date().toLocaleDateString(),
              user.id
            )
          ), httpOptions
        )
        .toPromise()
    );

    user.transactions.push(
      await this.http
        .post<Transaction>(
          `http://localhost:3000/transactions/`,
          JSON.stringify(
            new Transaction(
              'Dinheiro Guardado da poupança',
              'Você',
              'debit',
              value * -1,
              new Date().toLocaleDateString(),
              user.id
            )
          ), httpOptions
        )
        .toPromise()
    );
  }

  public async savingsRemove(value: number) {
    if (value < 0) {
      return;
    }
    let user = this.getAccount();
    if (!user || user.savingBalance < value || user.id == undefined) {
      return;
    }
    user.balance += value;
    user.savingBalance -= value;

    await this.http
      .patch<Account>(
        `http://localhost:3000/accounts/${user.id}/`,
        JSON.stringify({
          balance: user.balance,
          savingBalance: user.savingBalance,
        }), httpOptions
      )
      .toPromise();

    user.transactions.push(
      await this.http
        .post<Transaction>(
          `http://localhost:3000/transactions/`,
          JSON.stringify(
            new Transaction(
              'Dinheiro Resgatado da poupança',
              'Você',
              'savingDebit',
              value * -1,
              new Date().toLocaleDateString(),
              user.id
            )
          ), httpOptions
        )
        .toPromise()
    );

    user.transactions.push(
      await this.http
        .post<Transaction>(
          `http://localhost:3000/transactions/`,
          JSON.stringify(
            new Transaction(
              'Dinheiro Resgatado da poupança',
              'Você',
              'credit',
              value,
              new Date().toLocaleDateString(),
              user.id
            )
          ), httpOptions
        )
        .toPromise()
    );
  }
}

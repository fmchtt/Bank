export class Account {
  public id: number | undefined;
  public name: string;
  public balance: number;
  public loans: Array<Loan>;
  public pixKeys: Array<PixKey>;
  public transactions: Array<Transaction>;
  public savingBalance: number;
  public password: string;
  public email: string;

  constructor(name: string, balance: number, password: string, email: string);
  constructor(name: string, balance: number, password: string, email: string, id?: number) {
    this.id = id;
    this.name = name;
    this.balance = balance;
    this.password = password;
    this.email = email;
    this.loans = [];
    this.pixKeys = [];
    this.transactions = [];
    this.savingBalance = 0;
  }
}

export class Loan {
  public id: number | undefined;
  public accountId: number;
  public value: number;
  public remainingValue: number;
  public name: string;
  public installment: number;
  public dateStart: string;
  public remainingInstallments: number;

  constructor(
    value: number,
    name: string,
    installment: number,
    dateStart: string,
    remainingValue: number,
    remainingInstallments: number,
    accountId: number
  )
  constructor(
    value: number,
    name: string,
    installment: number,
    dateStart: string,
    remainingValue: number,
    remainingInstallments: number,
    accountId: number,
    id?: number
  ) {
    this.id = id;
    this.value = value;
    this.name = name;
    this.installment = installment;
    this.remainingValue = remainingValue;
    this.dateStart = dateStart;
    this.remainingInstallments = remainingInstallments;
    this.accountId = accountId;
  }
}

export class PixKey {
  public id: number | undefined;
  public type: 'phoneNumber' | 'cpf';
  public name: string;
  public key: string;
  public accountId: number;

  constructor(
    type: 'phoneNumber' | 'cpf',
    name: string,
    key: string,
    accountId: number
  )
  constructor(
    type: 'phoneNumber' | 'cpf',
    name: string,
    key: string,
    accountId: number,
    id?: number
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.key = key;
    this.accountId = accountId;
  }
}

export class Transaction {
  public id: number | undefined;
  public accountId: number;
  public name: string;
  public receiver: string;
  public operation: 'credit' | 'debit' | 'pixTransfer' | 'pixReceive' | 'savingDebit' | 'savingCredit';
  public value: number;
  public date: string;

  constructor(
    name: string,
    receiver: string,
    operation: 'credit' | 'debit' | 'pixTransfer' | 'pixReceive' | 'savingDebit' | 'savingCredit',
    value: number,
    date: string,
    accountId: number
  )
  constructor(
    name: string,
    receiver: string,
    operation: 'credit' | 'debit' | 'pixTransfer' | 'pixReceive' | 'savingDebit' | 'savingCredit',
    value: number,
    date: string,
    accountId: number,
    id?: number
  ) {
    this.id = id;
    this.name = name;
    this.receiver = receiver;
    this.operation = operation;
    this.value = value;
    this.date = date;
    this.accountId = accountId;
  }
}

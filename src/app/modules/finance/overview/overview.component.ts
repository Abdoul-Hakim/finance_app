import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IncomeService } from '../service/income.service';
import { ExpenseService } from '../service/expense.service';
import { EntryType } from '../enums/entry_type';
import { Currency } from '../enums/currency';
import { USD2KHR } from '../const/convertion_rate';
import { objectEnumNames } from '@prisma/client/runtime/library';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  public currentBalance: number = 0;
  public expenseSum: number = 0;
  public incomeSum: number = 0;
  public dataList: Array<any> = [];
  public overlayActive: boolean = false;
  public entryId: number = 0;
  public entryType: number = 0;

  constructor(
    private incomeProvider: IncomeService,
    private expenseProvider: ExpenseService,
  ) {}

  ngOnInit(): void {
    this.InitFinanceHeader();
  }

   InitFinanceHeader() {
    this.prepareExpenses();
    this.prepareIncome();
  }

  prepareExpenses() {
    //TODO this.expenseProvider.getExpense();
    this.expenseProvider.calculateExpense();
    this.expenseProvider.expenseSum.subscribe(newValue => {
      this.expenseSum = newValue;
      this.currentBalance = this.incomeSum - this.expenseSum;
    });

    this.expenseProvider.currentExpense.subscribe(newData => {
      // get income and add expenses to the new list
      this.dataList = this.incomeProvider.currentIncome.value;
      this.dataList = this.dataList.concat(newData).sort((a, b) => b.tCreated - a.tCreated);
    });
  }

  prepareIncome() {
    // prepare income
    //TODO this.incomeProvider.getExpense();
    this.incomeProvider.calculateIncome();
    this.incomeProvider.incomeSum.subscribe(newValue => {
      this.incomeSum = newValue;
      this.currentBalance = this.incomeSum - this.expenseSum;
    });

    this.incomeProvider.currentIncome.subscribe(newData => {
      // get expenses and add income to the new list
      this.dataList = this.expenseProvider.currentExpense.value;
      this.dataList = this.dataList.concat(newData).sort((a, b) => b.tCreated - a.tCreated);
    });

  }

  checkProp(value:any) {
    if (value.expenseType == undefined ) {
      return true;
    }
    return false;
  }

  openOverlay(newValue: boolean, objectId: number, entryType: number) {
    console.log(this.overlayActive)
    this.overlayActive = newValue;
    this.entryId = objectId;
    this.entryType = entryType;
    console.log(newValue, objectId)
  }

}


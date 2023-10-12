import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Income } from '../interfaces/Income';
import { Expense } from '../interfaces/expense';
import { TestExpense, TestIncome } from 'test/data';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  public test = new FormControl('');
  public currentBalance: number = 0;
  public incomeDataList: Array<Income> = [];
  public expenseDataList: Array<Expense> = [];
  public expenseSum: number = 0;
  public incomeSum: number = 0;

  ngOnInit(): void {
    this.incomeDataList = TestIncome;
    this.expenseDataList = TestExpense;
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.InitFinanceHeader();

  }

   InitFinanceHeader() {
    this.expenseSum = this.CalculateExpenses();
    this.incomeSum = this.CalculateIncome();
    this.currentBalance = this.CalculateCurrentBalace();
  }

  CalculateCurrentBalace(tBegin: number = 0, tEnd: number = 0): number {
    if (tBegin === 0 && tEnd === 0) {
      return this.incomeSum - this.expenseSum;
    }
    return 0;
  }

  CalculateIncome(tBegin: number = 0, tEnd: number = 0): number {
    return this.incomeDataList.reduce((accumulator, currentValue: Income) => accumulator + currentValue.value, 0);
  }

  CalculateExpenses(tBegin: number = 0, tEnd: number = 0): number {
    return this.expenseDataList.reduce((accumulator, currentValue: Expense) => accumulator + currentValue.value, 0);
  }

}


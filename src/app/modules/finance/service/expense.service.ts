import { Injectable } from '@angular/core';
import { Expense } from '../interfaces/expense';
import { TestExpense } from 'test/data';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  public currentExpense: BehaviorSubject<Array<Expense>>
  = new BehaviorSubject<Array<Expense>> (TestExpense);
  public expenseSum: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  calculateExpense(tBegin: number = 0, tEnd: number = 0): void {
    this.expenseSum.next(this.currentExpense.value
      // filter data by range
      .filter((obj) => {
        let result: boolean = false;
        console.log(obj)
        if (tBegin === 0 ||
        (tBegin > 0 && tBegin <= obj.tCreated)) {
          result = true;
        } else {
          return false;
        }
        if (tEnd === 0 ||
          (tEnd > 0 && tEnd >= obj.tCreated)) {
          result = true;
        } else {
          return false;
        }
        return result;
      })
      // sum oll values
      .reduce((accumulator, currentValue: Expense) =>
        accumulator + currentValue.value, 0
      ));

  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { TestIncome } from 'test/data';
import { Income } from '../interfaces/Income';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  public currentIncome: BehaviorSubject<Array<Income>>
  = new BehaviorSubject<Array<Income>> (TestIncome);
  public incomeSum: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  calculateIncome(tBegin: number = 0, tEnd: number = 0): void {
    this.incomeSum.next(this.currentIncome.value
    // filter data by range
    .filter((obj) => {
      let result: boolean = false;
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
    .reduce((accumulator, currentValue: Income) =>
      accumulator + currentValue.value, 0
    ));
  }

  getIncome() {

  }

  createIncome(newIncome: Income) {
    const list = this.currentIncome.value;
    list.push(newIncome);
    this.currentIncome.next(list);
  }
}

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IncomeService } from '../service/income.service';
import { ExpenseService } from '../service/expense.service';
import { EntryType } from '../enums/entry_type';
import { Currency } from '../enums/currency';
import { USD2KHR } from '../const/convertion_rate';


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
  private expenseTypeList: Array<string> = ['accomodation', 'food', 'extra'];
  private incomeTypeList: Array<string> = ['salary', 'pedium', 'savings'];
  public entryTypeCategoryList: Array<string> = [];
  public displayTextTypeCategory: string = 'Income type';

  public entryForm = new FormGroup({
    value: new FormControl(0),
    currency: new FormControl(0),
    date: new FormControl((new Date().toISOString().substring(0, 10))),
    entryType: new FormControl(0),
    entryTypeCategory: new FormControl(0),
    comment: new FormControl('')
  });

  constructor(
    private incomeProvider: IncomeService,
    private expenseProvider: ExpenseService,
  ) {}

  ngOnInit(): void {
    this.InitFinanceHeader();
    this.initForm();
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

  setOverlayBit(newValue: boolean) {
    this.overlayActive = newValue;
  }

  addNewEntry() {
    this.setOverlayBit(false);
  }

  initForm() {
    this.entryTypeCategoryList = this.incomeTypeList;
    // change type category dropdown
    this.entryForm.controls.entryType.valueChanges.subscribe((newValue) => {
      // entry type income
      if (newValue == EntryType.Income) {
        this.entryTypeCategoryList = this.incomeTypeList;
        this.displayTextTypeCategory = 'Income type';
      } else { // entry type expense
        this.entryTypeCategoryList = this.expenseTypeList;
        this.displayTextTypeCategory = 'Expense type';
      }
    });
  }

  onSubmit() {
    let realValue = this.entryForm.value.value ? this.entryForm.value.value : 0;
    // calculate the real value
    if (this.entryForm.value.currency == Currency.KHR) {
      realValue = realValue / USD2KHR;
    }
    let newObject;
    if (this.entryForm.value.entryType == EntryType.Income) {
      newObject = {
        id: 0,
        incomeType: this.entryForm.value.entryTypeCategory ? this.entryForm.value.entryTypeCategory : 0,
        value: realValue,
        comment: this.entryForm.value.comment ? this.entryForm.value.comment : '',
        tCreated: this.entryForm.value.date ?
        new Date(this.entryForm.value.date).getTime() / 1000 : 0
      }
      newObject.value = realValue;
      this.incomeProvider.createIncome(newObject);
    } else {
      newObject = {
        id: 0,
        expenseType: this.entryForm.value.entryTypeCategory ? this.entryForm.value.entryTypeCategory : 0,
        value: realValue,
        comment: this.entryForm.value.comment ? this.entryForm.value.comment : '',
        tCreated: this.entryForm.value.date ?
        new Date(this.entryForm.value.date).getTime() / 1000 : 0
      }
      newObject.value = realValue;
      this.expenseProvider.createExpense(newObject);
    }

    this.incomeProvider.calculateIncome();
    this.expenseProvider.calculateExpense();
    this.setOverlayBit(false);
  }
}


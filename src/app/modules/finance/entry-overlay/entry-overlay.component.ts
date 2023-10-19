import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EntryType } from '../enums/entry_type';
import { USD2KHR } from '../const/convertion_rate';
import { Currency } from '../enums/currency';
import { IncomeService } from '../service/income.service';
import { ExpenseService } from '../service/expense.service';
import { Expense } from '../interfaces/expense';
import { Income } from '../interfaces/Income';

@Component({
  selector: 'app-entry-overlay',
  templateUrl: './entry-overlay.component.html',
  styleUrls: ['./entry-overlay.component.scss'],
})
export class EntryOverlayComponent {
  public expenseTypeList: Array<string> = ['accomodation', 'food', 'extra'];
  public incomeTypeList: Array<string> = ['salary', 'pedium', 'savings'];
  public displayTextTypeCategory: string = 'Income type';
  public entryTypeList: Array<string> = ['Income', 'Expense'];
  public entryTypeCategoryList: Array<string> = [];
  public currentEntry: any;

  @Input() overlayActive: boolean = false;
  @Input() entryId: number = 0;
  @Input() entryType: EntryType = 0;
  @Output() overlayVisibilityChanged = new EventEmitter<boolean>();

  constructor(
    private incomeProvider: IncomeService,
    private expenseProvider: ExpenseService
  ) {}

  public entryForm = new FormGroup({
    value: new FormControl(0),
    currency: new FormControl(0),
    date: new FormControl(new Date().toISOString().substring(0, 10)),
    entryType: new FormControl(0),
    entryTypeCategory: new FormControl(0),
    comment: new FormControl(''),
  });

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    let entry;
    console.log(this.entryType);
    if (EntryType.Income == this.entryType) {
      let entry = this.incomeProvider.currentIncome.value.find(
        (oldEntry) => oldEntry.id == this.entryId
      );
      if (entry) {
        console.log(entry);
        this.entryForm.controls.entryType.setValue(EntryType.Income);
        this.entryForm.controls.value.setValue(entry?.value);
        this.entryForm.controls.date.setValue(
          new Date(entry?.tCreated * 1000).toISOString().substring(0, 10)
        );
        this.entryForm.controls.entryTypeCategory.setValue(entry?.incomeType);
        this.entryForm.controls.comment.setValue(entry?.comment);
        this.currentEntry = entry;
      }
    } else {
      let entry = this.expenseProvider.currentExpense.value.find(
        (oldEntry) => oldEntry.id == this.entryId
      );
      if (entry) {
        this.entryForm.controls.entryType.setValue(EntryType.Expense);
        this.entryForm.controls.value.setValue(entry?.value);
        this.entryForm.controls.date.setValue(
          new Date(entry?.tCreated * 1000).toISOString().substring(0, 10)
        );
        this.entryForm.controls.entryTypeCategory.setValue(entry?.expenseType);
        this.entryForm.controls.comment.setValue(entry?.comment);
        this.currentEntry = entry;
      }
    }
  }

  initForm() {
    this.entryTypeCategoryList = this.incomeTypeList;
    // change type category dropdown
    this.entryForm.controls.entryType.valueChanges.subscribe((newValue) => {
      // entry type income
      if (newValue == EntryType.Income) {
        this.entryTypeCategoryList = this.incomeTypeList;
        this.displayTextTypeCategory = 'Income type';
      } else {
        // entry type expense
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
        incomeType: this.entryForm.value.entryTypeCategory
          ? this.entryForm.value.entryTypeCategory
          : 0,
        value: realValue,
        comment: this.entryForm.value.comment
          ? this.entryForm.value.comment
          : '',
        tCreated: this.entryForm.value.date
          ? new Date(this.entryForm.value.date).getTime() / 1000
          : 0,
      };
      newObject.value = realValue;
      this.incomeProvider.createIncome(newObject);
    } else {
      newObject = {
        id: 0,
        expenseType: this.entryForm.value.entryTypeCategory
          ? this.entryForm.value.entryTypeCategory
          : 0,
        value: realValue,
        comment: this.entryForm.value.comment
          ? this.entryForm.value.comment
          : '',
        tCreated: this.entryForm.value.date
          ? new Date(this.entryForm.value.date).getTime() / 1000
          : 0,
      };
      newObject.value = realValue;
      this.expenseProvider.createExpense(newObject);
    }

    this.incomeProvider.calculateIncome();
    this.expenseProvider.calculateExpense();
    this.setOverlayBit(false);
  }

  submitEntry() {}

  setOverlayBit(newValue: boolean) {
    this.overlayActive = newValue;
    this.overlayVisibilityChanged.emit(newValue);
  }
}

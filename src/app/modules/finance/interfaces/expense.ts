import { ExpenseType } from "../enums/expense_type";

export interface Expense {
  id: number,
  expenseType: ExpenseType,
  value: number,
  comment: string,
  tCreated: number
};

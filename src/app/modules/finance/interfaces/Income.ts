import { IncomeType } from "../enums/income_type";

export interface Income {
  id: number,
  incomeType: IncomeType,
  value: number,
  comment: string,
  tCreated: number
};

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EntryOverlayComponent } from './entry-overlay/entry-overlay.component';


@NgModule({
  declarations: [
    OverviewComponent,
    EntryOverlayComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    ReactiveFormsModule,
    NgbDropdownModule
  ]
})
export class FinanceModule { }

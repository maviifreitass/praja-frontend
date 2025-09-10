import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { TicketCardComponent } from './components/ticket-card/ticket-card.component';
import { StatusChipComponent } from './components/status-chip/status-chip.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    TicketCardComponent,
    StatusChipComponent
  ],
  exports: [
    HeaderComponent,
    TicketCardComponent,
    StatusChipComponent
  ]
})
export class SharedModule { }

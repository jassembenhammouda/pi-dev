import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTemplateFront } from '@layout/all-template-front/all-template-front';
import { EventForm } from '@features/front-office/event-form/event-form';
import { Events } from '@features/front-office/events/events';
import { EventsClient } from '@features/front-office/events-client/events-client';
import { EventDetail } from '@features/front-office/event-detail/event-detail';
import { Reservation } from '@features/front-office/reservation/reservation';
import { CancelReservation } from '@features/front-office/cancel-reservation/cancel-reservation';
import { Cancel } from '@features/front-office/cancel/cancel';
import { Success } from '@features/front-office/success/success';
import { ListParticipant } from '@features/front-office/list-participant/list-participant';
import { Statistique } from '@features/front-office/statistique/statistique';
import { UserComponent } from '@features/front-office/user/user';
import { LoginComponent } from '@features/front-office/login/login';
import { AdminGuard } from '@core/services/admin.guard';
import { AuthGuard } from '@core/services/auth.guard';
import { Chat11Component } from '@features/messaging/chat11/chat11';
import { DashcoredComponent } from '@features/messaging/dashcored/dashcored';
import { StockManagement } from '@features/front-office/stock-management/stock-management';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AllTemplateFront,
    children: [
      { path: '', component: EventsClient },
      { path: 'listEvents', component: Events, canActivate: [AdminGuard] },
      { path: 'clientEvents', component: EventsClient },
      { path: 'eventDetail/:id', component: EventDetail },
      { path: 'reservation/:id', component: Reservation },
      { path: 'cancelReservation', component: CancelReservation },
      { path: 'listParticipant/:id', component: ListParticipant, canActivate: [AdminGuard] },
      { path: 'event-form', component: EventForm, canActivate: [AdminGuard] },
      { path: 'chat', component: Chat11Component, canActivate: [AuthGuard] },
      { path: 'dash', component: DashcoredComponent, canActivate: [AdminGuard] },
      { path: 'stock', component: StockManagement, canActivate: [AdminGuard] },
      { path: 'users', component: UserComponent, canActivate: [AdminGuard] },
    ],
  },
  { path: 'success', component: Success },
  { path: 'cancel', component: Cancel },
  { path: 'statistique/:id', component: Statistique, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

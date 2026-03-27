import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AllTemplateFront } from '@layout/all-template-front/all-template-front';
import { HeaderFront } from '@layout/header-front/header-front';
import { FooterFront } from '@layout/footer-front/footer-front';
import { EventForm } from '@features/front-office/event-form/event-form';
import { AuthInterceptor } from '@core/services/auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Events } from '@features/front-office/events/events';
import { EventsClient } from '@features/front-office/events-client/events-client';
import { EventDetail } from '@features/front-office/event-detail/event-detail';
import { Reservation } from '@features/front-office/reservation/reservation';
import { CancelReservation } from '@features/front-office/cancel-reservation/cancel-reservation';
import { Cancel } from '@features/front-office/cancel/cancel';
import { Success } from '@features/front-office/success/success';
import { ListParticipant } from '@features/front-office/list-participant/list-participant';
import { Statistique } from '@features/front-office/statistique/statistique';
import { Recommendations } from '@layout/all-template-front/recommendations/recommendations';

@NgModule({
  declarations: [
    App,
    AllTemplateFront,
    HeaderFront,
    FooterFront,
    EventForm,
    Events,
    EventDetail,
    Reservation,
    CancelReservation,
    Cancel,
    Success,
    ListParticipant,
    Statistique,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    EventsClient,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [App],
})
export class AppModule {}

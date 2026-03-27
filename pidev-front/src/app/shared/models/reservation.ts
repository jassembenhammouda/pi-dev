import { Event } from './event';

export interface Reservation {

  id?: number;

  firstNameParticipant: string;
  lastNameParticipant: string;
  emailParticipant: string;

  nbPlace: number;

  status?: string;

  cancelCode?: string;

  qrCodeBase64?: string;

  qrToken?: string;

  checkedIn?: boolean;

  amount?: number;

  event?: Event;

}
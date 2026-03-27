import { Reservation } from './reservation';

describe('Reservation', () => {
  it('should accept required fields', () => {
    const reservation: Reservation = {
      firstNameParticipant: 'Jane',
      lastNameParticipant: 'Doe',
      emailParticipant: 'jane@example.com',
      nbPlace: 2,
    };
    expect(reservation).toBeTruthy();
    expect(reservation.nbPlace).toBe(2);
  });
});

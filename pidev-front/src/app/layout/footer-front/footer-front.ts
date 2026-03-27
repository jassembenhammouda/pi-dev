import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth-service';

@Component({
  selector: 'app-footer-front',
  standalone: false,
  templateUrl: './footer-front.html',
  styleUrl: './footer-front.scss'
})
export class FooterFront {
  readonly currentYear = new Date().getFullYear();

  constructor(public authService: AuthService) {}
}

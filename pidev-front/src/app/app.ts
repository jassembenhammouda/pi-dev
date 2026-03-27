import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'EventConnect';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Redirect to login if not authenticated and not already on login page
    if (!this.authService.isLoggedIn() && !this.router.url.includes('login')) {
      this.router.navigate(['/login']);
    }
  }
}

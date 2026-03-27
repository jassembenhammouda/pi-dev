import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth-service';
import { UserService } from '@core/services/user-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  // Login mode
  loginEmail = '';
  loginPassword = '';

  // Register mode
  registerFirstName = '';
  registerLastName = '';
  registerEmail = '';
  registerPassword = '';
  registerPasswordConfirm = '';
  registerRole = 'user';

  loading = false;
  isRegisterMode = false;
  validationErrors: { [key: string]: string } = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  // Login Methods
  validateLoginForm(): boolean {
    this.validationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.loginEmail.trim()) {
      this.validationErrors['loginEmail'] = 'Email requis';
    } else if (!emailRegex.test(this.loginEmail)) {
      this.validationErrors['loginEmail'] = 'Email invalide';
    }

    if (!this.loginPassword) {
      this.validationErrors['loginPassword'] = 'Mot de passe requis';
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  login(): void {
    if (!this.validateLoginForm()) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (response) => {
        Swal.fire('Succès', `Bienvenue ${response.email}!`, 'success');
        this.loading = false;
        const target =
          response.role?.toUpperCase() === 'ADMIN' ? '/users' : '/clientEvents';
        this.router.navigate([target]);
      },
      error: (err) => {
        Swal.fire('Erreur', 'Email ou mot de passe invalide', 'error');
        this.loading = false;
      }
    });
  }

  // Register Methods
  validateRegisterForm(): boolean {
    this.validationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.registerFirstName.trim()) {
      this.validationErrors['firstName'] = 'Prénom requis';
    }

    if (!this.registerLastName.trim()) {
      this.validationErrors['lastName'] = 'Nom requis';
    }

    if (!this.registerEmail.trim()) {
      this.validationErrors['email'] = 'Email requis';
    } else if (!emailRegex.test(this.registerEmail)) {
      this.validationErrors['email'] = 'Email invalide';
    }

    if (!this.registerPassword) {
      this.validationErrors['password'] = 'Mot de passe requis';
    } else if (this.registerPassword.length < 4) {
      this.validationErrors['password'] = 'Minimum 4 caractères';
    }

    if (this.registerPassword !== this.registerPasswordConfirm) {
      this.validationErrors['passwordConfirm'] = 'Mots de passe non identiques';
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  register(): void {
    if (!this.validateRegisterForm()) {
      return;
    }

    this.loading = true;
    const registerData = {
      firstName: this.registerFirstName,
      lastName: this.registerLastName,
      email: this.registerEmail,
      password: this.registerPassword,
      role: this.registerRole
    } as any;

    this.userService.register(registerData as any).subscribe({
      next: () => {
        Swal.fire('Succès', 'Compte créé! Connexion en cours...', 'success');
        // Auto-login after registration
        this.authService.login(this.registerEmail, this.registerPassword).subscribe({
          next: (res) => {
            this.loading = false;
            const target =
              res.role?.toUpperCase() === 'ADMIN' ? '/users' : '/clientEvents';
            this.router.navigate([target]);
          },
          error: () => {
            this.loading = false;
            this.isRegisterMode = false;
            this.resetLoginForm();
            Swal.fire('Info', 'Compte créé. Veuillez vous connecter.', 'info');
          }
        });
      },
      error: (err) => {
        Swal.fire('Erreur', err?.error?.message || 'Erreur lors de la création du compte', 'error');
        this.loading = false;
      }
    });
  }

  hasError(field: string): boolean {
    return !!this.validationErrors[field];
  }

  getError(field: string): string {
    return this.validationErrors[field] || '';
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.validationErrors = {};
    if (this.isRegisterMode) {
      this.resetLoginForm();
    } else {
      this.resetRegisterForm();
    }
  }

  resetLoginForm(): void {
    this.loginEmail = '';
    this.loginPassword = '';
    this.validationErrors = {};
  }

  resetRegisterForm(): void {
    this.registerFirstName = '';
    this.registerLastName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerPasswordConfirm = '';
    this.registerRole = 'user';
    this.validationErrors = {};
  }
}

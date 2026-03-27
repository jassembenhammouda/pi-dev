import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '@core/services/user-service';
import { AuthService } from '@core/services/auth-service';
import { User } from '@shared/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.scss']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  showForm = false;
  newUser: User = new User();
  newUserPassword = '';
  confirmPassword = '';
  loading = false;
  isEditMode = false;
  validationErrors: { [key: string]: string } = {};

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        Swal.fire('Erreur', 'Erreur lors du chargement des utilisateurs', 'error');
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    this.validationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.newUser.firstName?.trim()) {
      this.validationErrors['firstName'] = 'Le prénom est requis';
    }
    if (!this.newUser.lastName?.trim()) {
      this.validationErrors['lastName'] = 'Le nom est requis';
    }
    if (!this.newUser.email?.trim()) {
      this.validationErrors['email'] = 'L\'email est requis';
    } else if (!emailRegex.test(this.newUser.email)) {
      this.validationErrors['email'] = 'Email invalide';
    }
    if (!this.isEditMode) {
      if (!this.newUserPassword) {
        this.validationErrors['password'] = 'Le mot de passe est requis';
      } else if (this.newUserPassword.length < 4) {
        this.validationErrors['password'] = 'Le mot de passe doit contenir au moins 4 caractères';
      }
      if (this.newUserPassword !== this.confirmPassword) {
        this.validationErrors['confirmPassword'] = 'Les mots de passe ne correspondent pas';
      }
    }
    return Object.keys(this.validationErrors).length === 0;
  }

  addUser(): void {
    if (!this.validateForm()) {
      return;
    }
    this.loading = true;
    const userToAdd = { ...this.newUser, password: this.newUserPassword };
    this.userService.addUser(userToAdd).subscribe({
      next: () => {
        Swal.fire('Succès', 'Utilisateur ajouté avec succès', 'success');
        this.loadUsers();
        this.resetForm();
        this.showForm = false;
        this.loading = false;
      },
      error: (err) => {
        Swal.fire('Erreur', err?.error?.message || 'Erreur lors de l\'ajout de l\'utilisateur', 'error');
        this.loading = false;
      }
    });
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.isEditMode = true;
    this.showForm = true;
    this.validationErrors = {};
  }

  updateUser(): void {
    if (!this.selectedUser) return;
    if (!this.validateEditForm()) return;

    this.loading = true;
    this.userService.updateUser(this.selectedUser.id!, this.selectedUser).subscribe({
      next: () => {
        Swal.fire('Succès', 'Utilisateur mis à jour', 'success');
        this.loadUsers();
        this.resetForm();
        this.showForm = false;
        this.loading = false;
      },
      error: (err) => {
        Swal.fire('Erreur', err?.error?.message || 'Erreur lors de la mise à jour', 'error');
        this.loading = false;
      }
    });
  }

  validateEditForm(): boolean {
    this.validationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.selectedUser?.firstName?.trim()) {
      this.validationErrors['firstName'] = 'Le prénom est requis';
    }
    if (!this.selectedUser?.lastName?.trim()) {
      this.validationErrors['lastName'] = 'Le nom est requis';
    }
    if (!this.selectedUser?.email?.trim()) {
      this.validationErrors['email'] = 'L\'email est requis';
    } else if (!emailRegex.test(this.selectedUser.email)) {
      this.validationErrors['email'] = 'Email invalide';
    }
    return Object.keys(this.validationErrors).length === 0;
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe(() => {
          Swal.fire('Supprimé!', 'Utilisateur supprimé.', 'success');
          this.loadUsers();
        });
      }
    });
  }

  loginEmail = '';
  loginPassword = '';
  currentUser: User | null = null;

  login(): void {
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (response) => {
        this.currentUser = {
          id: response.id,
          firstName: '',
          lastName: '',
          email: response.email,
          role: response.role,
          password: '',
        } as any;
        Swal.fire('Succès', `Connecté en tant que ${response.role}`, 'success');
      },
      error: () => {
        Swal.fire('Erreur', 'Email ou mot de passe invalide', 'error');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    Swal.fire('Succès', 'Déconnecté', 'success');
  }

  resetForm(): void {
    this.newUser = new User();
    this.selectedUser = null;
    this.newUserPassword = '';
    this.confirmPassword = '';
    this.isEditMode = false;
    this.validationErrors = {};
  }

  hasError(field: string): boolean {
    return !!this.validationErrors[field];
  }

  getError(field: string): string {
    return this.validationErrors[field] || '';
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.showForm = true;
    this.resetForm();
    this.validationErrors = {};
  }
}
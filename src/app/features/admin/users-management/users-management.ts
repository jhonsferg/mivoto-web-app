import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, CreateUserRequest, UpdateUserRequest } from '@core/services/user.service';
import { DialogService } from '@core/services/dialog.service';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './users-management.html',
  styleUrl: './users-management.scss',
})
export class UsersManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(DialogService);

  public users = signal<User[]>([]);
  public isLoading = signal(true);
  public showCreateModal = signal(false);
  public showEditModal = signal(false);
  public selectedUser = signal<User | null>(null);

  public userForm = this.fb.group({
    documentNumber: ['', [Validators.required, Validators.maxLength(20)]],
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(6)]],
    role: ['VOTER', Validators.required],
    active: [true],
  });

  public roles = [
    { value: 'VOTER', label: 'Votante' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'SUPERVISOR', label: 'Supervisor' },
    { value: 'AUDITOR', label: 'Auditor' },
  ];

  public ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users.set(response.data || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.dialog.error('Error', 'No se pudieron cargar los usuarios');
        console.error('Error loading users:', error);
      },
    });
  }

  public openCreateModal(): void {
    this.userForm.reset({
      role: 'VOTER',
      active: true,
    });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showCreateModal.set(true);
  }

  public closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.userForm.reset();
  }

  public createUser(): void {
    if (this.userForm.valid) {
      const request: CreateUserRequest = this.userForm.value as CreateUserRequest;

      this.userService.createUser(request).subscribe({
        next: () => {
          this.dialog.success('Éxito', 'Usuario creado correctamente');
          this.closeCreateModal();
          this.loadUsers();
        },
        error: (error) => {
          this.dialog.error('Error', error.error?.message || 'No se pudo crear el usuario');
          console.error('Error creating user:', error);
        },
      });
    }
  }

  public openEditModal(user: User): void {
    this.selectedUser.set(user);
    this.userForm.patchValue({
      documentNumber: user.documentNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      active: user.active,
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showEditModal.set(true);
  }

  public closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedUser.set(null);
    this.userForm.reset();
  }

  public updateUser(): void {
    if (this.userForm.valid && this.selectedUser()) {
      const request: UpdateUserRequest = {
        documentNumber: this.userForm.value.documentNumber!,
        firstName: this.userForm.value.firstName!,
        lastName: this.userForm.value.lastName!,
        email: this.userForm.value.email!,
        role: this.userForm.value.role!,
        active: this.userForm.value.active!,
      };

      this.userService.updateUser(this.selectedUser()!.id, request).subscribe({
        next: () => {
          this.dialog.success('Éxito', 'Usuario actualizado correctamente');
          this.closeEditModal();
          this.loadUsers();
        },
        error: (error) => {
          this.dialog.error('Error', error.error?.message || 'No se pudo actualizar el usuario');
          console.error('Error updating user:', error);
        },
      });
    }
  }

  public toggleUserStatus(user: User): void {
    const action = user.active ? 'desactivar' : 'activar';
    this.dialog.confirm('Confirmar', `¿Deseas ${action} este usuario?`).subscribe({
      next: (confirmed) => {
        if (confirmed) {
          const service = user.active
            ? this.userService.deactivateUser(user.id)
            : this.userService.activateUser(user.id);

          service.subscribe({
            next: () => {
              this.dialog.success('Éxito', `Usuario ${action}do correctamente`);
              this.loadUsers();
            },
            error: (error) => {
              this.dialog.error('Error', error.error?.message || `No se pudo ${action} el usuario`);
            },
          });
        }
      },
    });
  }

  public deleteUser(user: User): void {
    this.dialog
      .confirm(
        'Confirmar Eliminación',
        `¿Estás seguro de eliminar al usuario ${user.firstName} ${user.lastName}? Esta acción no se puede deshacer.`,
      )
      .subscribe({
        next: (confirmed) => {
          if (confirmed) {
            this.userService.deleteUser(user.id).subscribe({
              next: () => {
                this.dialog.success('Éxito', 'Usuario eliminado correctamente');
                this.loadUsers();
              },
              error: (error) => {
                this.dialog.error('Error', error.error?.message || 'No se pudo eliminar el usuario');
              },
            });
          }
        },
      });
  }

  public getRoleLabel(role: string): string {
    const roleObj = this.roles.find((r) => r.value === role);
    return roleObj?.label || role;
  }
}

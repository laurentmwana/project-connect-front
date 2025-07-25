import { User } from '@/model/user';
import { AdminService } from '@/services/admin.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  users: User[] = [];
  paginationInfo: {
    from: number;
    to: number;
    total: number;
    lastPage: number;
    perPage: number;
  } = {
    from: 0,
    to: 0,
    total: 0,
    lastPage: 1,
    perPage: 10,
  };
  currentPage = 1;
  filterForm: FormGroup;
  Math: Math = Math;
  errorMessage = '';
  successMessage = '';

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      email: [''],
      name: [''],
      state: [''],
      per_page: [10],
    });
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  loadAllUsers(page: number = 1) {
    const filters = this.filterForm.value;
    this.currentPage = page;

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
    );

    this.adminService.getAllUsers(page, cleanFilters).subscribe({
      next: (res) => {
        this.users = res.data;
        this.paginationInfo = {
          from: res.meta.from || 0,
          to: res.meta.to || 0,
          total: res.meta.total || 0,
          lastPage: res.meta.last_page || 1,
          perPage: res.meta.per_page || 10,
        };
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  resetFilters() {
    this.filterForm.reset({
      email: '',
      name: '',
      state: '',
      per_page: 10,
    });
    this.loadAllUsers(1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.paginationInfo.lastPage) {
      this.loadAllUsers(page);
    }
  }

  applyFilters(): void {
    this.loadAllUsers(1);
  }

  toggleUserState(id: number) {
    this.adminService.toggleUser(id).subscribe({
      next: (res) => {
        this.loadAllUsers(this.currentPage);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getPagesArray(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}

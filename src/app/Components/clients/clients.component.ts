import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

declare var bootstrap: any;

@Component({
  selector: 'app-client',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedUserId: number | null = null;
  selectedUser: User | null = null;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // Tri
  sortField: string = 'name';
  sortDirection: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getUsersByRole('user').subscribe(users => {
      this.users = users;
      this.filterUsers();
    });
  }

  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.mobile?.toLowerCase().includes(term)
      );
    }

    this.sortUsers(this.sortField, this.sortDirection, false);
    this.updatePagination();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterUsers();
  }

  sortUsers(field: string, direction: boolean = true, toggleDirection: boolean = true): void {
    if (toggleDirection && this.sortField === field) {
      this.sortDirection = !this.sortDirection;
    } else {
      this.sortField = field;
      this.sortDirection = direction;
    }

    

    this.updatePagination();
  }

  get pagedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getActiveUsers(): number {
    return this.users.filter(u => u.statut === 'actif').length;
  }

  getNewUsersThisMonth(): number {
    const now = new Date();
    return this.users.filter(user => {
      if (!user.dateInscription) return false;
      const regDate = new Date(user.dateInscription);
      return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
    }).length;
  }
  

  getAvatarColor(name: string): string {
    const colors = ['#f39c12', '#e74c3c', '#9b59b6', '#3498db', '#16a085', '#2ecc71'];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  }

  viewUserDetails(user: User): void {
    this.selectedUser = user;
    // this.selectedUserId = user.id;
    const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
    modal.show();
  }

  editUser(user: User | null): void {
    if (!user) return;
    console.log('Édition du client', user);
  }
  
}

import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { User } from '../../Models/User';
import { UsersService } from '../../Services/users.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    PaginationComponent,
    MatTableModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  @ViewChild('deleteModal', { static: false }) deleteModalRef!: ElementRef;

  dataSource: User[] = [];
  selectedUserId: number | null = null;
  selectedUser: User | null = null;

  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;

  isLoading = false;
  isActive: boolean | null = null;
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'desc';
  selectedStatus: string = 'all';

  displayedColumns: string[] = ['userName', 'email', 'phone', 'status', 'createdOn', 'actions'];

  private searchSubject = new Subject<string>();
  private userService = inject(UsersService);
  private toastr = inject(ToastrService);
  private router = inject(Router);


  ngOnInit(): void {
    this.loadUsers();
    // Debounce search input
    this.searchSubject.pipe(debounceTime(300)).subscribe((text) => {
      if (text.length >= 3 || text.length === 0) {
        this.onSearch(); // API call
      }
    });
  }

  onSearchKeyUp(): void {
    this.searchSubject.next(this.searchText.trim());
  }
  loadUsers(): void {
    const request: any = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchText: this.searchText,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
    };

    // // ✅ Conditionally add isActive to request
    // if (this.isActive === true) {
    //   request.isActive = true; // show active users only
    // } else if (this.isActive === false) {
    //   request.isActive = false; // show inactive users only
    // }

     // ✅ Conditionally add isActive based on selectedStatus
    if (this.selectedStatus === 'active') {
      request.isActive = true;
    } else if (this.selectedStatus === 'inactive') {
      request.isActive = false;
    }

    this.isLoading = true;
    this.userService.GetAllUsers(request).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        if (response.success) {
          const result = response.data;
          this.dataSource = result.data;
          this.totalRecords = result.totalRecords;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        } else if (response.message === 'No users found') {
          this.dataSource = [];
        }
        else {
          this.toastr.error(response.message, 'Failed');
          this.dataSource = [];
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to fetch users');
      },
    });
  }


  openUserModal(): void {
    this.router.navigate(['/user-create']);
  }

  editUser(user: User): void {
    this.router.navigate(['/user-edit', user.userId]);
  }

  openDeleteModal(userId: number): void {
    this.selectedUserId = userId;
    const modalElement = this.deleteModalRef.nativeElement;
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.show();
  }

  closeDeleteModal(): void {
    const modalElement = this.deleteModalRef.nativeElement;
    const modal = Modal.getInstance(modalElement);
    modal?.hide();
  }

  deleteUser(userId: number): void {
    this.userService.DeleteUser(userId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toastr.success(response.message);
          this.loadUsers();
          this.closeDeleteModal();
        } else {
          this.toastr.error(response.message);
        }
      },
      error: () => {
        this.toastr.error('Failed to delete user');
      },
    });
  }

  openStatusModal(user: User): void {
    this.selectedUser = { ...user };
    const modal = new Modal(document.getElementById('statusModal')!);
    modal.show();
  }

  confirmStatusChange(): void {
    if (!this.selectedUser) return;

    const updatedStatus = !this.selectedUser.isActive;
    this.userService.updateUserStatus(this.selectedUser.userId, updatedStatus).subscribe({
      next: () => {
        this.loadUsers();
        const modal = Modal.getInstance(document.getElementById('statusModal')!);
        modal?.hide();
      },
      error: () => {
        this.toastr.error('Status update failed');
      },
    });
  }


  //Paginatin and Sorting Methods
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadUsers();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadUsers();
  }

  onSearch(): void {
    this.currentPage = 1;
    // this.selectedUserNames = [...this.selectedUsers];
    this.loadUsers(); // apply date filters
  }
  onStatusFilterChange(): void {
    // Toggle ON means show only Active → set isActive = true
    // Toggle OFF means show only Inactive → set isActive = false
    // this.isActive = this.isActive === true ? false : true;
    this.currentPage = 1;
    this.loadUsers();
  }

  onStatusChange(event: Event): void {
    this.selectedStatus = (event.target as HTMLSelectElement).value; // Update the selected status
    this.currentPage = 1; // Reset to the first page
    this.loadUsers(); // Reload users with the updated filter
  }

}

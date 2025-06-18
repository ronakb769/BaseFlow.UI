import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../Services/login.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { PaginationComponent } from '../pagination/pagination.component';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-login-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatInputModule,
    PaginationComponent,
  ],
  templateUrl: './login-history.component.html',
  styleUrl: './login-history.component.css',
})
export class LoginHistoryComponent {
  allUsers: string[] = [];
  filteredUsers: string[] = [];
  selectedUsers: string[] = [];
  showFilters = false;
  dropdownOpen = false;
  filterText = '';

  displayedColumns: string[] = [
    'userName',
    // 'loginDate',
    'loginTime',
    'logoutTime',
    'ipAddress',
  ];
  dataSource: any[] = [];

  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;
  isLoading = false;

  selectedUserNames: string[] = [];
  searchText: string = '';
  fromDate: string | null = null;
  toDate: string | null = null;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'desc';

  private searchSubject = new Subject<string>();
  constructor(
    private loginService: LoginService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.fromDate = today;
    this.toDate = today;

    this.getUserNames();
    this.loadLoginHistory(); // load all records without filters

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
  getUserNames(): void {
    this.loginService.getAllUserNames().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.allUsers = res.data;
          // this.filterUsers();
        } else {
          this.toastr.error(res.message, 'Failed');
        }
      },
      error: () => {
        this.toastr.error('Error while fetching users', 'Error');
      },
    });
  }

  toggleDropdown() {
    this.dropdownOpen = true;
    this.filterUsers();
  }

  filterUsers() {
    this.filteredUsers = this.allUsers.filter(
      (user) =>
        user.toLowerCase().includes(this.filterText.toLowerCase()) &&
        !this.selectedUsers.includes(user)
    );
  }

  selectUser(user: string) {
    this.selectedUsers.push(user);
    this.filterText = '';
    this.filterUsers();

    // Focus input again
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(
        'input[placeholder="Search Username"]'
      );
      input?.focus();
    });
  }

  removeUser(user: string) {
    this.selectedUsers = this.selectedUsers.filter((u) => u !== user);
    this.filterUsers();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.position-relative')) {
      this.dropdownOpen = false;
    }
  }

  loadLoginHistory(applyDateFilters: boolean = false): void {
    this.isLoading = true;
    this.selectedUserNames = [...this.selectedUsers];

    const request: any = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      selectedUserNames: this.selectedUserNames,
      searchText: this.searchText,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
    };

    // ⬇️ Only include dates if user clicked Search
    if (applyDateFilters && this.fromDate && this.toDate) {
      request.fromDate = this.fromDate;
      request.toDate = this.toDate;
    }

    this.loginService.getLoginHistory(request).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          const result = res.data;
          this.totalRecords = result.totalRecords;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          this.dataSource = result.data;
        } else if( res.message === 'No record found') {
          this.dataSource = [];
        }
         else{
           this.toastr.error(res.message, 'Failed');  
           this.dataSource = [];
         }
      },
      error: () => {
        this.isLoading = false;
        this.dataSource = [];
        this.toastr.error('Error while fetching data', 'Error');
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.selectedUserNames = [...this.selectedUsers];
    this.loadLoginHistory(true); // apply date filters
  }

  onReset(): void {
    this.selectedUsers = [];
    this.filterText = '';
    this.fromDate = new Date().toISOString().split('T')[0]; // just for UI
    this.toDate = new Date().toISOString().split('T')[0]; // just for UI
    this.currentPage = 1;
    this.sortColumn = '';
    this.sortDirection = 'asc';
    this.loadLoginHistory(); // no filters applied
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadLoginHistory();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.loadLoginHistory(); // Fetch new paged data
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadLoginHistory();
    }
  }

  onPaginationClick(page: number | string): void {
    if (typeof page === 'number') {
      this.changePage(page);
    }
  }

  getPaginationPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    if (this.totalPages <= 7) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (this.currentPage > 4) pages.push('...');
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (this.currentPage < this.totalPages - 3) pages.push('...');
      pages.push(this.totalPages);
    }
    return pages;
  }

  // onPageChange(page: number) {
  //   this.currentPage = page;
  //   this.loadLoginHistory(); // Fetch data for new page
  // }
}

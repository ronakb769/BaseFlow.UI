import { Component, inject } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Role } from '../../Models/Role';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule, PaginationComponent],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent {

  dataSource: Role[] = [];
  selectedRoleId: number | null = null;

  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;


  isLoading = false;
  isActive = false;
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'desc';

  private searchSubject = new Subject<string>();
  roleSrv = inject(RoleService);
  toastr = inject(ToastrService);
  router = inject(Router);


  ngOnInit(): void {
    this.loadRole();
  }

  loadRole() {
    const request: any = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchText: this.searchText,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
    };

    this.roleSrv.GetAllRole(request).subscribe({
     next: (res:any) => {
        if (res.success) {
          const result = res.data;
          this.dataSource = result.data;
          this.totalRecords = result.totalRecords;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        }else if( res.message === 'No roles found') {
          this.dataSource = [];
        }
         else{
           this.toastr.error(res.message, 'Failed');  
           this.dataSource = [];
         }
      },error: (err:any) => {
        console.error('Failed to load settings', err);
      }
    })
  }
  openUserModal() {
    this.router.navigate(['/role-create']);
  }

  editRole(role: Role) {
    this.router.navigate(['/role-edit', role.roleId]);
  }
  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadRole();
  }
  //Paginatin and Sorting Methods
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadRole();
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadRole();
  }
  onSearchKeyUp(): void {
  this.searchSubject.next(this.searchText.trim());
  }

}

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppSettingsService } from '../../Services/app-settings.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-app-settings-list',
  standalone: true,
  imports: [CommonModule,FormsModule,
      ReactiveFormsModule,
      PaginationComponent,
      MatTableModule,],
  templateUrl: './app-settings-list.component.html',
  styleUrl: './app-settings-list.component.css'
})
export class AppSettingsListComponent {
  
  dataSource: any[] = [];
  settings: any[] = [];
  selectedSetting: any;
  isEditMode = false;

  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;

  isLoading = false;
  isActive = false;
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'desc';

  displayedColumns: string[] = ['key', 'value', 'description'];

  settingForm: FormGroup;

  private searchSubject = new Subject<string>();
  appSettingsService = inject(AppSettingsService);
  router = inject(Router);
  toastr = inject(ToastrService);

 constructor(private fb: FormBuilder) {
    this.settingForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadSettings();
    this.searchSubject.pipe(debounceTime(300)).subscribe((text) => {
        if (text.length >= 3 || text.length === 0) {
           this.currentPage = 1;
          //  this.selectedUserNames = [...this.selectedUsers];
          this.loadSettings();
        }
      });
  }


    onSearchKeyUp(): void {
  this.searchSubject.next(this.searchText.trim());
  }
  isEmpty = () => this.dataSource.length === 0;
  loadSettings() {

     const request: any = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchText: this.searchText,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
    };


    this.appSettingsService.GetAppSettings(request).subscribe({
      next: (res:any) => {
        if (res.success) {
          const result = res.data;
          this.dataSource = result.data;
          this.totalRecords = result.totalRecords;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        }else if( res.message === 'No app settings found') {
          this.dataSource = [];
        }
         else{
           this.toastr.error(res.message, 'Failed');  
           this.dataSource = [];
         }
      },
      error: (err:any) => {
        console.error('Failed to load settings', err);
      }
    });
  }

  editSetting(setting: any) {
  console.log(setting,'setting');
  this.router.navigate(['/edit-app-settings', setting.id]);
  }

    onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadSettings();
  }

  //Paginatin and Sorting Methods
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadSettings();
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadSettings();
  }

}

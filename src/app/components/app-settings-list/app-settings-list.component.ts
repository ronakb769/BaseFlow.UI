import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppSettingsService } from '../../Services/app-settings.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-app-settings-list',
  standalone: true,
  imports: [CommonModule,
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

  appSettingsService = inject(AppSettingsService);
  router = inject(Router);

 constructor(private fb: FormBuilder) {
    this.settingForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadSettings();
  }

  isEmpty = () => this.dataSource.length === 0;
  loadSettings() {
    this.appSettingsService.GetAppSettings().subscribe({
      next: (response:any) => {
        if (response.success) {
          const result = response.data;
          this.dataSource = response.data.data;
          this.totalRecords = response.data.totalRecords;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
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

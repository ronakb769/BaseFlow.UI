import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() pageSize: number = 10;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  paginationPages: (number | string)[] = [];

  ngOnChanges(): void {
    this.paginationPages = this.generatePages();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = parseInt(target.value, 10);
    this.pageSizeChanged.emit(value);
  }

  onPageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.pageChange.emit(page);
    }
  }
  generatePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      if (this.currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(
          1,
          '...',
          this.totalPages - 3,
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages
        );
      } else {
        pages.push(
          1,
          '...',
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          '...',
          this.totalPages
        );
      }
    }

    return pages;
  }
}

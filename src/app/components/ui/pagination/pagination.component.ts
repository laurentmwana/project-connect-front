import { PaginationMeta } from '@/model/paginate';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  imports: [NgIf, NgFor, NgClass],
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() meta!: PaginationMeta;
  @Input() className?: string;
  @Input() isPending = false;
  @Output() onPage = new EventEmitter<number>();

  // Computed property pour les numéros de pages
  get getPageNumbers(): (number | string)[] {
    if (!this.meta) return [];

    const { current_page, last_page } = this.meta;
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (last_page <= maxPagesToShow) {
      for (let i = 1; i <= last_page; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, current_page - 1);
      let endPage = Math.min(last_page - 1, current_page + 1);

      if (current_page <= 3) {
        endPage = Math.min(last_page - 1, 4);
      } else if (current_page >= last_page - 2) {
        startPage = Math.max(2, last_page - 3);
      }

      if (startPage > 2) {
        pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < last_page - 1) {
        pageNumbers.push('...');
      }

      if (last_page > 1) {
        pageNumbers.push(last_page);
      }
    }

    return pageNumbers;
  }

  get canGoPrevious(): boolean {
    return this.meta?.current_page > 1 && !this.isPending;
  }

  get canGoNext(): boolean {
    return this.meta?.current_page < this.meta?.last_page && !this.isPending;
  }

  get displayInfo() {
    if (!this.meta) {
      return { from: 0, to: 0, total: 0 };
    }

    const { from, to, total } = this.meta;
    return {
      from: from || 0,
      to: to || 0,
      total: total || 0,
    };
  }

  get hasResults(): boolean {
    return this.meta?.total > 0;
  }

  get isEmptyResults(): boolean {
    return this.meta?.total === 0;
  }

  get containerClasses(): string {
    const baseClasses =
      'flex flex-col lg:flex-row-reverse lg:justify-between items-center gap-3 py-6';
    return this.className ? `${baseClasses} ${this.className}` : baseClasses;
  }

  handlePreviousPage(): void {
    if (this.canGoPrevious) {
      this.onPage.emit(this.meta.current_page - 1);
    }
  }

  handleNextPage(): void {
    if (this.canGoNext) {
      this.onPage.emit(this.meta.current_page + 1);
    }
  }

  handlePageClick(page: number | string): void {
    if (typeof page === 'number' && !this.isPending) {
      this.onPage.emit(page);
    }
  }

  isCurrentPage(page: number | string): boolean {
    return typeof page === 'number' && this.meta?.current_page === page;
  }

  getPageButtonClasses(page: number | string): { [key: string]: boolean } {
    return {
      'h-9 w-9 rounded-md text-sm font-medium transition-all duration-200':
        true,
      'bg-primary text-primary-foreground shadow-sm': this.isCurrentPage(page),
      'bg-background border border-border hover:bg-muted hover:text-foreground':
        !this.isCurrentPage(page),
      'disabled:opacity-50 disabled:cursor-not-allowed': true,
    };
  }

  // TrackBy function pour optimiser les performances
  trackByPage(index: number, page: number | string): string | number {
    return typeof page === 'string' ? `ellipsis-${index}` : page;
  }
}

import { Injectable, signal } from '@angular/core';
import { SortConfig, SortOption } from '../../models/sort.model';

@Injectable({
  providedIn: 'root'
})
export class SortService {
  private readonly SORT_STORAGE_KEY = 'movies_sort_option'

  currentSort = signal<SortOption>(this.getInitialSort())

  readonly sortOptions: SortConfig[] = [
    { option: 'added-asc', label: 'Added (Oldest First)' },
    { option: 'added-desc', label: 'Added (Newest first)' },
    { option: 'title-asc', label: 'Title (A-Z)' },
    { option: 'title-desc', label: 'Title (Z-A)' },
    { option: 'release-asc', label: 'Release (Oldest first)' },
    { option: 'release-desc', label: 'Release (Newest first)' }
  ]

  private getInitialSort(): SortOption {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'added-desc'
    }

    try {
      const savedSort = localStorage.getItem(this.SORT_STORAGE_KEY)
      return (savedSort as SortOption) || 'added-desc'
    } catch (error) {
      console.error('Error loading sort option from localStorage:', error)
      return 'added-desc'
    }
  }

  setSort(option: SortOption): void {
    this.currentSort.set(option)

    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    try {
      localStorage.setItem(this.SORT_STORAGE_KEY, option)
    } catch (error) {
      console.error('Error saving sort option to localStorage:', error)
    }
  }

  getCurrentSortLabel(): string {
    const current = this.currentSort()
    const option = this.sortOptions.find(opt => opt.option === current)
    return option?.label || 'Sort'
  }
}

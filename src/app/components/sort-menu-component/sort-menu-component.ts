import { Component, inject } from '@angular/core';
import { SortService } from '../../services/sort-service/sort-service';
import { SortOption } from '../../models/sort.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorCaretDown, phosphorCheck } from '@ng-icons/phosphor-icons/regular';

@Component({
  selector: 'app-sort-menu-component',
  imports: [NgIcon],
  templateUrl: './sort-menu-component.html',
  styleUrl: './sort-menu-component.css',
  viewProviders: [provideIcons({ phosphorCheck, phosphorCaretDown })]
})
export class SortMenuComponent {
  private sortService = inject(SortService)

  isOpen = false
  currentSort = this.sortService.currentSort
  sortOptions = this.sortService.sortOptions

  toggleMenu(): void {
    this.isOpen = !this.isOpen
  }

  closeMenu(): void {
    this.isOpen = false
  }

  selectSort(option: SortOption): void {
    this.sortService.setSort(option)
    this.closeMenu()
  }

  getCurrentSortLabel(): string {
    return this.sortService.getCurrentSortLabel()
  }
}

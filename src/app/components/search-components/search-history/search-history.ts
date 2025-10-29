import { Component, input, output } from '@angular/core';
import { MovieHistoryItem, SearchHistoryItem } from '../../../models/history.model';
import { MovieList } from "../../movie-list/movie-list";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { phosphorArrowUpRight } from '@ng-icons/phosphor-icons/regular';

@Component({
  selector: 'app-search-history',
  imports: [MovieList, NgIcon],
  templateUrl: './search-history.html',
  styleUrl: './search-history.css',
  viewProviders: [provideIcons({ phosphorArrowUpRight })]
})
export class SearchHistory {
  searchHistory = input.required<SearchHistoryItem[]>()
  movieHistory = input.required<MovieHistoryItem[]>()
  currentSearchTerm = input<string>('')

  searchFromHistory = output<string>();
  clearSearchHistory = output<void>();

  movieSelected = output<number>();
  clearMovieHistory = output<void>();

  hasSearchHistory(): boolean {
    return this.searchHistory().length > 0 && !this.currentSearchTerm();
  }

  hasMovieHistory(): boolean {
    return this.movieHistory().length > 0 && !this.currentSearchTerm();
  }

  onSearchFromHistory(query: string): void {
    this.searchFromHistory.emit(query);
  }

  onClearSearchHistory(): void {
    this.clearSearchHistory.emit();
  }

  onMovieSelect(movieId: number): void {
    this.movieSelected.emit(movieId);
  }

  onClearMovieHistory(): void {
    this.clearMovieHistory.emit();
  }
}

import { Component, input, output } from '@angular/core';
import { Movie } from '../../models/movie.models';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { phosphorArrowClockwiseLight } from '@ng-icons/phosphor-icons/light';

@Component({
  selector: 'app-search-results',
  imports: [NgIcon],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css',
  viewProviders: [provideIcons({ phosphorArrowClockwiseLight })]
})
export class SearchResults {
  searchResults = input.required<Movie[]>()
  selectedGenre = input<string | null>(null)
  isLoading = input<boolean>(false)
  error = input<string | null>(null)

  movieSelected = output<number>()
  clearSearch = output<void>()

  onMovieSelect(movieId: number): void {
    this.movieSelected.emit(movieId)
  }

  onClearSearch(): void {
    this.clearSearch.emit()
  }
}

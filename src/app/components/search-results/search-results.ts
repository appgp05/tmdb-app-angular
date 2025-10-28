import { Component, input, output } from '@angular/core';
import { Movie } from '../../models/movie.models';

@Component({
  selector: 'app-search-results',
  imports: [],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css'
})
export class SearchResults {
  searchResults = input.required<Movie[]>()
  isLoading = input<boolean>(false)
  error = input<string | null>(null)

  movieSelected = output<number>()

  onMovieSelect(movieId: number): void {
    this.movieSelected.emit(movieId)
  }
}

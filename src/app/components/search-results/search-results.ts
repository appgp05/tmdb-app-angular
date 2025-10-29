import { Component, computed, input, output } from '@angular/core';
import { Movie } from '../../models/movie.models';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { phosphorArrowClockwiseLight } from '@ng-icons/phosphor-icons/light';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search-results',
  imports: [NgIcon, DatePipe],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css',
  viewProviders: [provideIcons({ phosphorArrowClockwiseLight })]
})
export class SearchResults {
  searchResults = input.required<Movie[]>()
  selectedGenre = input<string | null>(null)
  isLoading = input<boolean>(false)
  error = input<string | null>(null)

   filteredResults = computed(() => {
    const results = this.searchResults().filter(movie => 
      movie.backdrop_path || movie.poster_path
    );
    
    return results.sort((a, b) => {
      const dateA = a.release_date ? new Date(a.release_date).getTime() : Number.MAX_SAFE_INTEGER;
      const dateB = b.release_date ? new Date(b.release_date).getTime() : Number.MAX_SAFE_INTEGER;
      
      return dateA - dateB;
    });
  });

  movieSelected = output<number>()
  clearSearch = output<void>()

  onMovieSelect(movieId: number): void {
    this.movieSelected.emit(movieId)
  }

  onClearSearch(): void {
    this.clearSearch.emit()
  }

  getBackdropUrl(backdropPath: string | null): string {
    if (backdropPath) {
      return `https://image.tmdb.org/t/p/w780${backdropPath}`;
    } else {
      return '/assets/placeholder-backdrop.jpg';
    }
  }

  getPosterUrl(posterPath: string | null): string {
    if (posterPath) {
      return `https://image.tmdb.org/t/p/w92${posterPath}`;
    } else {
      return '/assets/placeholder-movie.jpg';
    }
  }
}

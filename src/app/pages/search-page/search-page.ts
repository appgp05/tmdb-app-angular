import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReturnComponent } from "../../components/return-component/return-component";
import { SearchBar } from "../../components/search-bar/search-bar";
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service/movie-service';
import { GenreService } from '../../services/genre-service/genre-service';
import { SearchResults } from "../../components/search-results/search-results";

@Component({
  selector: 'app-search-page',
  imports: [ReturnComponent, SearchBar, DatePipe, SearchResults],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPage {
  private movieService = inject(MovieService)
  private genreService = inject(GenreService)
  private router = inject(Router)

  searchResults = this.movieService.searchResults
  isLoading = this.movieService.isLoading
  error = this.movieService.error
  genres = this.genreService.genres
  
  showAllGenres = signal(false)
  selectedGenre = signal<string | null>(null)

  ngOnInit() {
    this.genreService.loadMovieGenres()
  }

  onSearch(term: string): void {
    if (term.trim().length >= 2) {
      this.selectedGenre.set(null)
      this.movieService.searchMovies(term)
    } else if (term.trim().length === 0) {
      this.movieService.clearSearch()
      this.selectedGenre.set(null)
    }
  }

  onMovieSelect(movieId: number): void {
    this.router.navigate(['/movie', movieId])
  }

  onGenreSelect(genreId: number, genreName: string): void {
    this.selectedGenre.set(genreName)
    this.movieService.searchMoviesByGenre(genreId)
  }

  getGenresToShow() {
    if (this.showAllGenres()) {
      return this.genres();
    } else {
      return this.genres().slice(0, 10);
    }
  }

  loadMoreGenres() {
    this.showAllGenres.set(true);
  }

  showLessGenres() {
    this.showAllGenres.set(false);
  }

  clearSearch(): void {
    this.movieService.clearSearch()
    this.selectedGenre.set(null)
  }
}

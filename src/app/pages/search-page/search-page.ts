import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReturnComponent } from "../../components/return-component/return-component";
import { SearchBar } from "../../components/search-bar/search-bar";
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service/movie-service';
import { GenreService } from '../../services/genre-service/genre-service';

@Component({
  selector: 'app-search-page',
  imports: [ReturnComponent, SearchBar, DatePipe],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPage {
  private movieService = inject(MovieService)
  private genreService = inject(GenreService)
  private router = inject(Router)

  genres = this.genreService.genres
  searchResults = this.movieService.searchResults
  isLoading = this.movieService.isLoading
  error = this.movieService.error

  showAllGenres = signal(false)

  ngOnInit() {
    this.genreService.loadMovieGenres()
  }

  onSearch(term: string): void {
    if (term.trim().length >= 2) {
      this.movieService.searchMovies(term)
    } else if (term.trim().length === 0) {
      this.movieService.clearSearch()
    }
  }

  onMovieSelect(movieId: number): void {
    this.router.navigate(['/movie', movieId])
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
}

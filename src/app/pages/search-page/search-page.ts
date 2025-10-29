import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReturnComponent } from "../../components/return-component/return-component";
import { SearchBar } from "../../components/search-bar/search-bar";
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service/movie-service';
import { GenreService } from '../../services/genre-service/genre-service';
import { SearchResults } from "../../components/search-results/search-results";
import { StorageService } from '../../services/storage-service/storage-service';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { phosphorArrowUpRight } from '@ng-icons/phosphor-icons/regular';
import { Movie } from '../../models/movie.models';
import { MovieList } from "../../components/movie-list/movie-list";

@Component({
  selector: 'app-search-page',
  imports: [ReturnComponent, SearchBar, SearchResults, NgIcon, MovieList],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
  viewProviders: [provideIcons({ phosphorArrowUpRight })]
})
export class SearchPage {
  private movieService = inject(MovieService)
  private genreService = inject(GenreService)
  private storageService = inject(StorageService)
  private router = inject(Router)

  searchResults = this.movieService.searchResults
  isLoading = this.movieService.isLoading
  error = this.movieService.error
  genres = this.genreService.genres
  searchHistory = this.storageService.searchHistory
  movieHistory = this.storageService.movieHistory
  currentSearchTerm = this.storageService.currentSearchTerm
  
  showAllGenres = signal(false)
  selectedGenre = signal<string | null>(null)
  searchInputValue = signal('')

  ngOnInit() {
    this.genreService.loadMovieGenres()
    
    if (this.currentSearchTerm() && this.currentSearchTerm().trim().length >= 2) {
      this.movieService.searchMovies(this.currentSearchTerm())
    }
  }

  onSearch(term: string): void {
    if (term.trim().length >= 2) {
      this.selectedGenre.set(null)
      this.storageService.setCurrentSearchTerm(term)
      this.movieService.searchMovies(term)
    } else if (term.trim().length === 0) {
      this.movieService.clearSearch()
      this.selectedGenre.set(null)
      this.storageService.clearCurrentSearchTerm()
    }
  }

  onClearSearch(): void {
    this.movieService.clearSearch()
    this.selectedGenre.set(null)
    this.searchInputValue.set('')
    this.storageService.clearCurrentSearchTerm()
  }

  onMovieSelect(movieId: number): void {
    const movie = this.searchResults().find(m => m.id === movieId)
    if (movie) {
      this.storageService.addToMovieHistory(movie)
    }
    this.router.navigate(['/movie', movieId])
  }

  onMovieSelectFromHistory(movie: Movie): void {
    this.storageService.addToMovieHistory(movie)
    this.router.navigate(['/movie', movie.id])
  }

  onMovieSelectFromList(movieId: number): void {
    this.router.navigate(['/movie', movieId])
  }

  onGenreSelect(genreId: number, genreName: string): void {
    const searchText = `${genreName}`
    this.storageService.setCurrentSearchTerm(searchText)
    this.selectedGenre.set(genreName)
    this.movieService.searchMoviesByGenre(genreId)
  }

  onSearchFromHistory(query: string): void {
    this.storageService.setCurrentSearchTerm(query)
    this.selectedGenre.set(null)
    this.movieService.searchMovies(query)
  }

  clearAllHistory(): void {
    this.storageService.clearSearchHistory()
  }

  clearAllMovieHistory(): void {
    this.storageService.clearMovieHistory()
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

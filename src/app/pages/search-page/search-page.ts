import { Component, inject, signal, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgIcon, provideIcons } from "@ng-icons/core"
import { phosphorArrowUpRight } from '@ng-icons/phosphor-icons/regular'

// Components
import { ReturnComponent } from "../../components/return-component/return-component"
import { SearchBar } from "../../components/search-components/search-bar/search-bar"
import { SearchResults } from "../../components/search-components/search-results/search-results"
import { SearchGenres } from "../../components/search-components/search-genres/search-genres"
import { SearchHistory } from "../../components/search-components/search-history/search-history"
import { MovieList } from "../../components/movie-list/movie-list"

// Services
import { MovieService } from '../../services/movie-service/movie-service'
import { GenreService } from '../../services/genre-service/genre-service'
import { StorageService } from '../../services/storage-service/storage-service'

// Models
import { Movie } from '../../models/movie.models'
import { HistoryService } from '../../services/history-service/history-service'

@Component({
  selector: 'app-search-page',
  imports: [
    ReturnComponent, 
    SearchBar, 
    SearchResults, 
    SearchGenres, 
    SearchHistory,
    MovieList,
    NgIcon
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
  viewProviders: [provideIcons({ phosphorArrowUpRight })]
})
export class SearchPage implements OnInit {
  // Services
  private movieService = inject(MovieService)
  private genreService = inject(GenreService)
  private storageService = inject(StorageService)
  private historyService = inject(HistoryService)
  private router = inject(Router)

  // Service signals
  searchResults = this.movieService.searchResults
  isLoading = this.movieService.isLoading
  error = this.movieService.error
  genres = this.genreService.genres
  searchHistory = this.historyService.searchHistory
  movieHistory = this.historyService.movieHistory
  currentSearchTerm = this.historyService.currentSearchTerm
  
  // Component signals
  showAllGenres = signal(false)
  selectedGenre = signal<string | null>(null)
  searchInputValue = signal('')

  // Lifecycle
  ngOnInit(): void {
    this.genreService.loadMovieGenres()
    
    if (this.currentSearchTerm() && this.currentSearchTerm().trim().length >= 2) {
      this.movieService.searchMovies(this.currentSearchTerm())
    }
  }

  // Search methods
  onSearch(term: string): void {
    if (term.trim().length >= 2) {
      this.selectedGenre.set(null)
      this.historyService.setCurrentSearchTerm(term)
      this.movieService.searchMovies(term)
    } else if (term.trim().length === 0) {
      this.movieService.clearSearch()
      this.selectedGenre.set(null)
      this.historyService.clearCurrentSearchTerm()
    }
  }

  onClearSearch(): void {
    this.movieService.clearSearch()
    this.selectedGenre.set(null)
    this.searchInputValue.set('')
    this.historyService.clearCurrentSearchTerm()
  }

  onSearchFromHistory(query: string): void {
    this.historyService.setCurrentSearchTerm(query)
    this.selectedGenre.set(null)
    this.movieService.searchMovies(query)
  }

  // Movie selection methods
  onMovieSelect(movieId: number): void {
    const movie = this.searchResults().find(m => m.id === movieId)
    if (movie) {
      this.historyService.addToMovieHistory(movie)
    }
    this.router.navigate(['/movie', movieId])
  }

  onMovieSelectFromHistory(movie: Movie): void {
    this.historyService.addToMovieHistory(movie)
    this.router.navigate(['/movie', movie.id])
  }

  onMovieSelectFromList(movieId: number): void {
    this.router.navigate(['/movie', movieId])
  }

  // Genre methods
  onGenreSelect(genreId: number, genreName: string): void {
    const searchText = `${genreName}`
    this.historyService.setCurrentSearchTerm(searchText)
    this.selectedGenre.set(genreName)
    this.movieService.searchMoviesByGenre(genreId)
  }

  getGenresToShow() {
    if (this.showAllGenres()) {
      return this.genres()
    } else {
      return this.genres().slice(0, 10)
    }
  }

  loadMoreGenres(): void {
    this.showAllGenres.set(true)
  }

  showLessGenres(): void {
    this.showAllGenres.set(false)
  }

  // History management methods
  clearAllHistory(): void {
    this.historyService.clearSearchHistory()
  }

  clearAllMovieHistory(): void {
    this.historyService.clearMovieHistory()
  }
}
import { Component, signal } from '@angular/core';
import { ReturnComponent } from "../../components/return-component/return-component";
import { SearchBar } from "../../components/search-bar/search-bar";
import { Movie } from '../../models/movie.model';
import { TmdbService } from '../../services/tmdb-service/tmdb-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  imports: [ReturnComponent, SearchBar],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPage {
  movies = signal<Movie[]>([])
  searchHistory = signal<string[]>([])
  isLoading = signal(false)

  constructor(private tmdb: TmdbService, private router: Router) {}

  ngOnInit() {
    this.loadSearchHistory()
  }

  onSearch(term: string) {
    if (!term) {
      console.log('Búsqueda vacía')
      this.movies.set([])
      return
    }

    console.log('Buscando peliculas:', term)
    this.isLoading.set(true)

    this.addToHistory(term.trim())

    this.tmdb.searchMovies(term).subscribe({
      next: (response) => {
        console.log('Resultados:', response.results)
        this.movies.set(response.results)
        this.isLoading.set(false)
      },
      error: (error) => {
        console.error('Error en la búsqueda:', error)
        this.isLoading.set(false)
      }
    })
  }

  goToMovieDetail(movieId: number) {
    this.router.navigate(['/movie', movieId])
  }

  searchFromHistory(searchTerm: string) {
    this.onSearch(searchTerm)
  }

  clearHistory() {
    this.searchHistory.set([])
    localStorage.removeItem('movieSearchHistory')
  }

  private addToHistory(searchTerm: string) {
    const currentHistory = this.searchHistory()

    const filteredHistory = currentHistory.filter(term => 
      term.toLowerCase() !== searchTerm.toLowerCase()
    )

    const newHistory = [searchTerm, ...filteredHistory].slice(0, 8)

    this.searchHistory.set(newHistory)
    this.saveSearchHistory(newHistory)
  }

  private loadSearchHistory() {
    const savedHistory = localStorage.getItem('movieSearchHistory')
    if (savedHistory) {
      try {
        this.searchHistory.set(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Error cargando historial: ', e)
        this.searchHistory.set([])
      }
    }
  }

  private saveSearchHistory(history: string[]) {
    try {
      localStorage.setItem('movieSearchHistory', JSON.stringify(history))
    } catch (e) {
      console.error('Error guardando historial: ', e)
    }
  }

  getMovieYear(releaseDate: string | null): string {
    if (!releaseDate) return ''
    return releaseDate.substring(0, 4)
  }
}

import { computed, Injectable, signal } from '@angular/core';
import { Movie, MovieDetails } from '../../models/movie.models';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'saved_movies'

  private savedMoviesSignal = signal<(Movie | MovieDetails)[]>(this.getMoviesFromStorage())

  savedMovies = computed(() => this.savedMoviesSignal())

  constructor() {}

  private getMoviesFromStorage(): (Movie | MovieDetails)[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return []
    }

    try {
      const movies = localStorage.getItem(this.STORAGE_KEY)
      return movies ? JSON.parse(movies) : []
    } catch (error) {
      console.error('Error al leer del localStorage:', error)
      return []
    }
  }

  private saveMoviesToStorage(movies: (Movie | MovieDetails)[]): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(movies))
    } catch (error) {
      console.error('Error al guardar en localStorage:', error)
    }
  }

  addMovie(movie: Movie | MovieDetails): boolean {
    const currentMovies = this.getMoviesFromStorage()

    if (currentMovies.some(m => m.id === movie.id)) {
      return false
    }

    const updateMovies = [...currentMovies, movie]
    this.savedMoviesSignal.set(updateMovies)
    this.saveMoviesToStorage(updateMovies)
    return true
  }

  removeMovie(movieId: number): boolean {
    const currentMovies = this.getMoviesFromStorage()
    const updateMovies = currentMovies.filter(m => m.id !== movieId)

    if (updateMovies.length === currentMovies.length) {
      return false
    }

    this.savedMoviesSignal.set(updateMovies)
    this.saveMoviesToStorage(updateMovies)
    return true
  }

  isMovieSaved(movieId: number): boolean {
    const currentMovies = this.getMoviesFromStorage()
    return currentMovies.some(m => m.id === movieId)
  }

  getSavedMovies(): (Movie | MovieDetails)[] {
    return this.getMoviesFromStorage()
  }

  clearAllMovies(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    localStorage.removeItem(this.STORAGE_KEY)
  }

  getSavedMoviesCount(): number {
    return this.getMoviesFromStorage().length
  }
}

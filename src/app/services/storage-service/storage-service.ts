import { computed, inject, Injectable, signal } from '@angular/core';
import { Movie, MovieDetails } from '../../models/movie.models';
import { SortService } from '../sort-service/sort-service';
import { SortOption } from '../../models/sort.model';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'saved_movies'
  private sortService = inject(SortService)

  private savedMoviesSignal = signal<(Movie | MovieDetails)[]>(this.getMoviesFromStorage())

  savedMovies = computed(() => {
    const movies = this.savedMoviesSignal()
    const sortOption = this.sortService.currentSort()
    return this.sortMovies(movies, sortOption)
  })

  private sortMovies(movies: (Movie | MovieDetails)[], sortOption: SortOption): (Movie | MovieDetails)[] {
    const sortedMovies = [...movies];

    switch (sortOption) {
      case 'added-asc':
        return sortedMovies;
        
      case 'added-desc':
        return sortedMovies.reverse();
        
      case 'title-asc':
        return sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
        
      case 'title-desc':
        return sortedMovies.sort((a, b) => b.title.localeCompare(a.title));
        
      case 'release-asc':
        return sortedMovies.sort((a, b) => {
          const dateA = new Date(a.release_date || '9999-12-31');
          const dateB = new Date(b.release_date || '9999-12-31');
          return dateA.getTime() - dateB.getTime();
        });
        
      case 'release-desc':
        return sortedMovies.sort((a, b) => {
          const dateA = new Date(a.release_date || '0000-01-01');
          const dateB = new Date(b.release_date || '0000-01-01');
          return dateB.getTime() - dateA.getTime();
        });
        
      default:
        return sortedMovies;
    }
  }

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

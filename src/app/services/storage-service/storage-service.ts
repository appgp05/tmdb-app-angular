import { computed, inject, Injectable, signal } from '@angular/core';
import { Movie, MovieDetails } from '../../models/movie.models';
import { SortService } from '../sort-service/sort-service';
import { SortOption } from '../../models/sort.model';
import { MovieHistoryItem, SearchHistoryItem } from '../../models/history.model';


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

  private searchHistorySignal = signal<SearchHistoryItem[]>(this.getSearchHistoryFromStorage())
  searchHistory = this.searchHistorySignal.asReadonly()

  private getSearchHistoryFromStorage(): SearchHistoryItem[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem('searchHistory')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private saveSearchHistoryToStorage(history: SearchHistoryItem[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  addToSearchHistory(query: string): void {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const currentHistory = this.searchHistorySignal();
    
    // Eliminar búsquedas duplicadas (mantener la más reciente)
    const filteredHistory = currentHistory.filter(item => 
      item.query.toLowerCase() !== trimmedQuery.toLowerCase()
    );

    const newHistoryItem: SearchHistoryItem = {
      query: trimmedQuery,
      timestamp: Date.now(),
    };

    // Agregar al inicio del array y limitar a 20 elementos
    const newHistory = [newHistoryItem, ...filteredHistory].slice(0, 20);

    this.searchHistorySignal.set(newHistory);
    this.saveSearchHistoryToStorage(newHistory);
  }

  clearSearchHistory(): void {
    this.searchHistorySignal.set([]);
    this.saveSearchHistoryToStorage([]);
  }

  private movieHistorySignal = signal<MovieHistoryItem[]>(this.getMovieHistoryFromStorage())
  movieHistory = this.movieHistorySignal.asReadonly()

  private getMovieHistoryFromStorage(): MovieHistoryItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem('movieHistory');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveMovieHistoryToStorage(history: MovieHistoryItem[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('movieHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving movie history:', error);
    }
  }

  addToMovieHistory(movie: Movie | MovieDetails): void {
    const currentHistory = this.movieHistorySignal();
    
    // Eliminar duplicados (mantener la más reciente)
    const filteredHistory = currentHistory.filter(item => 
      item.id !== movie.id
    );

    const newHistoryItem: MovieHistoryItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      timestamp: Date.now(),
    };

    // Agregar al inicio del array y limitar a 50 elementos
    const newHistory = [newHistoryItem, ...filteredHistory].slice(0, 3);

    this.movieHistorySignal.set(newHistory);
    this.saveMovieHistoryToStorage(newHistory);
  }

  clearMovieHistory(): void {
    this.movieHistorySignal.set([]);
    this.saveMovieHistoryToStorage([]);
  }

  getRecentMovies(limit: number = 10): MovieHistoryItem[] {
    const history = this.movieHistorySignal();
    return history.slice(0, limit);
  }
}

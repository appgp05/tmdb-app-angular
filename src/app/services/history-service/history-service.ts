import { Injectable, signal } from '@angular/core';
import { MovieHistoryItem, SearchHistoryItem } from '../../models/history.model';
import { Movie, MovieDetails } from '../../models/movie.models';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  // Search History
  private searchHistorySignal = signal<SearchHistoryItem[]>(this.getSearchHistoryFromStorage());
  searchHistory = this.searchHistorySignal.asReadonly();

  // Movie History
  private movieHistorySignal = signal<MovieHistoryItem[]>(this.getMovieHistoryFromStorage());
  movieHistory = this.movieHistorySignal.asReadonly();

  // Current Search Term
  private currentSearchTermSignal = signal<string>(this.getCurrentSearchTermFromStorage());
  currentSearchTerm = this.currentSearchTermSignal.asReadonly();

  // Search History Methods
  private getSearchHistoryFromStorage(): SearchHistoryItem[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem('searchHistory');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
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

  // Movie History Methods
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

  // Current Search Term Methods
  private getCurrentSearchTermFromStorage(): string {
    if (typeof window === 'undefined') return '';

    try {
      const stored = localStorage.getItem('currentSearchTerm');
      return stored ? JSON.parse(stored) : '';
    } catch {
      return '';
    }
  }

  private saveCurrentSearchTermToStorage(term: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('currentSearchTerm', JSON.stringify(term));
    } catch (error) {
      console.error('Error saving current search term:', error);
    }
  }

  setCurrentSearchTerm(term: string): void {
    this.currentSearchTermSignal.set(term);
    this.saveCurrentSearchTermToStorage(term);
  }

  clearCurrentSearchTerm(): void {
    this.currentSearchTermSignal.set('');
    this.saveCurrentSearchTermToStorage('');
  }
}

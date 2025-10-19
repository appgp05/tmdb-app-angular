import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly STORAGE_KEY = 'favorite_movies'

  getFavorites(): any[] {
    if (typeof window === 'undefined') return []
    const favorites = localStorage.getItem(this.STORAGE_KEY)
    return favorites ? JSON.parse(favorites) : []
  }

  addToFavorites(movie: any): void {
    if (typeof window === 'undefined') return
    const favorites = this.getFavorites()
    if (!favorites.some(fav => fav.id === movie.id)) {
      favorites.push(movie)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites))
    }
  }

  removeFromFavorites(movieId: number): void {
    if (typeof window === 'undefined') return
    const favorites = this.getFavorites().filter(m => m.id !== movieId)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites))
  }

  isFavorite(movieId: number): boolean {
    return this.getFavorites().some(m => m.id === movieId)
  }
}

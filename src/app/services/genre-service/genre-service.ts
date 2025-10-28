import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Genre, GenreResponse } from '../../models/movie.models';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private http = inject(HttpClient)
  private baseUrl = '/.netlify/functions/tmdb'  

  private genresSignal = signal<Genre[]>([])

  genres = this.genresSignal.asReadonly()

  private loadingSignal = signal<boolean>(false)
  loading = this.loadingSignal.asReadonly()

  private errorSignal = signal<string | null>(null)
  error = this.errorSignal.asReadonly()

  loadMovieGenres(): void {
    this.loadingSignal.set(true)
    this.errorSignal.set(null)

    const url = `${this.baseUrl}?path=/genre/movie/list&language=en-US`;

    this.http.get<GenreResponse>(url).subscribe({
      next: (response) => {
        this.genresSignal.set(response.genres || [])
        this.loadingSignal.set(false)
      },
      error: (err) => {
        console.error('Error loading genres:', err)
        this.errorSignal.set('Failed to load genres')
        this.loadingSignal.set(false)
      }
    })
  }

  getGenreNames(genreIds: number[]): string[] {
    const genres = this.genresSignal()
    return genreIds
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter((name): name is string => name !== undefined)
  }

  getGenreById(id: number): Genre | undefined {
    return this.genresSignal().find(genre => genre.id === id)
  }

  clear(): void {
    this.genresSignal.set([]);
    this.errorSignal.set(null);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Movie, MovieDetails, SearchResponse } from '../../models/movie.models';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient)
  private baseUrl = '/.netlify/functions/tmdb'

  searchResults = signal<Movie[]>([])
  currentMovie = signal<MovieDetails | null>(null)
  isLoading = signal(false)
  error = signal<string | null>(null)

  searchMovies(query: string, page: number = 1): void {
    this.isLoading.set(true)
    this.error.set(null)

    const url = `${this.baseUrl}?path=/search/movie&query=${encodeURIComponent(query)}&page=${page}`

    console.log('Searching movies with query:', query)
    console.log('URL:', url)

    this.http.get<SearchResponse>(url)
      .subscribe({
        next: (response) => {
          console.log('Search successful:', response)
          console.log('Movies found:', response.results.length)
          console.log('Page:', response.page)
          console.log('Total pages:', response.total_pages)
          console.log('Total results:', response.total_results)

          response.results.forEach((movie, index) => {
            console.log(`${index + 1} · ${movie.title} (ID: ${movie.id})`)
          })

          this.searchResults.set(response.results)
          this.isLoading.set(false)
        },
        error: (err) => {
          this.error.set('Failed to search movies')
          this.isLoading.set(false)
          console.error('Search error:', err)
        }
    })
  }

  getMovieDetails(movieId: number): void {
    this.isLoading.set(true)
    this.error.set(null)

    const url = `${this.baseUrl}?path=/movie/${movieId}`

    this.http.get<MovieDetails>(url)
      .subscribe({
        next: (movie) => {
          this.currentMovie.set(movie)
          this.isLoading.set(false)
        },
        error: (err) => {
          this.error.set('Failed to load movie details')
          this.isLoading.set(false)
          console.error('Movie details error:', err)
        }
      })
  }

  clearSearch(): void {
    this.searchResults.set([])
  }

  clearCurrentMovie(): void {
    this.currentMovie.set(null)
  }
}

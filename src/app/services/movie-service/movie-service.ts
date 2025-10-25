import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { CrewMember, Movie, MovieDetails, SearchResponse, VideoInformation } from '../../models/movie.models';
import { StorageService } from '../storage-service/storage-service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient)
  private baseUrl = '/.netlify/functions/tmdb'
  private storageService = inject(StorageService)

  searchResults = signal<Movie[]>([])
  currentMovie = signal<MovieDetails | null>(null)
  movieVideos = signal<VideoInformation[]>([])
  isLoading = signal(false)
  error = signal<string | null>(null)

  isCurrentMovieSaved = computed(() => {
    const movie = this.currentMovie()
    const savedMovies = this.storageService.savedMovies()
    
    if (!movie) return false
    return this.storageService.isMovieSaved(movie.id)
  })

  searchMovies(query: string, page: number = 1): void {
    this.isLoading.set(true)
    this.error.set(null)

    const url = `${this.baseUrl}?path=/search/movie&query=${encodeURIComponent(query)}&page=${page}`

    this.http.get<SearchResponse>(url)
      .subscribe({
        next: (response) => {
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

    const url = `${this.baseUrl}?path=/movie/${movieId}&append_to_response=credits`

    this.http.get<MovieDetails>(url)
      .subscribe({
        next: (movie) => {      
          this.currentMovie.set(movie)
          this.isLoading.set(false)

          this.getMovieVideos(movieId)
        },
        error: (err) => {
          this.error.set('Failed to load movie details')
          this.isLoading.set(false)
          console.error('Movie details error:', err)
        }
      })
  }

  getMovieVideos(movieId: number): void {
    const url = `${this.baseUrl}?path=/movie/${movieId}/videos`

    this.http.get<{ results: VideoInformation[] }>(url)
      .subscribe({
        next: (response) => {
        this.movieVideos.set(response.results || [])
        },
        error: (err) => {
          console.error('Error fetching videos: ', err)
          this.movieVideos.set([])
        }
      })
  }

  getDirector(movie: MovieDetails): string | null {
    if (!movie.credits?.crew) return null

    const director = movie.credits.crew.find(
      (person: CrewMember) => person.job === 'Director'
    )

    return director ? director.name : null
  }

  getDirectors(movie: MovieDetails): string[] {
    if (!movie.credits?.crew) return [];
    
    const directors = movie.credits.crew.filter(
      (person: CrewMember) => person.job === 'Director'
    );
    
    return directors.map(director => director.name);
  }

  getTrailerUrl(videos: VideoInformation[]): string | null {
    if (!videos || videos.length === 0) {
      return null
    }

    // Prioridad 1: Trailer oficial de YouTube
    const officialTrailer = videos.find(video => 
      video.site === 'YouTube' && 
      video.type === 'Trailer' &&
      video.official === true
    )

    if (officialTrailer) {
      return `https://www.youtube.com/watch?v=${officialTrailer.key}`
    }

    // Prioridad 2: Cualquier trailer de YouTube
    const anyTrailer = videos.find(video => 
      video.site === 'YouTube' && 
      video.type === 'Trailer'
    )

    if (anyTrailer) {
      return `https://www.youtube.com/watch?v=${anyTrailer.key}`
    }

    // Prioridad 3: Teaser de YouTube
    const teaser = videos.find(video => 
      video.site === 'YouTube' && 
      video.type === 'Teaser'
    )

    if (teaser) {
      return `https://www.youtube.com/watch?v=${teaser.key}`
    }

    console.error('No suitable trailer found')
    return null
  }

  clearSearch(): void {
    this.searchResults.set([])
  }

  clearCurrentMovie(): void {
    this.currentMovie.set(null)
  }

  addCurrentMovieToSaved(): boolean {
    const movie = this.currentMovie()
    if (!movie) {
      return false
    }
    return this.storageService.addMovie(movie)
  }

  removeCurrentMovieFromSaved(): boolean {
    const movie = this.currentMovie()
    if (!movie) {
      return false
    }
    return this.storageService.removeMovie(movie.id)
  }
}

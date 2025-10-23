import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie-service/movie-service';
import { ReturnComponent } from "../../components/return-component/return-component";
import { DatePipe} from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorPlusBold, phosphorXBold } from '@ng-icons/phosphor-icons/bold';

@Component({
  selector: 'app-detail-page',
  imports: [ReturnComponent, DatePipe, NgIcon],
  templateUrl: './detail-page.html',
  styleUrl: './detail-page.css',
  viewProviders: [provideIcons({ phosphorPlusBold, phosphorXBold })]
})
export class DetailPage {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private movieService = inject(MovieService)

  currentMovie = this.movieService.currentMovie
  movieDetails = this.movieService.currentMovie
  movieVideos = this.movieService.movieVideos
  isLoading = this.movieService.isLoading
  error = this.movieService.error
  
  isMovieSaved = this.movieService.isCurrentMovieSaved

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const movieId = +params['id']
      if (movieId) {
        this.movieService.getMovieDetails(movieId)
      }
    })
  }
  
  ngOnDestroy(): void {
    this.movieService.clearCurrentMovie()
  }

  getBackdropUrl(): string {
    const movie = this.currentMovie()
    if (movie?.backdrop_path) {
      return `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    }
    return ''
  }

  getPosterUrl(): string {
    const movie = this.currentMovie()
    if (movie?.poster_path) {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    }
    return ''
  }

  getDirector(): string | null {
    const movie = this.movieDetails()
    return movie ? this.movieService.getDirector(movie) : null
  }

  getDirectors(): string[] {
    const movie = this.movieDetails()
    return movie ? this.movieService.getDirectors(movie) : []
  }

  getTrailerUrl(): string | null {
    const videos = this.movieVideos()
    return this.movieService.getTrailerUrl(videos)
  }

  hasTrailer(): boolean {
    return this.getTrailerUrl() !== null
  }

  toggleSaveMovie(): void {
    if (this.isMovieSaved()) {
      this.movieService.removeCurrentMovieFromSaved()
    } else {
      this.movieService.addCurrentMovieToSaved()
    }
  }
}

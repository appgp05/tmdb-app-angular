import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie-service/movie-service';
import { ReturnComponent } from "../../components/return-component/return-component";
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-detail-page',
  imports: [ReturnComponent, DatePipe, DecimalPipe],
  templateUrl: './detail-page.html',
  styleUrl: './detail-page.css'
})
export class DetailPage {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private movieService = inject(MovieService)

  currentMovie = this.movieService.currentMovie
  isLoading = this.movieService.isLoading
  error = this.movieService.error

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
}

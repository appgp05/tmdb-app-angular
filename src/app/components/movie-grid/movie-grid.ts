import { Component, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorFilmSlateFill } from '@ng-icons/phosphor-icons/fill';
import { phosphorPlus } from '@ng-icons/phosphor-icons/regular';
import { Movie, MovieDetails } from '../../models/movie.models';

@Component({
  selector: 'app-movie-grid',
  imports: [NgIcon, RouterLink],
  templateUrl: './movie-grid.html',
  styleUrl: './movie-grid.css',
  viewProviders: [provideIcons({ phosphorPlus, phosphorFilmSlateFill })]
})
export class MovieGrid {
  private router = inject(Router)

  movies = input.required<(Movie | MovieDetails)[]>()

  constructor() {
    effect(() => {
      console.log('🎬 MovieGrid - Películas recibidas:', this.movies());
    })
  }

  goToMovieDetails(movieId: number): void {
    this.router.navigate(['/movie', movieId])
  }

  getPosterUrl(movie: Movie | MovieDetails): string {
    if (movie?.poster_path) {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }
    return '';
  }

  hasPoster(movie: Movie | MovieDetails): boolean {
    return !!movie?.poster_path;
  }
}

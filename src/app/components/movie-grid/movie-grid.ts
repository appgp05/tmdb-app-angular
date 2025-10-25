import { Component, effect, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { phosphorFilmSlateFill } from '@ng-icons/phosphor-icons/fill';
import { phosphorPlus } from '@ng-icons/phosphor-icons/regular';
import { Router, RouterLink } from "@angular/router";
import { Movie, MovieDetails } from '../../models/movie.models';
import { StorageService } from '../../services/storage-service/storage-service';


@Component({
  selector: 'app-movie-grid',
  imports: [NgIcon, RouterLink],
  templateUrl: './movie-grid.html',
  styleUrl: './movie-grid.css',
  viewProviders: [provideIcons({ phosphorPlus, phosphorFilmSlateFill })]
})
export class MovieGrid {
  private storageService = inject(StorageService)
  private router = inject(Router)

  movies = this.storageService.savedMovies

  onMovieSelect(movieId: number): void {
    this.router.navigate(['/movie', movieId])
  }

  getPosterUrl(movie: Movie | MovieDetails): string {
    if (movie?.poster_path) {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    }
    return ''
  }

  hasPoster(movie: Movie | MovieDetails): boolean {
    return !!movie?.poster_path
  }
}

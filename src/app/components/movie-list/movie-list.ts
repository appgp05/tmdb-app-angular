import { Component, input, output } from '@angular/core';
import { MovieHistoryItem } from '../../models/history.model';
import { phosphorArrowUpRight } from '@ng-icons/phosphor-icons/regular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movie-list',
  imports: [DatePipe],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList {
  movies = input.required<MovieHistoryItem[]>()

  movieSelected = output<number>()
  clearList = output<void>

  onMovieSelect(movieId: number): void {
    this.movieSelected.emit(movieId)
  }

  getPosterUrl(posterPath: string | null): string {
    if (posterPath) {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    } else {
      return '/assets/placeholder-movie.jpg';
    }
  }
}

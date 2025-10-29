import { Component, input, output } from '@angular/core';
import { Genre } from '../../../models/movie.models';

@Component({
  selector: 'app-search-genres',
  imports: [],
  templateUrl: './search-genres.html',
  styleUrl: './search-genres.css'
})
export class SearchGenres {
  genres = input.required<Genre[]>();
  showAllGenres = input<boolean>(false);
  currentSearchTerm = input<string>('');

  genreSelected = output<{id: number, name: string}>();
  loadMore = output<void>();
  showLess = output<void>();

  getGenresToShow() {
    const genresList = this.genres();
    if (this.showAllGenres()) {
      return genresList;
    } else {
      return genresList.slice(0, 10);
    }
  }

  onGenreSelect(genreId: number, genreName: string): void {
    this.genreSelected.emit({ id: genreId, name: genreName });
  }

  onLoadMore(): void {
    this.loadMore.emit();
  }

  onShowLess(): void {
    this.showLess.emit();
  }
}

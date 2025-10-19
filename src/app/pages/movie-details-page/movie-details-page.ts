import { Component, inject, signal } from '@angular/core';
import { ReturnComponent } from "../../components/return-component/return-component";
import { Movie } from '../../models/movie.model';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb-service/tmdb-service';
import { DatePipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core'
import { phosphorPlusBold, phosphorXBold } from '@ng-icons/phosphor-icons/bold';
import { LocalStorageService } from '../../services/localStorage-service/local-storage-service';

@Component({
  selector: 'app-movie-details-page',
  imports: [ReturnComponent, DatePipe, NgIcon],
  templateUrl: './movie-details-page.html',
  styleUrl: './movie-details-page.css',
  viewProviders: [provideIcons({ phosphorPlusBold, phosphorXBold })]
})
export class MovieDetailsPage {
  movie = signal<Movie | null>(null)
  private localStorageService = inject(LocalStorageService)

  constructor(private route: ActivatedRoute, private tmdb: TmdbService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'))

    if (!id) {
      console.error('ID de la película invalido')
      return
    }

    console.log('Cargando detalles de la película con ID: ', id)

    this.tmdb.getMovieDetails(id).subscribe({
      next: (data) => {
        this.movie.set(data)
        console.log('Detalles de la película:', data);
      },
      error: (err) => {
        console.error('Error al obtener detalles de la película:', err);
      }
    });
  }

  isFavorite(movie: Movie | null): boolean {
    if (!movie) return false;
    return this.localStorageService.isFavorite(movie.id);
  }

  onMovieClick(movie: Movie | null) {
    if (!movie) return;

    if (this.localStorageService.isFavorite(movie.id)) {
      this.localStorageService.removeFromFavorites(movie.id);
      console.log(`Película eliminada: ${movie.title}`);
    } else {
      this.localStorageService.addToFavorites(movie);
      console.log(`Película guardada: ${movie.title}`);
    }

    console.log('Lista actual de películas en localStorage:', this.localStorageService.getFavorites());
  }
}

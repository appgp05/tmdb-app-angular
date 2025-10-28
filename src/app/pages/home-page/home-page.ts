import { Component, effect, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { phosphorFunnelSimple, phosphorMagnifyingGlass } from '@ng-icons/phosphor-icons/regular'
import { phosphorMonitorPlayFill } from '@ng-icons/phosphor-icons/fill'
import { StorageService } from '../../services/storage-service/storage-service';
import { SortMenuComponent } from "../../components/sort-menu-component/sort-menu-component";
import { MovieGrid } from "../../components/movie-grid/movie-grid";
import { GenreService } from '../../services/genre-service/genre-service';

@Component({
  selector: 'app-home-page',
  imports: [NgIcon, SortMenuComponent, MovieGrid],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  viewProviders: [provideIcons({ phosphorFunnelSimple, phosphorMagnifyingGlass, phosphorMonitorPlayFill })]
})
export class HomePage {
  private storageService = inject(StorageService)
  private genresService = inject(GenreService)

  savedMovies = this.storageService.savedMovies
  moviesCount = signal(this.savedMovies().length)

  constructor() {
    console.log('savedMovies():', this.savedMovies())

    effect(() => {
      const movies = this.savedMovies()
      console.log(movies)
    })
  }

  ngOnInit() {
    console.log('Iniciando carga de géneros...');
    this.genresService.loadMovieGenres();
    
    // Verificar los géneros después de un tiempo
    setTimeout(() => {
      console.log('Géneros después de 2 segundos:', this.genresService.genres());
      console.log('Estado de carga:', this.genresService.loading());
      console.log('Error:', this.genresService.error());
    }, 2000);
  }
}

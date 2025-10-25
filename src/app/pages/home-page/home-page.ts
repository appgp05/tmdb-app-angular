import { Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { phosphorFunnelSimple, phosphorMagnifyingGlass } from '@ng-icons/phosphor-icons/regular'
import { phosphorMonitorPlayFill } from '@ng-icons/phosphor-icons/fill'
import { MovieGrid } from "../../components/movie-grid/movie-grid";
import { StorageService } from '../../services/storage-service/storage-service';
import { SortMenuComponent } from "../../components/sort-menu-component/sort-menu-component";

@Component({
  selector: 'app-home-page',
  imports: [NgIcon, MovieGrid, SortMenuComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  viewProviders: [provideIcons({ phosphorFunnelSimple, phosphorMagnifyingGlass, phosphorMonitorPlayFill })]
})
export class HomePage {
  private storageService = inject(StorageService)

  savedMovies = this.storageService.savedMovies
  moviesCount = signal(this.savedMovies().length)
}

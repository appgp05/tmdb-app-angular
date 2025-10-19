import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { phosphorFunnelSimple, phosphorMagnifyingGlass } from '@ng-icons/phosphor-icons/regular'
import { phosphorMonitorPlayFill } from '@ng-icons/phosphor-icons/fill'
import { MovieGrid } from "../../components/movie-grid/movie-grid";

@Component({
  selector: 'app-home-page',
  imports: [NgIcon, MovieGrid],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  viewProviders: [provideIcons({ phosphorFunnelSimple, phosphorMagnifyingGlass, phosphorMonitorPlayFill })]
})
export class HomePage {
}

import { Component } from '@angular/core';
import { ReturnComponent } from "../../components/return-component/return-component";
import { Movie } from '../../models/movie.model';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb-service/tmdb-service';

@Component({
  selector: 'app-movie-details-page',
  imports: [ReturnComponent],
  templateUrl: './movie-details-page.html',
  styleUrl: './movie-details-page.css'
})
export class MovieDetailsPage {
  movie?: Movie

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
        this.movie = data;
        console.log('Detalles de la película:', data);
      },
      error: (err) => {
        console.error('Error al obtener detalles de la película:', err);
      }
    });
  }
}

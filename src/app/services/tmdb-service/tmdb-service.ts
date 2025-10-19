import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { Movie, MovieResponse } from '../../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private functionUrl = '/.netlify/functions/tmdb'; // endpoint de tu Netlify Function

  constructor(private http: HttpClient) {}

  getPopularMovies(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(this.functionUrl, {
      params: {
        path: '/movie/popular',
        language: 'es-ES',
        page: page.toString()
      }
    });
  }

  searchMovies(query: string, page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(this.functionUrl, {
      params: {
        path: 'search/movie',
        language: 'es-ES',
        page: page.toString(),
        query: query
      }
    });
  }

  getMovieDetails(id: number): Observable<Movie> {
    const details$ = this.http.get<any>(this.functionUrl, {
      params: {
        path: `/movie/${id}`,
        language: 'es-ES',
        append_to_response: 'credits'
      }
    });

    const videos$ = this.http.get<any>(this.functionUrl, {
      params: {
        path: `/movie/${id}/videos`,
        language: 'en-US'
      }
    });

    // Combinamos ambas llamadas
    return forkJoin([details$, videos$]).pipe(
      map(([data, videosData]) => {
        const director = data.credits?.crew?.find((c: any) => c.job === 'Director')?.name;

        const trailerObj = videosData.results?.find(
          (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
        );

        const trailer = trailerObj ? `https://www.youtube.com/watch?v=${trailerObj.key}` : null;

        const movie: Movie = {
          ...data,
          director: director || 'Desconocido',
          trailer,
        };

        return movie;
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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
    return this.http.get<any>(this.functionUrl, {
      params: {
        path: `/movie/${id}`,
        language: 'es-ES',
        append_to_response: 'credits, videos'
      }
    }).pipe(
      map((data) => {
        const director = data.credits?.crew?.find((c: any) => c.job === 'Director')?.name

        const trailerKey = data.videos?.results?.find(
          (v: any) => v.type === 'Trailer' && v.site === 'Youtube'
        )?.key;

        const trailer = trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : null;

        const movie: Movie = {
          id: data.id,
          title: data.title,
          overview: data.overview,
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          release_date: data.release_date,
          vote_average: data.vote_average,
          vote_count: data.vote_count,
          director: director || 'Desconocido',
          runtime: data.runtime || null,
          trailer
        };

        return movie;
      })
    )
  }
}

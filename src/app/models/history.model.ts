import { Movie, MovieDetails } from "./movie.models"

export interface SearchHistoryItem {
    query: string
    timestamp: number
}

export interface MovieHistoryItem {
    movie: Movie | MovieDetails
    timestamp: number
}
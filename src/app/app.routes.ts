import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { SearchPage } from './pages/search-page/search-page';
import { MovieDetailsPage } from './pages/movie-details-page/movie-details-page';

export const routes: Routes = [
    { path: '', component: HomePage},
    { path: 'search', component: SearchPage},
    { path: 'movie/:id', component: MovieDetailsPage }
];

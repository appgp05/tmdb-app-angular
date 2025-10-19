import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { SearchPage } from './pages/search-page/search-page';
import { DetailPage } from './pages/detail-page/detail-page';

export const routes: Routes = [
    { path: '', component: HomePage},
    { path: 'search', component: SearchPage},
    { path: 'movie/:id', component: DetailPage},
    { path: '**', redirectTo: ''}
];

import { Routes } from '@angular/router';
import { FavoritesComponent } from './Components/favorites/favorites.component';
import { PhotosComponent } from './Components/photos/photos.component';
import { PageNotFoundComponent } from './Components/page-not-found/page-not-found.component';
import { SinglePhotoComponent } from './Components/single-photo/single-photo.component';

export const routes: Routes = [
    { path: 'photos', component: PhotosComponent, title: 'Photos' },
    { path: 'photos/:id', component: SinglePhotoComponent, title: 'Single Photo' },
    { path: 'favorites', component: FavoritesComponent, title: 'Favorites' },
    { path: '', redirectTo: '/photos', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

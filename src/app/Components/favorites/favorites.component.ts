import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FavoritesService } from '../../Services/favorites.service';
import { PhotosService } from '../../Services/photos.service';
import { RouterLink } from '@angular/router';
import { Photo } from '../../Models/photo';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../Environments/environment';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, MatGridListModule, MatProgressSpinnerModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent {

  private minDelay: number = environment.minDelay
  private maxDelay: number = environment.maxDelay

  width: number = environment.photoWidth
  height: number = environment.photoHeight

  loading = signal<boolean>(true)
  favorites = signal<Photo[]>([])

  constructor(private favoritesService: FavoritesService, private photosService: PhotosService) { }

  ngOnInit() {
    const favorites = this.favoritesService.getFavorites()
    this.favorites.set(this.photosService.loadStoredPhotos(favorites))

    const randomDelay = this.photosService.getRandomInteger(this.minDelay, this.maxDelay)
    setTimeout(() => {
      this.loading.set(false)
    }, randomDelay);
  }
}

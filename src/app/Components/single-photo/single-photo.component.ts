import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PhotosService } from '../../Services/photos.service';
import { FavoritesService } from '../../Services/favorites.service';
import { Photo } from '../../Models/photo';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../Environments/environment';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-single-photo',
  imports: [MatIconModule, MatButtonModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './single-photo.component.html',
  styleUrl: './single-photo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('hidden => visible', [
        animate('500ms ease-out')
      ]),
      transition('visible => hidden', [
        animate('500ms ease-in')
      ])
    ])
  ]

})
export class SinglePhotoComponent {

  private minDelay: number = environment.minDelay
  private maxDelay: number = environment.maxDelay

  loading = signal<boolean>(true)

  photo!: Photo
  photoId!: string
  isVisible = false

  constructor(private route: ActivatedRoute, private photosService: PhotosService, private favoritesService: FavoritesService) { }

  ngOnInit() {
    this.photoId = this.route.snapshot.params['id']

    const favorites = this.favoritesService.getFavorites()
    this.photo = this.photosService.loadStoredPhotos(favorites, true).find(photo => photo.id == this.photoId) ?? {} as Photo

    setTimeout(() => {
      this.isVisible = true
    }, this.minDelay)
  }

  onImageLoad() {
    const randomDelay = this.photosService.getRandomInteger(this.minDelay, this.maxDelay)
    setTimeout(() => {
      this.loading.set(false)
    }, randomDelay);
  }

  deleteFromFavorites() {
    this.favoritesService.removeFavorite(this.photoId)
  }
}

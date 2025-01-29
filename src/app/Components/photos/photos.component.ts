import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PhotosService } from '../../Services/photos.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FavoritesService } from '../../Services/favorites.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { Photo } from '../../Models/photo';
import { StoredPhoto } from '../../Models/storedPhoto';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { environment } from '../../Environments/environment';


@Component({
  selector: 'app-photos',
  imports: [MatProgressSpinnerModule, MatCardModule, MatButtonModule, MatIconModule, NgClass],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosComponent {

  width: number = environment.photoWidth
  height: number = environment.photoHeight

  private page: number = 0
  private photosPerPage: number = 6;
  private threshold: number = 50
  private buffer: number = 6

  loading = signal<boolean>(true);
  photos = signal<Photo[]>([])

  scrollSubscription: Subscription | null = null;
  photosSubscription: Subscription | null = null;

  constructor(private photosService: PhotosService, private favoritesService: FavoritesService) { }

  ngOnInit() {

    this.photosSubscription = this.photosService.getPhotos().subscribe({
      next: (photos) => {
        this.photos.update(_ => {
          const startIndex = Math.max(0, this.page * this.photosPerPage - this.buffer)
          const endIndex = Math.min(photos.length, this.page * this.photosPerPage + this.buffer)
          return photos.slice(startIndex, endIndex)
        })
        this.loading.set(false)
      },
      error: (err) => {
        console.error('Failed to fetch photos:', err);
      },
    })

    this.loading.set(true)
    this.photosService.loadRandomPhotos(this.photosPerPage)

    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
      this.scrollSubscription = fromEvent(scrollContainer, 'scroll')
        .pipe(debounceTime(200))
        .subscribe((event) => this.onScroll(event as Event));
    }
  }

  ngOnDestroy() {
    this.scrollSubscription?.unsubscribe();
    this.photosSubscription?.unsubscribe();
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;

    if (target.scrollHeight - target.scrollTop <= target.clientHeight + this.threshold) {
      if (!this.loading()) {
        this.loading.set(true)
        this.page++
        this.photosService.loadRandomPhotos(this.photosPerPage)
      }
    }
  }

  toggleFavorite(photoId: string) {
    this.photosService.toggleFavorite(photoId)

    const clickedPhoto = this.photos().find((photo) => photo.id === photoId)
    if (clickedPhoto) {
      const storedPhoto: StoredPhoto = {
        id: clickedPhoto.id,
        originalWidth: clickedPhoto.originalWidth ?? this.width,
        originalHeight: clickedPhoto.originalHeight ?? this.height,
      }

      if (this.favoritesService.isFavorite(photoId)) {
        this.favoritesService.removeFavorite(photoId)
      } else {
        this.favoritesService.addFavorite(storedPhoto)
      }
    }
  }

}

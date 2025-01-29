import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Photo } from '../Models/photo';
import { StoredPhoto } from '../Models/storedPhoto';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  private apiUrl: string = environment.apiUrl
  private width: number = environment.photoWidth
  private height: number = environment.photoHeight
  private minDelay: number = environment.minDelay
  private maxDelay: number = environment.maxDelay

  private photosList: any[] = []
  private photos: Photo[] = []
  private photosSubject = new BehaviorSubject<Photo[]>(this.photos)

  constructor(private httpClient: HttpClient) { }

  getPhotos(): Observable<Photo[]> {
    return this.photosSubject.asObservable()
  }

  getFavorites() {
    return this.photos.filter((photo) => photo.isFavorite);
  }

  toggleFavorite(photoId: string) {
    this.photos = this.photos.map((photo) =>
      photo.id === photoId ? { ...photo, isFavorite: !photo.isFavorite } : photo
    );
    this.photosSubject.next(this.photos);
  }

  loadStoredPhotos(storedPhotos: string[], originalSize: boolean = false): Photo[] {
    const photos: StoredPhoto[] = storedPhotos.map(storedPhoto => JSON.parse(storedPhoto))
    const favoritePhotos: Photo[] = []

    photos.forEach((storedPhoto) => {
      const newPhoto: Photo = {
        uuid: uuidv4(),
        id: storedPhoto.id,
        src: `${this.apiUrl}/id/${storedPhoto.id}/${originalSize ? storedPhoto.originalWidth : this.width}/${originalSize ? storedPhoto.originalHeight : this.height}`,
        isFavorite: true,
        originalWidth: storedPhoto.originalWidth,
        originalHeight: storedPhoto.originalHeight
      }
      favoritePhotos.push(newPhoto)
    });

    return favoritePhotos
  }

  loadRandomPhotos(photosPerPage: number) {
    if (this.photosList.length == 0) {
      this.getPhotosList().subscribe({
        next: (photosList) => {
          this.photosList = photosList
          this.createPhotosArray(photosPerPage)
        },
        error: (err) => {
          console.error('Failed to fetch photos list:', err);
        },
      });
    } else {
      this.createPhotosArray(photosPerPage)
    }
  }

  private createPhotosArray(photosPerPage: number) {
    const newPhotos = this.getRandomPhotos(photosPerPage);

    const randomDelay = this.getRandomInteger(this.minDelay, this.maxDelay)
    setTimeout(() => {
      this.photos = [...this.photos, ...newPhotos];
      this.photosSubject.next(this.photos);
    }, randomDelay);
  }

  private getRandomPhotos(photosPerPage: number): Photo[] {
    const newPhotos: Photo[] = [];

    for (let i = 0; i < photosPerPage; i++) {
      newPhotos.push(this.getRandomPhoto())
    }
    return newPhotos
  }

  private getRandomPhoto(): Photo {
    const randomId = this.getRandomInteger(0, this.photosList.length - 1);
    const randomPhoto = this.photosList[randomId];

    const newPhoto: Photo = {
      uuid: uuidv4(),
      id: randomPhoto.id,
      src: `${this.apiUrl}/id/${randomPhoto.id}/${this.width}/${this.height}`,
      isFavorite: false,
      originalWidth: randomPhoto.width,
      originalHeight: randomPhoto.height
    }
    return newPhoto
  }

  getPhotosList(): Observable<any> {
    const photosListUrl: string = `${this.apiUrl}/list`
    return this.httpClient.get(photosListUrl)
  }

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

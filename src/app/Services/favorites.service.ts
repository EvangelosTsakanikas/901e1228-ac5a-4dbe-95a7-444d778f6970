import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { StoredPhoto } from '../Models/storedPhoto';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private localStorageKey: string = 'favorites'

  constructor(private localStorageService: LocalStorageService) { }

  getFavorites(): string[] {
    const favorites = this.localStorageService.getItem(this.localStorageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite(newPhoto: StoredPhoto): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(newPhoto.id)) {
      favorites.push(JSON.stringify(newPhoto));
      this.localStorageService.setItem(this.localStorageKey, JSON.stringify(favorites));
    }
  }

  removeFavorite(photoId: string): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(item => {
      const storedPhoto = JSON.parse(item);
      return storedPhoto.id != photoId;
    })
    this.localStorageService.setItem(this.localStorageKey, JSON.stringify(favorites));
  }

  isFavorite(photoId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some((item) => {
      const storedPhoto = JSON.parse(item);
      return storedPhoto.id === photoId;
    })
  }
}

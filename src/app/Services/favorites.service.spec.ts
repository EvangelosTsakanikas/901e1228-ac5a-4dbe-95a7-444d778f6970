import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';
import { LocalStorageService } from './local-storage.service';
import { StoredPhoto } from '../Models/storedPhoto';

describe('FavoritesService', () => {
  let service: FavoritesService;

  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {

    localStorageService = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        { provide: LocalStorageService, useValue: localStorageService }
      ]
    });
    service = TestBed.inject(FavoritesService);

    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFavorites', () => {
    it('should return an empty array if no favorites are stored', () => {
      localStorageService.getItem.and.returnValue(null);
      expect(service.getFavorites()).toEqual([]);
    });

    it('should return parsed favorites from local storage', () => {
      const storedFavorites = JSON.stringify([
        JSON.stringify({ id: '123', src: 'test.jpg', isFavorite: true })
      ]);
      const parsedStoredFavorites = JSON.parse(storedFavorites)

      localStorageService.getItem.and.returnValue(storedFavorites);
      expect(service.getFavorites()).toEqual(parsedStoredFavorites);
    });
  });

  describe('addFavorite', () => {
    it('should add a new favorite if it does not exist', () => {
      const photo: StoredPhoto = { id: '123', originalWidth: 500, originalHeight: 500 };
      localStorageService.getItem.and.returnValue(JSON.stringify([]));

      service.addFavorite(photo);

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        'favorites',
        JSON.stringify([JSON.stringify(photo)])
      );
    });
  });

  describe('removeFavorite', () => {
    it('should remove a photo from favorites', () => {
      const photo1 = { id: '123', src: 'test1.jpg', isFavorite: true };
      const photo2 = { id: '456', src: 'test2.jpg', isFavorite: true };
      const storedFavorites = JSON.stringify([
        JSON.stringify(photo1),
        JSON.stringify(photo2)
      ]);
      localStorageService.getItem.and.returnValue(storedFavorites);

      service.removeFavorite('123');

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        'favorites',
        JSON.stringify([JSON.stringify(photo2)])
      );
    });

    it('should do nothing if the photo does not exist', () => {
      const photo1 = { id: '123', src: 'test1.jpg', isFavorite: true };
      const storedFavorites = JSON.stringify([JSON.stringify(photo1)]);
      localStorageService.getItem.and.returnValue(storedFavorites);

      service.removeFavorite('999');

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        'favorites',
        storedFavorites
      );
    });
  });

  describe('isFavorite', () => {
    it('should return true if the photo is in favorites', () => {
      const photo = { id: '123', src: 'test.jpg', isFavorite: true };
      localStorageService.getItem.and.returnValue(
        JSON.stringify([JSON.stringify(photo)])
      );

      expect(service.isFavorite('123')).toBeTrue();
    });

    it('should return false if the photo is not in favorites', () => {
      localStorageService.getItem.and.returnValue(JSON.stringify([]));

      expect(service.isFavorite('999')).toBeFalse();
    });
  });
});

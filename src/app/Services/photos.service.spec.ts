import { TestBed } from '@angular/core/testing';

import { PhotosService } from './photos.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Photo } from '../Models/photo';
import { environment } from '../Environments/environment';

describe('PhotosService', () => {
  let service: PhotosService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PhotosService
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);

    service = TestBed.inject(PhotosService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPhotos', () => {
    it('should return an observable of photos', (done) => {
      service.getPhotos().subscribe(photos => {
        expect(photos).toEqual([]);
        done();
      });
    });
  });

  describe('getFavorites', () => {
    it('should return only favorite photos', () => {
      service['photos'] = [
        { id: '1', isFavorite: true } as Photo,
        { id: '2', isFavorite: false } as Photo
      ];

      expect(service.getFavorites()).toEqual([{ id: '1', isFavorite: true } as Photo]);
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite status', () => {
      service['photos'] = [
        { id: '1', isFavorite: false } as Photo
      ];

      service.toggleFavorite('1');

      expect(service['photos'][0].isFavorite).toBeTrue();
    });

    it('should not change other photos', () => {
      service['photos'] = [
        { id: '1', isFavorite: false } as Photo,
        { id: '2', isFavorite: true } as Photo
      ];

      service.toggleFavorite('1');

      expect(service['photos'][0].isFavorite).toBeTrue();
      expect(service['photos'][1].isFavorite).toBeTrue();
    });
  });

  describe('loadStoredPhotos', () => {
    it('should return converted stored photos', () => {
      const storedPhotos: string[] = [
        JSON.stringify({ id: '123', originalWidth: 5000, originalHeight: 3000 })
      ];

      const result = service.loadStoredPhotos(storedPhotos, false);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('123');
      expect(result[0].src).toContain(environment.apiUrl);
      expect(result[0].isFavorite).toBeTrue();
      expect(result[0].originalWidth).toBe(5000);
      expect(result[0].originalHeight).toBe(3000);
    });
  });

  describe('getRandomInteger', () => {
    it('should return a number within the given range', () => {
      for (let i = 0; i < 100; i++) {
        const result = service.getRandomInteger(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('getPhotosList', () => {
    it('should make a GET request to fetch photos list', () => {
      service.getPhotosList().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/list`);
      expect(req.request.method).toBe('GET');
      req.flush([]);

      httpMock.verify()
    });
  });

  describe('loadRandomPhotos', () => {
    it('should call getPhotosList if photosList is empty', () => {
      spyOn<any>(service, 'getPhotosList').and.callThrough();

      service.loadRandomPhotos(5);

      const req = httpMock.expectOne(`${environment.apiUrl}/list`);
      req.flush([{ id: '1' }, { id: '2' }]); // Mock data

      expect(service['getPhotosList']).toHaveBeenCalled();
    });

    it('should call createPhotosArray if photosList is already populated', () => {
      service['photosList'] = [{ id: '1' }];
      spyOn<any>(service, 'createPhotosArray').and.callThrough();

      service.loadRandomPhotos(5);

      expect(service['createPhotosArray']).toHaveBeenCalled();
    });
  });

});

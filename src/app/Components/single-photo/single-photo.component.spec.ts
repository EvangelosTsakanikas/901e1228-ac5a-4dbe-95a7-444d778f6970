import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePhotoComponent } from './single-photo.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PhotosService } from '../../Services/photos.service';
import { FavoritesService } from '../../Services/favorites.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('SinglePhotoComponent', () => {
  let component: SinglePhotoComponent;
  let fixture: ComponentFixture<SinglePhotoComponent>;

  let photosService: jasmine.SpyObj<PhotosService>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;

  beforeEach(async () => {

    const photosServiceMock = jasmine.createSpyObj('PhotosService', ['loadStoredPhotos']);
    const favoritesServiceMock = jasmine.createSpyObj('FavoritesService', ['getFavorites', 'removeFavorite']);

    await TestBed.configureTestingModule({
      imports: [
        SinglePhotoComponent,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
        { provide: PhotosService, useValue: photosServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SinglePhotoComponent);
    component = fixture.componentInstance;

    // addition //
    photosService = TestBed.inject(PhotosService) as jasmine.SpyObj<PhotosService>;
    favoritesService = TestBed.inject(FavoritesService) as jasmine.SpyObj<FavoritesService>;

    photosService.loadStoredPhotos.and.returnValue([{
      id: '123', src: 'test.jpg',
      uuid: '',
      isFavorite: false
    }]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when loading is true', () => {
    component.loading.set(true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('.spinner mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should hide spinner when loading is false', () => {
    component.loading.set(false);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('.spinner mat-spinner'));
    expect(spinner).toBeFalsy();
  });

  it('should call onImageLoad when the image loads', () => {
    spyOn(component, 'onImageLoad');

    const img: DebugElement = fixture.debugElement.query(By.css('img'));
    img.triggerEventHandler('load', {});

    expect(component.onImageLoad).toHaveBeenCalled();
  });

  it('should call deleteFromFavorites when clicking remove button', () => {
    spyOn(component, 'deleteFromFavorites');

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(component.deleteFromFavorites).toHaveBeenCalled();
  });
});

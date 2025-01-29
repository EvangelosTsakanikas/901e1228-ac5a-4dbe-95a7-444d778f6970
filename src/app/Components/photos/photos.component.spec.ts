import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosComponent } from './photos.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PhotosComponent', () => {
  let component: PhotosComponent;
  let fixture: ComponentFixture<PhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesComponent } from './favorites.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

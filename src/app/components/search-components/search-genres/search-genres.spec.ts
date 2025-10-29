import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGenres } from './search-genres';

describe('SearchGenres', () => {
  let component: SearchGenres;
  let fixture: ComponentFixture<SearchGenres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchGenres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchGenres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

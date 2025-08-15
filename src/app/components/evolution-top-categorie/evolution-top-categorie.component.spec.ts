import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionTopCategorieComponent } from './evolution-top-categorie.component';

describe('EvolutionTopCategorieComponent', () => {
  let component: EvolutionTopCategorieComponent;
  let fixture: ComponentFixture<EvolutionTopCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvolutionTopCategorieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvolutionTopCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatFournisseurComponent } from './stat-fournisseur.component';

describe('StatFournisseurComponent', () => {
  let component: StatFournisseurComponent;
  let fixture: ComponentFixture<StatFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatFournisseurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

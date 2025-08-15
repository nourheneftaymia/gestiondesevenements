import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailUtilisateurDialogComponent } from './detail-utilisateur-dialog.component';

describe('DetailUtilisateurDialogComponent', () => {
  let component: DetailUtilisateurDialogComponent;
  let fixture: ComponentFixture<DetailUtilisateurDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailUtilisateurDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailUtilisateurDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

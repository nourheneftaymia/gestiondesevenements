import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterFournisseurDialogComponent } from './ajouter-fournisseur-dialog.component';

describe('AjouterFournisseurDialogComponent', () => {
  let component: AjouterFournisseurDialogComponent;
  let fixture: ComponentFixture<AjouterFournisseurDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterFournisseurDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterFournisseurDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

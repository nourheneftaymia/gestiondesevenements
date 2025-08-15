import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFournisseurDialogComponent } from './document-fournisseur-dialog.component';

describe('DocumentFournisseurDialogComponent', () => {
  let component: DocumentFournisseurDialogComponent;
  let fixture: ComponentFixture<DocumentFournisseurDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentFournisseurDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentFournisseurDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

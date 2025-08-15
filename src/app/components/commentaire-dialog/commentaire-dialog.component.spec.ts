import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentaireDialogComponent } from './commentaire-dialog.component';

describe('CommentaireDialogComponent', () => {
  let component: CommentaireDialogComponent;
  let fixture: ComponentFixture<CommentaireDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentaireDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentaireDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

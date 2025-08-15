import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModifEvFinalComponent } from './dialog-modif-ev-final.component';

describe('DialogModifEvFinalComponent', () => {
  let component: DialogModifEvFinalComponent;
  let fixture: ComponentFixture<DialogModifEvFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogModifEvFinalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogModifEvFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeuserComponent } from './listeuser.component';

describe('ListeuserComponent', () => {
  let component: ListeuserComponent;
  let fixture: ComponentFixture<ListeuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

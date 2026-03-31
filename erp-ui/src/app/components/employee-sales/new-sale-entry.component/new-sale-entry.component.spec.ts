import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSaleEntryComponent } from './new-sale-entry.component';

describe('NewSaleEntryComponent', () => {
  let component: NewSaleEntryComponent;
  let fixture: ComponentFixture<NewSaleEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSaleEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSaleEntryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

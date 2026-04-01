import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDueCollectionComponent } from './customer-due-collection.component';

describe('CustomerDueCollectionComponent', () => {
  let component: CustomerDueCollectionComponent;
  let fixture: ComponentFixture<CustomerDueCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDueCollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDueCollectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

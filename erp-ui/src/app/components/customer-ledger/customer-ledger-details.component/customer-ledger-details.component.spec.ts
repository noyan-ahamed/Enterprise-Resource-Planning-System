import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLedgerDetailsComponent } from './customer-ledger-details.component';

describe('CustomerLedgerDetailsComponent', () => {
  let component: CustomerLedgerDetailsComponent;
  let fixture: ComponentFixture<CustomerLedgerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerLedgerDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLedgerDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

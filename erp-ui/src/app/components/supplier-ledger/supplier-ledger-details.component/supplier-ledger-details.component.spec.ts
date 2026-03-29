import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierLedgerDetailsComponent } from './supplier-ledger-details.component';

describe('SupplierLedgerDetailsComponent', () => {
  let component: SupplierLedgerDetailsComponent;
  let fixture: ComponentFixture<SupplierLedgerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierLedgerDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierLedgerDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

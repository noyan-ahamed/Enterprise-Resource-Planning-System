import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentModalComponent } from './supplier-payment-modal.component';

describe('SupplierPaymentModalComponent', () => {
  let component: SupplierPaymentModalComponent;
  let fixture: ComponentFixture<SupplierPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPaymentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPaymentModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedPaymentComponent } from './approved-payment.component';

describe('ApprovedPaymentComponent', () => {
  let component: ApprovedPaymentComponent;
  let fixture: ComponentFixture<ApprovedPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedPaymentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

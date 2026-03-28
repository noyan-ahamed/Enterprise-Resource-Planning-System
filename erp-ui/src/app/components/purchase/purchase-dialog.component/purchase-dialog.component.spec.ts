import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDialogComponent } from './purchase-dialog.component';

describe('PurchaseDialogComponent', () => {
  let component: PurchaseDialogComponent;
  let fixture: ComponentFixture<PurchaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

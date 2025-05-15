import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseHistoryTableComponent } from './release-history-table.component';

describe('ReleaseHistoryTableComponent', () => {
  let component: ReleaseHistoryTableComponent;
  let fixture: ComponentFixture<ReleaseHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseHistoryTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

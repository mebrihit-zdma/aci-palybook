import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugFixesTableComponent } from './bug-fixes-table.component';

describe('BugFixesTableComponent', () => {
  let component: BugFixesTableComponent;
  let fixture: ComponentFixture<BugFixesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugFixesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugFixesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

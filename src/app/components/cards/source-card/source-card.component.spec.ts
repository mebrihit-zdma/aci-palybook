import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceCardComponent } from './source-card.component';

describe('SourceCardComponent', () => {
  let component: SourceCardComponent;
  let fixture: ComponentFixture<SourceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

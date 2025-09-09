import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyInsightXComponent } from './why-atlas.component';

describe('WhyInsightXComponent', () => {
  let component: WhyInsightXComponent;
  let fixture: ComponentFixture<WhyInsightXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyInsightXComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyInsightXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPerfomanceComponent } from './viewPerfomance.component';

describe('ViewPerfomanceComponent', () => {
  let component: ViewPerfomanceComponent;
  let fixture: ComponentFixture<ViewPerfomanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPerfomanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPerfomanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

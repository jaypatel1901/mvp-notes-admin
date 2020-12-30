import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageStaticsComponent } from './usage-statics.component';

describe('UsageStaticsComponent', () => {
  let component: UsageStaticsComponent;
  let fixture: ComponentFixture<UsageStaticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageStaticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageStaticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

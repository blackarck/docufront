import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqformComponent } from './reqform.component';

describe('ReqformComponent', () => {
  let component: ReqformComponent;
  let fixture: ComponentFixture<ReqformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

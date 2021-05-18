import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginscrComponent } from './loginscr.component';

describe('LoginscrComponent', () => {
  let component: LoginscrComponent;
  let fixture: ComponentFixture<LoginscrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginscrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginscrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

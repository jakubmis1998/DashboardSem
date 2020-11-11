import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiParamsComponent } from './multi-params.component';

describe('MultiParamsComponent', () => {
  let component: MultiParamsComponent;
  let fixture: ComponentFixture<MultiParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiParamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddoneComponent } from './addone.component';

describe('AddoneComponent', () => {
  let component: AddoneComponent;
  let fixture: ComponentFixture<AddoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

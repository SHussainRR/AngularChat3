import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneChatroomComponent } from './one-chatroom.component';

describe('OneChatroomComponent', () => {
  let component: OneChatroomComponent;
  let fixture: ComponentFixture<OneChatroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneChatroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneChatroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

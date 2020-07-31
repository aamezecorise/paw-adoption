import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatlistPage } from './chatlist.page';

describe('ChatlistPage', () => {
  let component: ChatlistPage;
  let fixture: ComponentFixture<ChatlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatlistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

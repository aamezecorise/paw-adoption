import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestVerificationPage } from './request-verification.page';

describe('RequestVerificationPage', () => {
  let component: RequestVerificationPage;
  let fixture: ComponentFixture<RequestVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestVerificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

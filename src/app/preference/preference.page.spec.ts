import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencePage } from './preference.page';

describe('PreferencePage', () => {
  let component: PreferencePage;
  let fixture: ComponentFixture<PreferencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

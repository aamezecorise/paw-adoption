import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptLandingPage } from './adopt-landing.page';

describe('AdoptLandingPage', () => {
  let component: AdoptLandingPage;
  let fixture: ComponentFixture<AdoptLandingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdoptLandingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdoptLandingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

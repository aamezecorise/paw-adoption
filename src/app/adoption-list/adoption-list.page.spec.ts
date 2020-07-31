import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptionListPage } from './adoption-list.page';

describe('AdoptionListPage', () => {
  let component: AdoptionListPage;
  let fixture: ComponentFixture<AdoptionListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdoptionListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdoptionListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

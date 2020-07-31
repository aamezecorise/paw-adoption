import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPetPage } from './add-pet.page';

describe('AddPetPage', () => {
  let component: AddPetPage;
  let fixture: ComponentFixture<AddPetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

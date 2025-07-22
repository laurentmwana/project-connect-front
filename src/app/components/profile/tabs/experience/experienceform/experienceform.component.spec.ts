import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceformComponent } from './experienceform.component';

describe('ExperienceformComponent', () => {
  let component: ExperienceformComponent;
  let fixture: ComponentFixture<ExperienceformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

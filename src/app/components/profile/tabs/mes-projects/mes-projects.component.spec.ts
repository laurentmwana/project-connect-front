import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesProjectsComponent } from './mes-projects.component';

describe('MesProjectsComponent', () => {
  let component: MesProjectsComponent;
  let fixture: ComponentFixture<MesProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

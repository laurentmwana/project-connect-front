import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioformComponent } from './portfolioform.component';

describe('PortfolioformComponent', () => {
  let component: PortfolioformComponent;
  let fixture: ComponentFixture<PortfolioformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

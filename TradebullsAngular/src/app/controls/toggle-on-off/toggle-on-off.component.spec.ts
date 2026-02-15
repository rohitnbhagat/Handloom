import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleOnOffComponent } from './toggle-on-off.component';

describe('ToggleOnOffComponent', () => {
  let component: ToggleOnOffComponent;
  let fixture: ComponentFixture<ToggleOnOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleOnOffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToggleOnOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

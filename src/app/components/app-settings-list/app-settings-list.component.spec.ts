import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSettingsListComponent } from './app-settings-list.component';

describe('AppSettingsListComponent', () => {
  let component: AppSettingsListComponent;
  let fixture: ComponentFixture<AppSettingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSettingsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

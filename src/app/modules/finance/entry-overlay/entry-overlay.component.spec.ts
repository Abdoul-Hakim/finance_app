import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryOverlayComponent } from './entry-overlay.component';

describe('EntryOverlayComponent', () => {
  let component: EntryOverlayComponent;
  let fixture: ComponentFixture<EntryOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

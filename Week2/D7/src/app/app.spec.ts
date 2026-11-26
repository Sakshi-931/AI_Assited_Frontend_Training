import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app';
import { AuthService } from './core/services/auth.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
      ],
    }).compileComponents();
  });

  it('should create the application root', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render router outlet or app shell based on authentication', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const authService = TestBed.inject(AuthService);

    if (authService.isAuthenticated()) {
      expect(compiled.querySelector('app-shell')).not.toBeNull();
    } else {
      expect(compiled.querySelector('router-outlet')).not.toBeNull();
    }
  });
});

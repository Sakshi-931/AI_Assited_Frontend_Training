import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginForm with auto-filled credentials', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')?.value).toBe('sakshi.khankar@edusphere.com');
    expect(component.loginForm.get('password')?.value).toBe('Password123!');
  });

  it('should mark email as invalid if empty or not an email format', () => {
    const emailControl = component.emailControl;
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('required')).toBeTruthy();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('should mark password as invalid if shorter than 6 characters', () => {
    const passwordControl = component.passwordControl;
    passwordControl?.setValue('123');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
  });

  it('should toggle password visibility signal', () => {
    expect(component.showPassword()).toBeFalsy();
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBeTruthy();
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBeFalsy();
  });

  it('should validate form when valid values are entered', () => {
    component.loginForm.setValue({
      email: 'sakshi.khankar@edusphere.com',
      password: 'Password123!',
      rememberMe: true,
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call authService.login when submitted with valid credentials', () => {
    const loginSpy = vi.spyOn(authService, 'login');
    component.loginForm.setValue({
      email: 'sakshi.khankar@edusphere.com',
      password: 'Password123!',
      rememberMe: true,
    });
    component.onSubmit();
    expect(loginSpy).toHaveBeenCalledWith({
      email: 'sakshi.khankar@edusphere.com',
      password: 'Password123!',
      rememberMe: true,
    });
  });
});

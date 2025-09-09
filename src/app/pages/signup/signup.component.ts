import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  industry = '';
  industries = [
    'Property Management',
    'Manufacturing',
    'Logistic',
    'Retail',
    'Construction',
    'Healthcare',
    'Education',
    'Other'
  ];
  signupError: string | null = null;
  signupSuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.signupError = null;
    this.signupSuccess = false;
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      industry: this.industry
    };
    this.authService.signup(data).subscribe({
      next: () => {
        this.signupSuccess = true;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.signupError = 'Sign up failed. Please try again.';
      }
    });
  }
} 
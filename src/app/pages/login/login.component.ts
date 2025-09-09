import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginError: string | null = null;
  username = '';
  password = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.loginError = null;
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        // handle success (e.g., navigate to dashboard)
      },
      error: (err) => {
        this.loginError = 'Login failed. Please check your credentials.';
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
} 
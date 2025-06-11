import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class NavigationComponent implements OnInit {
  showSearch = false;
  isLoggedIn = false;
  userName = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Check login status and get user data
    this.isLoggedIn = this.authService.isAuthenticated();
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }
    isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  searchRecipes(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/recipes'], { queryParams: { search: query } });
      this.showSearch = false;
    }
  }

  signOut(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
    this.router.navigate(['/home']);
  }
}


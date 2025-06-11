import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from '../../services/meals';
import { SafePipe } from '../../pipes/safe-pipe';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.html',
  styleUrls: ['./recipes-list.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe]
})
export class RecipesListComponent implements OnInit {
  meals: any[] = [];
  filteredMeals: any[] = [];

  categories: string[] = [];
  cuisines: string[] = [];

  currentPage = 1;
  pageSize = 6;
  totalMeals = 0;
  totalPages = 0;

  selectedCategory = '';
  selectedCuisine = '';
  searchQuery = '';

  selectedVideoUrl: string | null = null;
  loading = true;

  constructor(private mealserv: MealService) {}

  ngOnInit(): void {
    this.mealserv.getMeals().subscribe(data => {
      this.meals = data.meals || [];
      this.extractFilters();
      this.applyFilters();
    });
  }

  extractFilters(): void {
    this.categories = Array.from(new Set(this.meals.map(m => m.strCategory))).filter(Boolean).sort();
    this.cuisines = Array.from(new Set(this.meals.map(m => m.strArea))).filter(Boolean).sort();
  }

  applyFilters(): void {
    let filtered = [...this.meals];

    if (this.selectedCategory) {
      filtered = filtered.filter(meal => meal.strCategory === this.selectedCategory);
    }

    if (this.selectedCuisine) {
      filtered = filtered.filter(meal => meal.strArea === this.selectedCuisine);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(meal =>
        meal.strMeal.toLowerCase().includes(q) ||
        meal.strInstructions.toLowerCase().includes(q)
      );
    }

    this.totalMeals = filtered.length;
    this.totalPages = Math.ceil(this.totalMeals / this.pageSize);

    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredMeals = filtered.slice(start, start + this.pageSize);
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onCuisineChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedCuisine = '';
    this.searchQuery = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  openVideo(youtubeUrl: string) {
    const videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
    this.selectedVideoUrl = videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`
      : null;
    this.loading = true;
    document.body.classList.add('modal-open');
  }

  closeVideo() {
    this.selectedVideoUrl = null;
    document.body.classList.remove('modal-open');
  }
}

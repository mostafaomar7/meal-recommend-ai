import { Component, OnInit } from '@angular/core';
import { MealService } from '../../services/meals';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meals',
  imports: [CommonModule , FormsModule],
  templateUrl: './meals.html',
  styleUrl: './meals.scss'
})
export class Meals implements OnInit {
  constructor(private mealserv: MealService) {}

  meals: any[] = [];
  filteredMeals: any[] = [];

  searchQuery: string = '';
  selectedCuisine: string = '';
  selectedDifficulty: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 6;

  ngOnInit(): void {
    this.mealserv.getnewmeals().subscribe(data => {
      this.meals = data.recipes || [];
      this.applyFilters(); // تطبيق الفلاتر أول ما البيانات تيجي
    });
  }

  applyFilters() {
    let result = this.meals;

    if (this.searchQuery.trim()) {
      result = result.filter(meal =>
        meal.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedCuisine) {
      result = result.filter(meal => meal.cuisine === this.selectedCuisine);
    }

    if (this.selectedDifficulty) {
      result = result.filter(meal => meal.difficulty === this.selectedDifficulty);
    }

    this.filteredMeals = result;
    this.currentPage = 1; // رجع لأول صفحة لما يتغير الفلتر
  }

  get pagedMeals() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMeals.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMeals.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getPageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}


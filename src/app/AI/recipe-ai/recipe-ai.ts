import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from '../../services/meals';
import { OpenAiService } from '../../services/ai';
import { catchError, map, of } from 'rxjs';

interface UnifiedRecipe {
  id: string | number;
  name: string;
  image: string;
  cuisine: string;
  difficulty?: string;
  prepTimeMinutes?: number;
  ingredients?: string[];
}

@Component({
  selector: 'app-recipe-ai',
  templateUrl: './recipe-ai.html',
  styleUrls: ['./recipe-ai.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class RecipeAi implements OnInit {
  // البحث اليدوي
  searchQuery = '';
  recipes: UnifiedRecipe[] = [];
  loading = false;
  errorMessage = '';
  aiRecommendations: string[] = [];
  showAiRecommendations = false;
  aiLoading = false;

  constructor(
    private mealService: MealService,
    private aiService: OpenAiService
  ) { }
  showTip: boolean = false;

  ngOnInit() {
    // Test AI recommendations on component initialization
    this.testAiRecommendations();
    const now = new Date();
    const hours = now.getHours();

    // لو الوقت بين 8 مساءً (20) و 3 فجراً (3)
    if (hours >= 20 || hours < 3) {
      this.showTip = true;
    }
  }

  async testAiRecommendations() {
    this.searchQuery = 'Quick and healthy dinner ideas';
    await this.getAiRecommendations();
  }

  searchRecipes(): void {
    if (!this.searchQuery.trim()) {
      this.errorMessage = 'يرجى إدخال عبارة للبحث.';
      this.recipes = [];
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.recipes = [];
    this.showAiRecommendations = false;

    // API الأول
    this.mealService.getMeals(this.searchQuery).subscribe({
      next: (data) => {
        const meals = data.meals || [];
        const normalizedMeals = meals.map((m: any): UnifiedRecipe => ({
          id: m.idMeal,
          name: m.strMeal,
          image: m.strMealThumb,
          cuisine: m.strArea || 'Unknown',
          difficulty: '',
          prepTimeMinutes: undefined,
          ingredients: [
            m.strIngredient1,
            m.strIngredient2,
            m.strIngredient3,
            m.strIngredient4,
            m.strIngredient5,
          ].filter(Boolean),
        }));

        // API الثاني
        this.mealService.searchRecipes(this.searchQuery).subscribe({
          next: (data2) => {
            const recipes2 = data2.recipes || [];
            const normalizedRecipes = recipes2.map((r: any): UnifiedRecipe => ({
              id: r.id,
              name: r.name,
              image: r.image,
              cuisine: r.cuisine || 'Unknown',
              difficulty: r.difficulty,
              prepTimeMinutes: r.prepTimeMinutes,
              ingredients: r.ingredients,
            }));

            this.recipes = [...normalizedMeals, ...normalizedRecipes];

            if (this.recipes.length === 0) {
              this.errorMessage = `لم يتم العثور على وصفات لـ "${this.searchQuery}".`;
            }

            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'حدث خطأ أثناء جلب بيانات الوصفات من API الثاني.';
            this.loading = false;
          },
        });
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب بيانات الوجبات من API الأول.';
        this.loading = false;
      },
    });
  }

  async getAiRecommendations(): Promise<void> {
    if (!this.searchQuery.trim()) {
      this.errorMessage = 'Please enter your preferences first.';
      return;
    }

    this.aiLoading = true;
    this.showAiRecommendations = true;
    this.aiRecommendations = [];

    try {
      this.aiRecommendations = await this.aiService.getRecipeRecommendations(this.searchQuery);
      console.log('AI Recommendations:', this.aiRecommendations); // Debug log
    } catch (error) {
      this.errorMessage = 'Failed to get AI recommendations. Please try again.';
      console.error('Error:', error);
    } finally {
      this.aiLoading = false;
    }
  }
}

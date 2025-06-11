import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms'; // استيراد للـ ngModel
import { NormalizedRecipe , RecipeService } from '../../services/recipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-finder',
  standalone: true, // مهم: نجعل الكومبوننت مستقلًا
  imports: [
    FormsModule , CommonModule // إضافة FormsModule هنا للـ ngModel
  ],
  templateUrl: './recipefinder.html',
  styleUrls: ['./recipefinder.scss']
})
export class RecipeFinderComponent implements OnInit {
  // استخدام signals لإدارة كل الحالات
  public userQuery = signal<string>('');
  // استخدام الواجهة الجديدة هنا
  public recommendedRecipes = signal<NormalizedRecipe[]>([]);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);

  constructor(private recipeService: RecipeService) {}

   showTip: boolean = false;

  ngOnInit(): void {
    const now = new Date();
    const hours = now.getHours();

    // لو الوقت بين 8 مساءً (20) و 3 فجراً (3)
    if (hours >= 20 || hours < 3) {
      this.showTip = true;
    }
  }

  async onSearch() {
    if (!this.userQuery().trim()) return;

    // تحديث الحالات باستخدام .set()
    this.isLoading.set(true);
    this.recommendedRecipes.set([]);
    this.error.set(null);

    try {
  const bestRecipes = await this.recipeService.findBestRecipes(this.userQuery());
      if (bestRecipes && bestRecipes.length > 0) {
    this.recommendedRecipes.set(bestRecipes);
  } else {
    this.error.set('Sorry, no matching recipes were found.');
  }
    } catch (e) {
      console.error(e);
      this.error.set('An error occurred while searching. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
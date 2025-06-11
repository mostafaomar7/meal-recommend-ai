import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HfInference } from '@huggingface/inference';
import { environment } from '../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

// 1. تعريف شكل الوصفة الموحد (Interface)
export interface NormalizedRecipe {
  id: string;
  source: 'DummyJSON' | 'TheMealDB';
  name: string;
  image: string;
  tags: string[];
  cuisine: string;
  difficulty?: string; // اختياري لأنه غير موجود في كل الـ APIs
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private hf: HfInference;
  private dummyJsonApiUrl = 'https://dummyjson.com/recipes';
  private mealDbApiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

  constructor(private http: HttpClient) {
    this.hf = new HfInference(environment.huggingFaceApiKey);
  }

  // دالة خاصة لجلب البيانات من dummyjson وتوحيدها
  private async getFromDummyJson(): Promise<NormalizedRecipe[]> {
    const response = await firstValueFrom(this.http.get<{ recipes: any[] }>(this.dummyJsonApiUrl));
    return response.recipes.map(recipe => ({
      id: `dummy_${recipe.id}`,
      source: 'DummyJSON',
      name: recipe.name,
      image: recipe.image,
      tags: recipe.tags || [],
      cuisine: recipe.cuisine,
      difficulty: recipe.difficulty,
    }));
  }

  // دالة خاصة لجلب البيانات من themealdb وتوحيدها
  private async getFromMealDB(query: string): Promise<NormalizedRecipe[]> {
    const response = await firstValueFrom(this.http.get<{ meals: any[] }>(`${this.mealDbApiUrl}${query}`));
    if (!response.meals) return [];
    return response.meals.map(meal => ({
      id: `mealdb_${meal.idMeal}`,
      source: 'TheMealDB',
      name: meal.strMeal,
      image: meal.strMealThumb,
      tags: meal.strTags ? meal.strTags.split(',') : [],
      cuisine: meal.strArea,
    }));
  }

  // --- الدالة الرئيسية التي تستخدمها الواجهة ---

  public async findBestRecipes(userPreference: string): Promise<NormalizedRecipe[]> {
    // استدعاء كلا الـ APIs في نفس الوقت
    const [dummyJsonRecipes, mealDbRecipes] = await Promise.all([
      this.getFromDummyJson(),
      // نستخدم أول كلمة من بحث المستخدم للبحث في aPI الخاص بـ MealDB
      this.getFromMealDB(userPreference.split(' ')[0] || 'a')
    ]);

    // دمج القائمتين في قائمة واحدة كبيرة
    const allRecipes = [...dummyJsonRecipes, ...mealDbRecipes];

    if (allRecipes.length === 0) {
      return [];
    }

    // تنسيق البيانات الموحدة لإرسالها للذكاء الاصطناعي
    const formattedRecipes = allRecipes.map(recipe =>
      `ID: ${recipe.id}, Name: ${recipe.name}, Cuisine: ${recipe.cuisine}, Tags: [${recipe.tags.join(', ')}]`
    ).join('\n');

    // بناء الـ Prompt ليطلب قائمة من 3 نتائج
    const prompt = `
      Here is a list of available recipes from different sources:
      ---
      ${formattedRecipes}
      ---
      The user's request is: "${userPreference}".
      Based on this request, what are the top 3 best matching recipes? Please return a comma-separated list of their ID numbers. For example: dummy_15,mealdb_52811,dummy_4
    `;

    // استدعاء الذكاء الاصطناعي
    const aiResponse = await this.hf.chatCompletion({
      model: 'google/gemma-2b-it',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    });

    const recommendedIdsText = aiResponse.choices[0].message.content?.trim();
    if (!recommendedIdsText) {
      return [];
    }

    // تحليل الرد (تحويل النص إلى مصفوفة من الـ IDs)
    const recommendedIds = recommendedIdsText.split(',').map(id => id.trim());
    if (recommendedIds.length === 0) {
      return [];
    }

    // استخدام .filter() لجلب كل الوصفات التي تطابق الـ IDs
    const foundRecipes = allRecipes.filter(recipe => recommendedIds.includes(recipe.id));
    
    // ترتيب النتائج بنفس الترتيب الذي اقترحه الذكاء الاصطناعي
    return foundRecipes.sort((a, b) => recommendedIds.indexOf(a.id) - recommendedIds.indexOf(b.id));
  }
}
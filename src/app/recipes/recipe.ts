import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Recipe } from './models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  // Placeholder data - will be replaced with API calls later
  private recipes: Recipe[] = [
    {
      id: 1,
      title: 'Mediterranean Salad',
      description: 'A refreshing salad with cucumbers, tomatoes, olives, and feta cheese.',
      ingredients: [
        '1 cucumber, diced',
        '2 tomatoes, diced',
        '1/2 red onion, thinly sliced',
        '1/2 cup Kalamata olives',
        '200g feta cheese, cubed',
        '2 tbsp olive oil',
        '1 tbsp lemon juice',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Combine cucumber, tomatoes, red onion, and olives in a large bowl.',
        'Add feta cheese cubes.',
        'In a small bowl, whisk together olive oil, lemon juice, salt, and pepper.',
        'Pour dressing over salad and toss gently to combine.',
        'Serve immediately or refrigerate for up to 2 hours.'
      ],
      cookingTime: 15,
      servings: 4,
      difficulty: 'Easy',
      category: 'Salad',
      cuisine: 'Mediterranean',
      imageUrl: 'https://placeholder.com/mediterranean-salad.jpg',
      createdAt: new Date('2025-05-15'),
      updatedAt: new Date('2025-05-15')
    },
    {
      id: 2,
      title: 'Chicken Curry',
      description: 'A flavorful curry with tender chicken pieces in a rich sauce.',
      ingredients: [
        '500g chicken breast, cubed',
        '2 tbsp vegetable oil',
        '1 onion, finely chopped',
        '3 garlic cloves, minced',
        '1 tbsp ginger, grated',
        '2 tbsp curry powder',
        '1 tsp turmeric',
        '1 can (400ml) coconut milk',
        'Salt to taste',
        'Fresh cilantro for garnish'
      ],
      instructions: [
        'Heat oil in a large pan over medium heat.',
        'Add onion, garlic, and ginger. Sauté until fragrant.',
        'Add chicken and cook until browned on all sides.',
        'Stir in curry powder and turmeric. Cook for 1 minute.',
        'Pour in coconut milk and bring to a simmer.',
        'Reduce heat and cook for 20 minutes until chicken is tender.',
        'Season with salt and garnish with cilantro before serving.'
      ],
      cookingTime: 45,
      servings: 6,
      difficulty: 'Medium',
      category: 'Main Course',
      cuisine: 'Indian',
      imageUrl: 'https://placeholder.com/chicken-curry.jpg',
      createdAt: new Date('2025-05-20'),
      updatedAt: new Date('2025-05-20')
    },
    {
      id: 3,
      title: 'Chocolate Brownies',
      description: 'Rich and fudgy brownies with a perfect crackly top.',
      ingredients: [
        '200g dark chocolate',
        '175g butter',
        '325g caster sugar',
        '3 eggs',
        '130g plain flour',
        '50g cocoa powder',
        '1 tsp vanilla extract',
        'Pinch of salt'
      ],
      instructions: [
        'Preheat oven to 180°C (350°F). Line a 20cm square baking tin.',
        'Melt chocolate and butter together in a heatproof bowl over simmering water.',
        'Remove from heat and stir in sugar.',
        'Add eggs one at a time, mixing well after each addition.',
        'Fold in flour, cocoa powder, vanilla, and salt until just combined.',
        'Pour into prepared tin and bake for 25-30 minutes.',
        'Allow to cool before cutting into squares.'
      ],
      cookingTime: 40,
      servings: 12,
      difficulty: 'Easy',
      category: 'Dessert',
      cuisine: 'American',
      imageUrl: 'https://placeholder.com/chocolate-brownies.jpg',
      createdAt: new Date('2025-05-25'),
      updatedAt: new Date('2025-05-25')
    },
    {
      id: 4,
      title: 'Vegetable Stir Fry',
      description: 'A quick and healthy stir fry with colorful vegetables.',
      ingredients: [
        '2 tbsp vegetable oil',
        '2 garlic cloves, minced',
        '1 tbsp ginger, grated',
        '1 carrot, julienned',
        '1 bell pepper, sliced',
        '1 cup broccoli florets',
        '1 cup snap peas',
        '2 tbsp soy sauce',
        '1 tbsp sesame oil',
        '1 tsp honey',
        'Sesame seeds for garnish'
      ],
      instructions: [
        'Heat oil in a wok or large frying pan over high heat.',
        'Add garlic and ginger, stir for 30 seconds.',
        'Add vegetables and stir fry for 3-4 minutes until crisp-tender.',
        'In a small bowl, mix soy sauce, sesame oil, and honey.',
        'Pour sauce over vegetables and toss to coat.',
        'Garnish with sesame seeds before serving.'
      ],
      cookingTime: 20,
      servings: 4,
      difficulty: 'Easy',
      category: 'Main Course',
      cuisine: 'Asian',
      imageUrl: 'https://placeholder.com/vegetable-stir-fry.jpg',
      createdAt: new Date('2025-06-01'),
      updatedAt: new Date('2025-06-01')
    },
    {
      id: 5,
      title: 'Pasta Carbonara',
      description: 'Classic Italian pasta dish with a creamy egg sauce and pancetta.',
      ingredients: [
        '400g spaghetti',
        '150g pancetta or guanciale, diced',
        '3 large eggs',
        '75g Pecorino Romano cheese, grated',
        '50g Parmesan cheese, grated',
        'Freshly ground black pepper',
        'Salt for pasta water'
      ],
      instructions: [
        'Cook pasta in salted boiling water according to package instructions.',
        'While pasta cooks, fry pancetta in a large pan until crispy.',
        'In a bowl, whisk eggs and grated cheeses together.',
        'Drain pasta, reserving 1/2 cup of pasta water.',
        'Working quickly, add hot pasta to the pan with pancetta.',
        'Remove pan from heat and add egg mixture, tossing continuously.',
        'Add a splash of pasta water to create a creamy sauce.',
        'Season with black pepper and serve immediately.'
      ],
      cookingTime: 25,
      servings: 4,
      difficulty: 'Medium',
      category: 'Main Course',
      cuisine: 'Italian',
      imageUrl: 'https://placeholder.com/pasta-carbonara.jpg',
      createdAt: new Date('2025-06-05'),
      updatedAt: new Date('2025-06-05')
    },
    {
      id: 6,
      title: 'Avocado Toast',
      description: 'Simple and nutritious breakfast with mashed avocado on toast.',
      ingredients: [
        '2 slices of sourdough bread',
        '1 ripe avocado',
        '1 tbsp lemon juice',
        'Salt and pepper to taste',
        'Red pepper flakes (optional)',
        '2 eggs (optional for poached eggs)'
      ],
      instructions: [
        'Toast bread slices until golden and crisp.',
        'Cut avocado in half, remove pit, and scoop flesh into a bowl.',
        'Add lemon juice, salt, and pepper. Mash with a fork to desired consistency.',
        'Spread avocado mixture on toast.',
        'Top with red pepper flakes if desired.',
        'For poached eggs: bring water to simmer, add vinegar, create whirlpool, crack egg into center, cook for 3 minutes, remove with slotted spoon.',
        'Place poached egg on top of avocado toast if desired.'
      ],
      cookingTime: 10,
      servings: 2,
      difficulty: 'Easy',
      category: 'Breakfast',
      cuisine: 'Modern',
      imageUrl: 'https://placeholder.com/avocado-toast.jpg',
      createdAt: new Date('2025-06-10'),
      updatedAt: new Date('2025-06-10')
    }
  ];

  constructor() { }

  // Get all recipes
  getRecipes(): Observable<Recipe[]> {
    return of(this.recipes);
  }

  // Get recipes with pagination
  getRecipesPaginated(page: number, pageSize: number): Observable<Recipe[]> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecipes = this.recipes.slice(startIndex, endIndex);
    return of(paginatedRecipes);
  }

  // Get total number of recipes
  getRecipesCount(): Observable<number> {
    return of(this.recipes.length);
  }

  // Get recipe by ID
  getRecipeById(id: number): Observable<Recipe | undefined> {
    const recipe = this.recipes.find(r => r.id === id);
    return of(recipe);
  }

  // Get recipes by category
  getRecipesByCategory(category: string): Observable<Recipe[]> {
    const filteredRecipes = this.recipes.filter(r => r.category === category);
    return of(filteredRecipes);
  }

  // Get recipes by cuisine
  getRecipesByCuisine(cuisine: string): Observable<Recipe[]> {
    const filteredRecipes = this.recipes.filter(r => r.cuisine === cuisine);
    return of(filteredRecipes);
  }

  // Search recipes by title or description
  searchRecipes(query: string): Observable<Recipe[]> {
    const searchTerm = query.toLowerCase();
    const filteredRecipes = this.recipes.filter(r => 
      r.title.toLowerCase().includes(searchTerm) || 
      r.description.toLowerCase().includes(searchTerm)
    );
    return of(filteredRecipes);
  }

  // Get unique categories
  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.recipes.map(r => r.category))];
    return of(categories);
  }

  // Get unique cuisines
  getCuisines(): Observable<string[]> {
    const cuisines = [...new Set(this.recipes.map(r => r.cuisine))];
    return of(cuisines);
  }
}


import { Routes } from '@angular/router';
import { Meals } from './meals/meals/meals';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./shared/layout/layout').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home/home').then(m => m.HomeComponent)
      }
    ]
  },
  {
    path: 'recipes',
    loadComponent: () => import('./shared/layout/layout').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./recipes/recipes-list/recipes-list').then(m => m.RecipesListComponent)
      }
    ]
  },{
    path: 'meals',
    loadComponent: () => import('./shared/layout/layout').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./meals/meals/meals').then(m => m.Meals)
      }
    ]
  },
  {
    path: 'recommend',
    loadComponent: () => import('./shared/layout/layout').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./AI/recipe-ai/recipe-ai').then(m => m.RecipeAi)
      }
    ]
  },
  {
    path: 'localrecommend',
    loadComponent: () => import('./shared/layout/layout').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./Api-recommend/recipefinder/recipefinder').then(m => m.RecipeFinderComponent)
      }
    ]
  },
  // {path : 'meals' , component : Meals},
  { path: '**', redirectTo: 'home' }
];


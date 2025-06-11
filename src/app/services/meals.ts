import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  private newapiUrl = 'https://dummyjson.com/recipes';

  constructor(private http: HttpClient) {}

  getMeals(query: string = ''): Observable<any> {
    return this.http.get<any>(this.apiUrl + query);
  }

  getnewmeals(query: string = ''): Observable<any> {
    return this.http.get<any>(this.newapiUrl + query);
  }

  searchRecipes(query: string): Observable<any> {
  if (query.trim()) {
    return this.http.get<any>(`${this.newapiUrl}/search?q=${query}`);
  } else {
    return this.http.get<any>(this.newapiUrl);
  }
}

}

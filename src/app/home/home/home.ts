import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealService } from '../../services/meals';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  // This component serves as a placeholder for the home page.
  // It can be expanded with additional functionality or content in the future.
  
  constructor(private mealserv : MealService) {}
  meals: any[] = [];
  ngOnInit(): void {
    this.mealserv.getnewmeals().subscribe(data => {
      // This is where you can handle the data received from the meal service.
      // Currently, it does nothing but can be expanded later.
      this.meals = (data.recipes || []).slice(0, 6); // Limit to 6 meals for the home page
      console.log(this.meals);
    });
    
  }
  

}


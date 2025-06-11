import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
    name: string;
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    constructor() {
        // Check if user is logged in on service initialization
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = localStorage.getItem('user');

        this.isLoggedInSubject.next(isLoggedIn);
        if (userData) {
            this.currentUserSubject.next(JSON.parse(userData));
        }
    }

    get isLoggedIn$(): Observable<boolean> {
        return this.isLoggedInSubject.asObservable();
    }

    get currentUser$(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }

    // Get current user data synchronously
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    // Get user data from localStorage
    getUserFromStorage(): User | null {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    login(email: string, password: string): boolean {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.email === email && user.password === password) {
                localStorage.setItem('isLoggedIn', 'true');
                this.isLoggedInSubject.next(true);
                this.currentUserSubject.next(user);
                return true;
            }
        }
        return false;
    }

    register(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(user);
    }

    logout(): void {
        localStorage.removeItem('isLoggedIn');
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return this.isLoggedInSubject.value;
    }
} 
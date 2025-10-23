import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  private selectedProduct: string = '';
  private selectedProductId: string = '';
  private productList: string[] = [];
  private fullProductList: any[] = [];
  private selectedWidgetList: string[] = [];
  private personaWidgetList: string[] = [];
  private isOnboardingCompleted: boolean = false;

  // Reactive subjects for widget lists
  private selectedWidgetListSubject = new BehaviorSubject<string[]>([]);
  selectedWidgetList$ = this.selectedWidgetListSubject.asObservable();
  
  private personaWidgetListSubject = new BehaviorSubject<string[]>([]);
  personaWidgetList$ = this.personaWidgetListSubject.asObservable();

  // Reactive subject for selected product
  private selectedProductSubject = new BehaviorSubject<string>('');
  selectedProduct$ = this.selectedProductSubject.asObservable();

  constructor() { }

  setSelectedProduct(selectedProduct: string) {
    this.selectedProduct = selectedProduct;
    this.selectedProductSubject.next(selectedProduct);
    // Find and set the corresponding product ID
    const product = this.fullProductList.find(p => p.name === selectedProduct);
    if (product) {
      this.selectedProductId = product.id;
    } else {
      console.warn('OnboardingService: Product not found in fullProductList:', selectedProduct, 'Available products:', this.fullProductList.map(p => p.name));
    }
  }

  getSelectedProduct(): string {
    return this.selectedProduct;
  }

  getSelectedProductId(): string {
    return this.selectedProductId;
  }

  setProductList(productList: string[]): void {
    this.productList = productList;
  }

  getProductList(): string[] {
    return this.productList;
  }

  setFullProductList(fullProductList: any[]): void {
    this.fullProductList = fullProductList;
  }

  getFullProductList(): any[] {
    return this.fullProductList;
  }

  setSelectedWidgetList(selectedWidgetList: string[]): void {
    this.selectedWidgetList = selectedWidgetList;
    this.selectedWidgetListSubject.next(selectedWidgetList);
  }

  getSelectedWidgetList(): string[] {
    return this.selectedWidgetList;
  }

  getSelectedWidgetList$(): Observable<string[]> {
    return this.selectedWidgetList$;
  }

  setPersonaWidgetList(personaWidgetList: string[]): void {
    this.personaWidgetList = personaWidgetList;
    this.personaWidgetListSubject.next(personaWidgetList);
  }

  getPersonaWidgetList(): string[] {
    return this.personaWidgetList;
  }

  getPersonaWidgetList$(): Observable<string[]> {
    return this.personaWidgetList$;
  }

  getSelectedProduct$(): Observable<string> {
    return this.selectedProduct$;
  }

  // Onboarding completion tracking
  setOnboardingCompleted(completed: boolean) {
    this.isOnboardingCompleted = completed;
  }

  getOnboardingCompleted(): boolean {
    return this.isOnboardingCompleted;
  }
}

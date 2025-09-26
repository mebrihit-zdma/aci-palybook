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

  // Reactive subjects for widget lists
  private selectedWidgetListSubject = new BehaviorSubject<string[]>([]);
  selectedWidgetList$ = this.selectedWidgetListSubject.asObservable();
  
  private personaWidgetListSubject = new BehaviorSubject<string[]>([]);
  personaWidgetList$ = this.personaWidgetListSubject.asObservable();

  constructor() { }

  setSelectedProduct(selectedProduct: string) {
    this.selectedProduct = selectedProduct;
    // Find and set the corresponding product ID
    const product = this.fullProductList.find(p => p.name === selectedProduct);
    if (product) {
      this.selectedProductId = product.id;
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
    console.log("OnboardingService: Setting persona widget list to:", personaWidgetList);
    this.personaWidgetList = personaWidgetList;
    this.personaWidgetListSubject.next(personaWidgetList);
  }

  getPersonaWidgetList(): string[] {
    return this.personaWidgetList;
  }

  getPersonaWidgetList$(): Observable<string[]> {
    return this.personaWidgetList$;
  }
}

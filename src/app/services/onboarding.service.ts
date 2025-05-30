import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor() { }

  private selectedProduct: string = '';
  private productList: string[] = [];
  private selectedWidgetList: string[] = [];
  private personaWidgetList: string[] = [];

  setSelectedProduct(selectedProduct: string) {
    this.selectedProduct = selectedProduct;
  }

  getSelectedProduct(): string {
    return this.selectedProduct;
  }

  setProductList(productList: string[]): void {
    this.productList = productList;
  }

  getProductList(): string[] {
    return this.productList;
  }

  setSelectedWidgetList(selectedWidgetList: string[]): void {
    this.selectedWidgetList = selectedWidgetList;
  }

  getSelectedWidgetList(): string[] {
    return this.selectedWidgetList;
  }

  setPersonaWidgetList(personaWidgetList: string[]): void {
    this.personaWidgetList = personaWidgetList;
  }

  getPersonaWidgetList(): string[] {
    return this.personaWidgetList;
  }
}

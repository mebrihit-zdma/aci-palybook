import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor() { }

  private selectedProduct: string = '';
  private selectedProductId: string = '';
  private productList: string[] = [];
  private fullProductList: any[] = [];
  private selectedWidgetList: string[] = [];
  private personaWidgetList: string[] = [];

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

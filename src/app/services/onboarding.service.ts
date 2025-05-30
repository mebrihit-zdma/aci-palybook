import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor() { }

  private selectedProduct: string = '';
  private productList: string[] = [];
  private selectedWidgetsList: string[] = [];

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

  setSelectedWidgetsList(selectedWidgetsList: string[]): void {
    this.selectedWidgetsList = selectedWidgetsList;
  }

  getSelectedWidgetsList(): string[] {
    return this.selectedWidgetsList;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor() { }

  private selectedProduct: string = '';

  setSelectedProduct(selectedProduct: string) {
    this.selectedProduct = selectedProduct;
  }

  getSelectedProduct(): string {
    return this.selectedProduct;
  }
}

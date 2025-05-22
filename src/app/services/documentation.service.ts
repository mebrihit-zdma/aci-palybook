import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {
  skipTooltipValue: boolean = false;

  documentationLandingPage = true;
  documentationGeneratingPage = false; 
  documentationGeneratedPage = false; 

  setDocumentationLandingPage(documentationLandingPage: boolean) {
    this.documentationLandingPage = documentationLandingPage ;
  }

  getDocumentationLandingPage():  boolean{
    return this.documentationLandingPage;
  }

  setDocumentationGeneratingPage(documentationGeneratingPage: boolean) {
    this.documentationGeneratingPage = documentationGeneratingPage ;
  }

  getDocumentationGeneratingPage():  boolean{
    return this.documentationGeneratingPage;
  }

  setDocumentationGeneratedPage(documentationGeneratedPage: boolean) {
    this.documentationGeneratedPage = documentationGeneratedPage ;
  }

  getDocumentationGeneratedPage():  boolean{
    return this.documentationGeneratedPage;
  }
}

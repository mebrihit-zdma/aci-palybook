import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  skipTooltipValue: boolean = false;

  setSkipTooltipValue(skipTooltipValue: boolean) {
    this.skipTooltipValue = skipTooltipValue ;
  }

  getSkipTooltipValue():  boolean{
    return this.skipTooltipValue;
  }
}

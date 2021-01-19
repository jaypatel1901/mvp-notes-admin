import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
  })
  export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        console.log("pipes",items,searchText)
      if(!items) return [];

      if(!searchText) return items;searchText = (searchText).toString().toLowerCase();
      return items.filter( it => {
        return it.email.toLowerCase().includes(searchText);
      });
     }
  }
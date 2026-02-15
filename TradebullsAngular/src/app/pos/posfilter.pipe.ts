import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'posfilter'
})
export class PosfilterPipe implements PipeTransform {

  transform(value: any[], searchTerm: string, columns: string[]): any[] {
    if (!value || !searchTerm) {
      return value;  // If no value or search term, return the original array
    }

    // Perform the filtering, case-insensitive
    return value.filter(item => {
      // Iterate over the columns to filter by
      return columns.some(column => 
        item[column]?.toLowerCase().includes(searchTerm.toLowerCase()) // Case-insensitive filtering
      );
    });
  }


}

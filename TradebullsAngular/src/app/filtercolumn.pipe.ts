import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtercolumn'
})
export class FiltercolumnPipe implements PipeTransform {

  transform(value: any[], searchTerm: string, columns: string[]): any[] {
    if (!value || !searchTerm) {
      return value;  // If no value or search term, return the original array
    }

    // Perform the filtering, case-insensitive
    return value.filter(item => {
      // Iterate over the columns to filter by
      return columns.some(column => 
        (item[column] && item[column]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.Data && item.Data[column] && String(item.Data[column]).toLowerCase().includes(searchTerm.toLowerCase()))
      ) // Case-insensitive filtering
      );
    });
  }

}

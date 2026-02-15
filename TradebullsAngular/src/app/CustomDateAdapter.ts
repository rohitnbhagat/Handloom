import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  // Override the format method to return the date in DD/MM/YYYY format
  override format(date: Date, displayFormat: object): string {
    const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Override the parse method to handle the DD/MM/YYYY format
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.includes('/')) {
      const [day, month, year] = value.split('/').map((str) => parseInt(str, 10));
      return new Date(year, month - 1, day); // Months are 0-based in JavaScript Date
    }
    return super.parse(value);
  }
}

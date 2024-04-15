import { Component,ElementRef,ViewChild } from '@angular/core';
import * as Papa from 'papaparse';
import { Router } from '@angular/router';


@Component({
  selector: 'app-renewal',
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.component.scss']
})
export class RenewalComponent {
  @ViewChild('fileInput') fileInput!: ElementRef ;

  constructor(private router: Router) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result: any) => {
       
          // Assuming CSV has header row, you can access data with result.data
          // Navigate to the next page and pass the CSV data
          sessionStorage.setItem('csvData',JSON.stringify(result.data))
          this.router.navigate(['/renewalList'], { state: { csvData: result.data } });
        },
        header: true // Set to true if CSV file has a header row
      });
    }
  }
  triggerFileInput(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }
  
}

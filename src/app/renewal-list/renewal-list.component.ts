import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-renewal-list',
  templateUrl: './renewal-list.component.html',
  styleUrls: ['./renewal-list.component.scss']
})
export class RenewalListComponent {
  csvData: any;
  tableData:any;
  selectedItems = new Set();
  schedule:boolean=true;
  pending:boolean=false;  
  status:string ='Pending'
  clickedRows = new Set<number>();

  constructor(
    private router: Router, private route: ActivatedRoute
    ){}


  ngOnInit(): void {
   this.csvData = sessionStorage.getItem('csvData')
   this.tableData = JSON.parse(this.csvData)
   console.log(this.tableData)
  }

  toggleSelection(checked:Event, item: any) {
    if (checked) {
      this.selectedItems.add(item);
    } else {
      this.selectedItems.delete(item);
    }
  }

  selectAll(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.tableData.forEach((item: any) => this.selectedItems.add(item));
    } else {
      this.selectedItems.clear();
    }


  }
  // callStatus(item: any) {
  //   if (item.schedule) {
  //     item.schedule = false;
  //     item.pending = true;
  //     item.status = 'Scheduled';
  //   } else if (item.pending) {
  //     item.schedule = true;
  //     item.pending = false;
  //     item.status = 'Pending';
  //   }
  // }

  isRowClicked(index: number): boolean {
    return this.clickedRows.has(index);
  }

  toggleRowClick(index: number): void {
    if (this.clickedRows.has(index)) {
      this.clickedRows.delete(index);
    } else {
      this.clickedRows.add(index);
    }
  }

  getStatus(index: number): string {
    this.status = 'Pending'
    return this.isRowClicked(index) ? 'Scheduled' : 'Pending';
  }
  
}



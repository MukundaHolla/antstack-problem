import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Papa } from "ngx-papaparse";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "antstack-problem";
  arrayBuffer: any;
  file: File;
  globalData: any;
  filteredData: any;
  orderDate: any;
  deliveryPincode: any;

  displayedColumns: string[] = [
    "orderId",
    "customerId",
    "deliveryPincode",
    "orderDate",
    "items"
  ];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private papa: Papa) {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  filterTable() {
    let data = this.globalData.filter(item => {
      if (
        item.orderDate.toString().includes(this.orderDate) ||
        item.deliveryPincode.toString().includes(this.deliveryPincode)
      ) {
        return true;
      }
    });
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  onDateChange(selectedDate) {
    let date = new Date(selectedDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1; //getMonth is zero based;
    let day = date.getDate();
    let formattedDate = day + "/" + month + "/" + year;
    this.orderDate = formattedDate.trim().toLowerCase();
    this.filterTable();
  }

  onDeliveryPinCodeChange(filterValue: string) {
    this.deliveryPincode = filterValue.trim().toLowerCase();
    this.filterTable();
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  upload() {
    this.papa.parse(this.file, {
      complete: result => {
        let data = result.data;
        let finalData = [];
        data.splice(1).map(item => {
          let obj = {};
          obj["orderId"] = item[0];
          obj["customerId"] = item[1];
          obj["deliveryPincode"] = item[2];
          obj["orderDate"] = item[3];
          obj["items"] = item[4].split(";");
          finalData.push(obj);
        });
        this.globalData = finalData;
        this.dataSource = new MatTableDataSource(finalData);
        this.dataSource.sort = this.sort;
      }
    });
  }
}

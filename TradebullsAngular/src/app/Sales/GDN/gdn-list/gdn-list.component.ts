import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, QueryList, OnDestroy, inject } from '@angular/core';
import { Validator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GDNService } from '../../../services/Sales/gdn.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { GdnAddComponent } from '../gdn-add/gdn-add.component';
import { GdnPrintComponent } from '../gdn-print/gdn-print.component';


import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as XLSX from 'xlsx';

import { ExhitionService } from '../../../services/Masters/exhition.service';
import { CreditTypeService } from '../../../services/Masters/creditType.service';
import { PartyService } from '../../../services/Masters/party.service';
import { SalesLocationService } from '../../../services/Masters/salesLocation.service';
import { BrandService } from '../../../services/Masters/brand.service';

@Component({
  selector: 'app-gdn-list',
  templateUrl: './gdn-list.component.html',
  styleUrl: './gdn-list.component.css'
})
export class GdnListComponent implements OnInit {

  displayedColumns = ['Actions', 'GDNID', 'GDNNo', 'GDNDate', 'PartyName', 'PONo', 'PODate', 'Status', 'TotalQty', 'TotalAmount', 'ModifiedByName', 'ModifiedDate'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("GDNAdd") GDNAdd?: GdnAddComponent;
  @ViewChild("GDNPrint") GDNPrint?: GdnPrintComponent;

  OrderList!: any[];
  isLoading: boolean = false;
  IsAddNew: boolean = false;
  IsPrint: boolean = false;

  VoucherNo: string = "";
  BrandID: number = 0;
  FromDate: Date | null = null;
  ToDate: Date | null = null;
  PartyID: number = 0;
  ConsigneeID: number = 0;
  AgentID: number = 0;
  SalesLocationID: number = 0;
  Priority: string = "";
  Status: string = "";
  ExhibitionID: number = 0;
  CreditTypeID: number = 0;

  lstBrands: any[] = [];
  lstPartys: any[] = [];
  lstConsignees: any[] = [];
  lstAgents: any[] = [];
  lstSalesLocations: any[] = [];
  lstPriority: any[] = [];
  lstExhibition: any[] = [];
  lstCreditType: any[] = [];
  lstStatus: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private gdnService: GDNService, private toastr: ToastrService, private el: ElementRef,
        private partyService: PartyService,
        private salesLocationService: SalesLocationService,
        private exhitionService: ExhitionService,
        private creditTypeService: CreditTypeService,
        private brandService: BrandService
  ) {
  }
  ngOnInit(): void {
    this.FillBrand();
    this.FillExhition();
    this.FillCreditType();
    this.FillParty();
    this.FillConsignee();
    this.FillAgent();
    this.FillPriority();
    this.FillSalesLocation();
    this.FillStatus();
  }

  ngAfterViewInit() {
    this.loadGDNs();
  }

  loadGDNs(isReload: boolean = false) {
    this.isLoading = true;
    const model:{
      GDNID: number,
      FromDate: Date | null,
      ToDate: Date | null,
      GDNNo: string,
      BrandID: number,
      PartyID: number,
      ConsigneeID: Number,
      AgentID: Number,
      SalesLocationID: Number,
      Priority: string,
      Status: string,
      ExhibitionID: Number,
      CreditTypeID: Number
    } = {
      GDNID: 0,
      FromDate: this.FromDate ?? null,
      ToDate: this.ToDate ?? null,
      GDNNo: this.VoucherNo ?? "",
      BrandID: this.BrandID ?? 0,
      PartyID: this.PartyID ?? 0,
      ConsigneeID: this.ConsigneeID ?? 0,
      AgentID: this.AgentID ?? 0,
      SalesLocationID: this.SalesLocationID ?? 0,
      Priority: this.Priority ?? "",
      Status: this.Status ?? "",
      ExhibitionID: this.ExhibitionID ?? 0,
      CreditTypeID: this.CreditTypeID ?? 0
    }
    this.gdnService.Get(model).then(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
        this.isLoading = false;
      }
      else {
        this.OrderList = d.data;
        this.dataSource = new MatTableDataSource(this.OrderList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }

    });
  }

  DeleteRow(item: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.OrderList = this.OrderList.filter(obj => obj.GDNID !== item.GDNID);

      this.gdnService.Delete(<number>item.GDNID).subscribe(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '');
        }
        else {
          this.toastr.success(item.GDNNo + ' successfully deleted', '', { enableHtml: true, closeButton: true });
          this.loadGDNs(true);
        }

      });
    }
  }

  formatDate(date?: Date): string {
    if (date) {
      const d = new Date(date);
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const seconds = d.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const day = ("0" + d.getDate()).slice(-2);
      const month = ("0" + (d.getMonth() + 1)).slice(-2); // getMonth() returns month from 0 to 11
      const year = d.getFullYear();
      const formattedHours = ("0" + (hours % 12)).slice(-2); // 12-hour format
      const formattedMinutes = ("0" + minutes).slice(-2);
      const formattedSeconds = ("0" + seconds).slice(-2);

      return `${day}-${month}-${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    } else {
      return "";
    }
  }
  ExportToExcel() {
    const todayDate = new Date();
    const FileName: string = "GDN_" + todayDate.getDate() + todayDate.getMonth() + todayDate.getFullYear() + todayDate.getHours() + todayDate.getMinutes() + todayDate.getSeconds() + ".xlsx";

    const filteredData = this.OrderList.map(item => ({
      'GDN ID': item.GDNID,
      'GDN No': item.GDNNo,
      'GDN Date': this.formatDate(item.GDNDate),
      'Currency': item.Currency,
      'Created via': item.Created_via,
      'Billing First Name': item.Billing_first_name,
      'Billing Last Name': item.Billing_last_name,
      'Billing Address 1': item.Billing_address_1,
      'Billing Address 2': item.Billing_address_2,
      'Billing City': item.Billing_city,
      'Billing State': item.Billing_state,
      'Billing Postcode': item.Billing_postcode,
      'Billing Country': item.Billing_country,
      'Billing Email': item.Billing_email,
      'Billing PhoneNo': item.Billing_phone,
      'Shipping First Name': item.Shipping_first_name,
      'Shipping Last Name': item.Shipping_last_name,
      'Shipping Address 1': item.Shipping_address_1,
      'Shipping Address 2': item.Shipping_address_2,
      'Shipping City': item.Shipping_city,
      'Shipping State': item.Shipping_state,
      'Shipping Postcode': item.Shipping_postcode,
      'Shipping Country': item.Shipping_country,
      'Shipping Phone': item.Shipping_phone,
      'Customer Note': item.Customer_Note,
      'Status': item.Status,
      'Payment Method': item.Payment_method,
      'Date Paid': this.formatDate(item.Date_Paid),
      'Completed Date': this.formatDate(item.Date_completed),
      'Gross Amount': item.GrossTotal,
      'Total Tax': item.TotalTax,
      'Total Amount': item.TotalAmount,
      'Modified By': item.ModifiedByName,
      'Modified Date': this.formatDate(item.ModifiedDate)
    }));

    // Convert the filtered data into a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData); //, { header: customHeaders });

    // Create a new workbook and append the worksheet to it
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the workbook to an Excel file
    XLSX.writeFile(wb, FileName);
  }

  OpenGDN(gdnid: number) {
    this.IsAddNew = true;
    this.GDNAdd?.OpenGDN(gdnid);
  }

  GDNBackEvent(){
    this.IsAddNew = false;
  }
  PrintRow(item: any) {
    this.IsPrint = true;
    this.GDNPrint?.OpenGDN(item.GDNID);
  }
  PrintClose_Click(){
    this.IsPrint = false;
  }

  FillBrand() {
    this.brandService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstBrands = a.map((brand) => ({
          value: brand.BrandID,
          label: brand.BrandName,
          data: brand,
        }));

        this.lstBrands.unshift({
          value: 0,
          label: "All",
          data: { BrandID: 0, BrandName: "All" },
        });

      }

    });
  }

  FillCreditType() {
    this.creditTypeService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstCreditType = a.map((brand) => ({
          value: brand.CreditTypeID,
          label: brand.CreditTypeName,
          data: brand,
        }));

        this.lstCreditType.unshift({
          value: 0,
          label: "All",
          data: { CreditTypeID: 0, CreditTypeName: "All" },
        });

      }

    });
  }

  FillExhition() {
    this.exhitionService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstExhibition = a.map((brand) => ({
          value: brand.ExhitionID,
          label: brand.ExhitionName,
          data: brand,
        }));

        this.lstExhibition.unshift({
          value: 0,
          label: "All",
          data: { ExhitionID: 0, ExhitionName: "All" },
        });

      }

    });
  }
  FillParty() {
    this.partyService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstPartys = a.filter(t => t.PartyTypeID == 1).map((party) => ({
          value: party.PartyID,
          label: party.PartyName,
          data: party,
        }));

        this.lstPartys.unshift({
          value: 0,
          label: "All",
          data: { PartyID: 0, PartyName: "All" },
        });

      }

    });
  }

  FillConsignee() {
    this.partyService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstConsignees = a.filter(t => t.PartyTypeID == 2 || t.PartyTypeID == 1).map((party) => ({
          value: party.PartyID,
          label: party.PartyName,
          data: party,
        }));

        this.lstConsignees.unshift({
          value: 0,
          label: "All",
          data: { PartyID: 0, PartyName: "All" },
        });

      }

    });
  }

  FillAgent() {
    this.partyService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstAgents = a.filter(t => t.PartyTypeID == 5).map((party) => ({
          value: party.PartyID,
          label: party.PartyName,
          data: party,
        }));

        this.lstAgents.unshift({
          value: 0,
          label: "All",
          data: { PartyID: 0, PartyName: "All" },
        });

      }

    });
  }

  FillPriority() {
    this.lstPriority = [];
    this.lstPriority.push({
      value: "",
      label: "All",
      data: { ID: "", Name: "All" },
    });
    this.lstPriority.push({
      value: "Low",
      label: "Low",
      data: { ID: "Low", Name: "Low" },
    });
    this.lstPriority.push({
      value: "Medium",
      label: "Medium",
      data: { ID: "Medium", Name: "Medium" },
    });
    this.lstPriority.push({
      value: "High",
      label: "High",
      data: { ID: "High", Name: "High" },
    });

  }
  FillSalesLocation() {
    this.salesLocationService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstSalesLocations = a.map((SL) => ({
          value: SL.SalesLocationID,
          label: SL.SalesLocationName,
          data: SL,
        }));

        this.lstSalesLocations.unshift({
          value: 0,
          label: "All",
          data: { SalesLocationID: 0, SalesLocationName: "All" },
        });

      }

    });
  }

  FillStatus() {
    this.lstStatus = [];
    this.lstStatus.push({
      value: "", 
      label: "All",
      data: { ID: "", Name: "All" },
    });
    this.lstStatus.push({
      value: "pending", 
      label: "Pending payment",
      data: { ID: "pending", Name: "Pending payment" },
    });
    this.lstStatus.push({
      value: "processing",
      label: "Processing",
      data: { ID: "processing", Name: "Processing" },
    });
    this.lstStatus.push({
      value: "on-hold",
      label: "On hold",
      data: { ID: "on-hold", Name: "On hold" },
    });
    this.lstStatus.push({
      value: "completed",
      label: "Completed",
      data: { ID: "completed", Name: "Completed" },
    });
    this.lstStatus.push({
      value: "cancelled",
      label: "Cancelled",
      data: { ID: "cancelled", Name: "Cancelled" },
    });
    this.lstStatus.push({
      value: "refunded",
      label: "Refunded",
      data: { ID: "refunded", Name: "Refunded" },
    });
    this.lstStatus.push({
      value: "failed",
      label: "Failed",
      data: { ID: "failed", Name: "Failed" },
    });
    this.lstStatus.push({
      value: "partial-shipped",
      label: "Partially Shipped",
      data: { ID: "partial-shipped", Name: "Partially Shipped" },
    });
    this.lstStatus.push({
      value: "checkout-draft",
      label: "Draft",
      data: { ID: "checkout-draft", Name: "Draft" },
    });
  }
}


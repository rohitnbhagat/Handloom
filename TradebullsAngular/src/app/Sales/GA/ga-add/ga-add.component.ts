import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Select2Data, Select2DataOption, Select2Option } from '../../../Models/select2';
import { PartyService } from '../../../services/Masters/party.service';
import { BrandService } from '../../../services/Masters/brand.service';
import { ComponentService } from '../../../services/Masters/component.service';
import { ProductService } from '../../../services/Masters/product.service';
import { GA_AddModel, GA_Item_AddModel, GA_WorkOrderPlanning_ViewModel, GA_WorkOrderPlanning_Item_ViewModel } from '../../../Models/Sales/GAModel';
import { GaService } from '../../../services/Sales/ga.service';
import { UserService } from '../../../services/user.service';
import { MatSelectChange } from '@angular/material/select';
import { Editor, Toolbar } from 'ngx-editor';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { ProcessService } from '../../../services/Masters/process.service';

@Component({
  selector: 'app-ga-add',
  templateUrl: './ga-add.component.html',
  styleUrl: './ga-add.component.css'
})
export class GaAddComponent implements OnInit, AfterViewInit, OnDestroy {

  IsPicVisible: boolean = true;
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  IsDropdownEventCall: boolean = true;
  IsAddNew: boolean = false;
  GAID: number = 0;
  GANo: string = "";
  GADate: Date | null = new Date();
  BrandID: number = 0;
  Remarks: string = "";
  TotalQty: number = 0;
  IsLocked: boolean = false;
  ProductDetails: GA_Item_AddModel[] = [];
  lstBrands: any[] = [];

  @Output() BackEvent = new EventEmitter<void>();
  
  lstProcesses: any[] = [];
  
  lstUsers: any[] = [];
  lstSelectedWorkOrder: { WOPlanningID: number, WONo: string, WODate: Date }[] = [];
  lstSelectedWorkOrderDetails: { Select: boolean, Data: GA_WorkOrderPlanning_Item_ViewModel }[] = [];
  IsOpenSaveOrder: boolean = false;
  IsOpenSaveOrderItem: boolean = false;
  lstWorkOrder: any[] = [];
  strSOProductFilter: string = "";
  strSOFilter: string = "";
  lstComponents: { ComponentID: number, ComponentName: string }[] = [];
  lstSelectedComponents: { ComponentID: number, ComponentName: string }[] = [];

  constructor(private toastr: ToastrService,
    private brandService: BrandService,
    private gaService: GaService,
    private productService: ProductService,
    private userService: UserService,
    private componentService: ComponentService,
    private processService: ProcessService,
    private partyService: PartyService
  ) {

  }
  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.editor = new Editor();
    this.FillBrand();
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
          label: "Please Select",
          data: { BrandID: 0, BrandName: "Please Select" },
        });

      }

    });
  }

  GetHeaderText() {
    let s = "Create Goods Assembly";
    if (this.GAID > 0 && this.IsLocked)
      s = "View GA";
    else if (this.GAID > 0)
      s = "Edit Goods Assembly";
    return s;;
  }


  async OpenGA(OrderID: number) {
    this.IsAddNew = true;
    this.GAID = OrderID;
    if (OrderID > 0) {
      const model: {
        GAID: number,
        FromDate: Date | null,
        ToDate: Date | null,
        GANo: string
      } = {
        GAID: this.GAID,
        FromDate: null,
        ToDate: null,
        GANo: ""
      }

      await this.gaService.Get(model).then(
        (response: any) => {

          if (!response.success) {
            this.toastr.error(response.message, '', {
              enableHtml: true,
              closeButton: true
            });
          }
          else {
            const order = response.data[0];
            if (order) {
              this.GANo = order.GANo;
              this.GADate = order.GADate ? new Date(order.GADate) : null;
              this.BrandID = order.BrandID;
              this.Remarks = order.Remarks;
              this.TotalQty = order.TotalQty;
              this.IsLocked = order.IsLocked;
              this.ProductDetails = [];

              this.gaService.GetOrderDetails(this.GAID).then(
                (responseDetail: any) => {
                  if (!responseDetail.success) {
                    this.toastr.error(responseDetail.message, '', {
                      enableHtml: true,
                      closeButton: true
                    });
                  }
                  else {
                    this.ProductDetails = responseDetail.data.map(
                      (t: any) => (
                        {
                          ID: t.ID,
                          WOPlanningItemID: t.WOPlanningItemID,
                          WONo: t.WONo,
                          ProcessInNo: t.ProcessInNo,
                          SrNo: t.SrNo,
                          ParentProductID: t.ParentProductID,
                          ProductID: t.ProductID,
                          sku: t.sku,
                          ProductName: t.ProductName,
                          Qty: t.Qty,
                          Remarks: t.Remarks,
                          Photo: t.Photo
                        }
                      )
                    );
                  }
                }
              );

            }
          }

        });
    }
    else {
      this.ClearForm();
    }
  }

  BackClick() {
    if (confirm('Are you sure you want to go back?')) {
      this.IsAddNew = false;
      this.BackEvent.emit();
    }
  }

  DeleteProduct(product: any) {
    this.ProductDetails = this.ProductDetails.filter(t => t.SrNo != product.SrNo);
    this.ProductDetails.forEach((product, index) => { product.SrNo = index + 1 });
    this.CalculateAmount();
  }

  SaveOrderClick() {
    if (!this.FormValidate())
      return;

    const Items: GA_Item_AddModel[] = this.ProductDetails.map(p => ({
      ID: p.ID,
      WOPlanningItemID: p.WOPlanningItemID,
      WONo: p.WONo,
      SrNo: p.SrNo,
      ParentProductID: p.ParentProductID,
      ProductID: p.ProductID,
      sku: p.sku,
      ProductName: p.ProductName,
      Qty: p.Qty,
      Remarks: p.Remarks,
      Photo: p.Photo
    }));
    this.CalculateAmount();


    let model: GA_AddModel = {
      GAID: this.GAID ?? 0,
      GANo: this.GANo ?? "",
      GADate: this.GADate ? this.GADate : new Date(),
      BrandID: this.BrandID ?? 0,
      Remarks: this.Remarks ?? "",
      TotalQty: this.TotalQty ?? 0,
      Items: Items
    };

    this.gaService.Create(model).subscribe(
      data => {
        console.log(data);
        let d: any = data;
        if (!d.success) {
          this.toastr.error(d.message, '', { enableHtml: true, closeButton: true });
        }
        else {
          this.toastr.success(d.message, '', { enableHtml: true, closeButton: true });
          this.ClearForm();
        }
      },
      error => {
        console.log(error);
        this.toastr.error(error.error.message, '');
      }
    );


  }

  ClearForm() {

    this.GAID = 0;
    this.GANo = "";
    this.GADate = new Date();
    this.BrandID = 0;
    this.Remarks = "";
    this.ProductDetails = [];
    this.TotalQty = 0;
    this.IsLocked = false;

    this.isSOAllSelected = false;
    this.lstSelectedWorkOrder = [];
    this.lstSelectedWorkOrderDetails = [];
    this.lstWorkOrder = [];
  }

  onSelectionChange(event: MatSelectChange): void {

  }

  CalculateAmount() {
    const qty = this.ProductDetails.reduce((sum, element) => sum + (element.Qty??0), 0);
    this.TotalQty = Number(qty.toFixed(2));
  }

  FormValidate(): boolean {
    let result: boolean = true;
    let msg: string = "";
    if (!this.GADate) {
      result = false;
      msg += "Please select goods assembly date." + "<br/>"
    }
    if (!this.ProductDetails || this.ProductDetails.length == 0) {
      result = false;
      msg += "Please enter product details." + "<br/>"
    }
    if (!this.ProductDetails || this.ProductDetails.length == 0) {
      result = false;
      msg += "Please enter product details." + "<br/>"
    }

    if (!result) {
      this.toastr.error(msg, '', {
        enableHtml: true,
        closeButton: true
      });
    }

    return result;
  }

  OpenWorkOrder() {
    if (this.lstSelectedWorkOrderDetails && this.lstSelectedWorkOrderDetails.length > 0) {
      this.IsOpenSaveOrderItem = true;
      return;
    }

      this.gaService.GetPendingWorkOrders().then(
        (response: any) => {

          if (!response.success) {
            this.toastr.error(response.message, '', {
              enableHtml: true,
              closeButton: true
            });
          }
          else {
            this.lstWorkOrder = response.data.map((row: any) => (
              {
                Select: (this.lstSelectedWorkOrder && this.lstSelectedWorkOrder.findIndex((o) => o.WOPlanningID == row.WOPlanningID) >= 0),
                Order: row
              }
            ));
            this.IsOpenSaveOrder = true;
          }

        });
  }
  
  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2); // Adds leading zero if necessary
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adds leading zero if necessary
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  isSOAllSelected: boolean = false;
  toggleSalesOrderSelectAll() {
    this.lstWorkOrder.forEach(order => order.Select = this.isSOAllSelected);
  }
  checkSalesOrderSelectAllStatus() {
    this.isSOAllSelected = this.lstWorkOrder.every(order => order.Select);
  }
  isAllSelected: boolean = false;
  IsPicVisibleInSalesOrderItem: boolean = false;
  toggleSalesOrderItemSelectAll() {
    if (!this.strSOProductFilter) {
      this.lstSelectedWorkOrderDetails.forEach(order => order.Select = this.isAllSelected);
    }
    this.lstSelectedWorkOrderDetails.filter(order => order.Data.ProductName?.toLowerCase().includes(this.strSOProductFilter.toLowerCase())).forEach(order => order.Select = this.isAllSelected);
  }
  checkSalesOrderItemSelectAllStatus() {
    this.isAllSelected = this.lstSelectedWorkOrderDetails.every(order => order.Select);
  }
  CloseSalesorderModel() {
    this.IsOpenSaveOrder = false;
    this.IsOpenSaveOrderItem = false;
  }
  CloseSalesorderItemModel() {
    if (this.GAID > 0) {
      this.IsOpenSaveOrder = false;
      this.IsOpenSaveOrderItem = false;
    }
    else {
      this.IsOpenSaveOrder = true;
      this.IsOpenSaveOrderItem = false;
    }
  }
  SubmitSalesorderModel() {
    if (this.lstWorkOrder) {
      const lst = this.lstWorkOrder.filter(t => t.Select == true);
      if (lst && lst.length > 0) {
        this.lstSelectedWorkOrder = lst.map((data: any) => (
          {
            WOPlanningID: data.Order.WOPlanningID,
            WONo: data.Order.WONo,
            WODate: data.Order.WODate
          }
        ));
        const WorkOrderIDs: string = this.lstSelectedWorkOrder.map(order => order.WOPlanningID).join(',');

        this.gaService.GetPendingWorkOrderDetails(WorkOrderIDs, this.GAID).then(
          (response: any) => {
            if (!response.success) {
              this.toastr.error("Error while getting Work Order Details.", '', {
                enableHtml: true,
                closeButton: true
              });
            }
            else {
              this.lstSelectedWorkOrderDetails = response.data.map(
                (t: any) => (
                  {
                    Select: (this.ProductDetails && this.ProductDetails.findIndex((p) => p.WOPlanningItemID == t.WOPlanningItemID) >= 0),
                    Data: {
                      WOPlanningItemID: t.WOPlanningItemID,
                      WOPlanningID: t.WOPlanningID,
                      WONo: t.WONo,
                      SrNo: t.SrNo,
                      ParentProductID: t.ParentProductID,
                      ProductID: t.ProductID,
                      sku: t.sku,
                      ProductName: t.ProductName,
                      Qty: t.Qty,
                      UsedQty: t.UsedQty,
                      Remarks: t.Remarks,
                      Photo: t.Photo
                    }
                  }
                )
              );


            }
          }
        ).finally(() => {
          this.CloseSalesorderModel();
          this.checkSalesOrderItemSelectAllStatus();
          this.IsOpenSaveOrderItem = true;
        });

      }
      else {
        this.toastr.error("Please select work order.", '', {
          enableHtml: true,
          closeButton: true
        });
      }
    }
  }
  filteredSalesOrders() {
    if (!this.strSOFilter) {
      return this.lstWorkOrder; // If no filter is applied, return all orders
    }

    // Apply filter to SalesOrderNo and SalesOrderDate
    return this.lstWorkOrder.filter(order => order.Order.WONo?.toLowerCase().includes(this.strSOFilter.toLowerCase())
      || order.Order.WODate?.toLocaleString().includes(this.strSOFilter.toLowerCase())
      );
  }

  SubmitSalesorderItemModel() {
    if (this.lstSelectedWorkOrderDetails) {
      const lst = this.lstSelectedWorkOrderDetails.filter(t => t.Select == true);
      const str: string[] = [];
      if (lst && lst.length > 0) {
        lst.forEach(item => {
          if (item.Data.UsedQty > item.Data.Qty) {
            str.push("Used Qty cannot be grater then Qty for " + item.Data.ProductName);
          }
          if (item.Data.UsedQty < 0) {
            str.push("Used Qty cannot be less then 0 for " + item.Data.ProductName);
          }

        });

        if (str.length > 0) {
          this.toastr.error(str.join("<br/>"), '', {
            enableHtml: true,
            closeButton: true
          });
          return;
        }


        this.ProductDetails = [];
        let srNo = 1;
        this.lstSelectedWorkOrderDetails.filter(t => t.Select == true).forEach(item => {
              let p: GA_Item_AddModel =
              {
                ID: 0,
                WOPlanningItemID: item.Data.WOPlanningItemID,
                WONo: item.Data.WONo || "",
                SrNo: srNo,
                ParentProductID: item.Data.ParentProductID,
                ProductID: item.Data.ProductID,
                sku: item.Data.sku,
                ProductName: item.Data.ProductName,
                Qty: item.Data.UsedQty,
                Remarks: item.Data.Remarks,
                Photo: item.Data.Photo??""
              }
              srNo++;
              this.ProductDetails.push(p);
        });
        this.CalculateAmount();
        this.IsOpenSaveOrder = false;
        this.IsOpenSaveOrderItem = false;
      }
      else {
        this.toastr.error("Please select work order items.", '', {
          enableHtml: true,
          closeButton: true
        });
      }
    }
  }


}

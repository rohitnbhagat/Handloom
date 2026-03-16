import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Select2Data, Select2DataOption, Select2Option } from '../../../Models/select2';
import { ComponentService } from '../../../services/Masters/component.service';
import { FG_AddModel, FG_Item_AddModel, FG_ProcessIn_ViewModel, FG_ProcessIn_Item_ViewModel } from '../../../Models/Sales/FGModel';
import { FgService } from '../../../services/Sales/fg.service';
import { UserService } from '../../../services/user.service';
import { MatSelectChange } from '@angular/material/select';
import { Editor, Toolbar } from 'ngx-editor';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { ProcessService } from '../../../services/Masters/process.service';


@Component({
  selector: 'app-fg-add',
  templateUrl: './fg-add.component.html',
  styleUrl: './fg-add.component.css'
})
export class FgAddComponent implements OnInit, AfterViewInit, OnDestroy {

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
  FGID: number = 0;
  FGNo: string = "";
  FGDate: Date | null = new Date();
  Remarks: string = "";
  TotalQty: number = 0;
  IsLocked: boolean = false;
  ProductDetails: FG_Item_AddModel[] = [];

  @Output() BackEvent = new EventEmitter<void>();
  
  lstProcesses: any[] = [];

  lstUsers: any[] = [];
  lstSelectedProcessIn: { ProcessInID: number, ProcessInNo: string, ProcessInDate: Date }[] = [];
  lstSelectedProcessInDetails: { Select: boolean, Data: FG_ProcessIn_Item_ViewModel }[] = [];
  IsOpenSaveOrder: boolean = false;
  IsOpenSaveOrderItem: boolean = false;
  lstProcessIn: any[] = [];
  strSOProductFilter: string = "";
  strSOFilter: string = "";

  constructor(private toastr: ToastrService,
    private fgService: FgService,
    private userService: UserService,
    private componentService: ComponentService,
    private processService: ProcessService
  ) {

  }
  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.editor = new Editor();
    this.BindProcesses();
  }

  GetHeaderText() {
    let s = "Create Finished Goods";
    if (this.FGID > 0 && this.IsLocked)
      s = "View Finished Goods";
    else if (this.FGID > 0)
      s = "Edit Finished Goods";
    return s;;
  }

  BindProcesses() {
      this.processService.Get(0).subscribe(users => {
  
        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '', {
            enableHtml: true,
            closeButton: true
          });
        }
        else {
          this.lstProcesses = d.data.map((process:any) => ({
            ProcessID: process.ProcessID,
            ProcessName: process.ProcessName
          }));
          this.lstProcesses.unshift({
          ProcessID: 0,
          ProcessName: "Please Select"
        });

        }
  
      });
    }

  async OpenFG(OrderID: number) {
    this.IsAddNew = true;
    this.FGID = OrderID;
    if (OrderID > 0) {
      const model: {
        FGID: number,
        FromDate: Date | null,
        ToDate: Date | null,
        FGNo: string
      } = {
        FGID: this.FGID,
        FromDate: null,
        ToDate: null,
        FGNo: ""
      }

      await this.fgService.Get(model).then(
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
              this.FGNo = order.FGNo;
              this.FGDate = order.FGDate ? new Date(order.FGDate) : null;
              this.Remarks = order.Remarks;
              this.TotalQty = order.TotalQty;
              this.IsLocked = order.IsLocked;
              this.ProductDetails = [];

              this.fgService.GetOrderDetails(this.FGID).then(
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
                          WOPlanningItemComponentID: t.WOPlanningItemComponentID,
                          ProcessInItemID: t.ProcessInItemID,
                          WONo: t.WONo,
                          ProcessInNo: t.ProcessInNo,
                          SrNo: t.SrNo,
                          ParentProductID: t.ParentProductID,
                          ProductID: t.ProductID,
                          sku: t.sku,
                          ProductName: t.ProductName,
                          ComponentID: t.ComponentID,
                          ComponentName: t.ComponentName,
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

    const Items: FG_Item_AddModel[] = this.ProductDetails.map(p => ({
      ID: p.ID,
      WOPlanningItemComponentID: p.WOPlanningItemComponentID,
      ProcessInItemID: p.ProcessInItemID,
      WONo: p.WONo,
      ProcessInNo: p.ProcessInNo,
      SrNo: p.SrNo,
      ParentProductID: p.ParentProductID,
      ProductID: p.ProductID,
      sku: p.sku,
      ProductName: p.ProductName,
      ComponentID: p.ComponentID,
      ComponentName: p.ComponentName,
      Qty: p.Qty,
      Remarks: p.Remarks,
      Photo: p.Photo
    }));
    this.CalculateAmount();


    let model: FG_AddModel = {
      FGID: this.FGID ?? 0,
      FGNo: this.FGNo ?? "",
      FGDate: this.FGDate ? this.FGDate : new Date(),
      Remarks: this.Remarks ?? "",
      TotalQty: this.TotalQty ?? 0,
      Items: Items
    };

    this.fgService.Create(model).subscribe(
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

    this.FGID = 0;
    this.FGNo = "";
    this.FGDate = new Date();
    this.Remarks = "";
    this.ProductDetails = [];
    this.TotalQty = 0;
    this.IsLocked = false;

    this.isPOAllSelected = false;
    this.lstSelectedProcessIn = [];
    this.lstSelectedProcessInDetails = [];
    this.lstProcessIn = [];
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
    if (!this.FGDate) {
      result = false;
      msg += "Please select FG date." + "<br/>"
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

  OpenProcessIn() {
    if (this.lstSelectedProcessInDetails && this.lstSelectedProcessInDetails.length > 0) {
      this.IsOpenSaveOrderItem = true;
      return;
    }

      this.fgService.GetPendingProcessIns().then(
        (response: any) => {

          if (!response.success) {
            this.toastr.error(response.message, '', {
              enableHtml: true,
              closeButton: true
            });
          }
          else {
            this.lstProcessIn = response.data.map((row: any) => (
              {
                Select: (this.lstSelectedProcessIn && this.lstSelectedProcessIn.findIndex((o) => o.ProcessInID == row.ProcessInID) >= 0),
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

  isPOAllSelected: boolean = false;
  toggleProcessInSelectAll() {
    this.lstProcessIn.forEach(order => order.Select = this.isPOAllSelected);
  }
  checkProcessInSelectAllStatus() {
    this.isPOAllSelected = this.lstProcessIn.every(order => order.Select);
  }
  isAllSelected: boolean = false;
  IsPicVisibleInProcessInItem: boolean = false;
  toggleProcessInItemSelectAll() {
    if (!this.strSOProductFilter) {
      this.lstSelectedProcessInDetails.forEach(order => order.Select = this.isAllSelected);
    }
    this.lstSelectedProcessInDetails.filter(order => order.Data.ProductName?.toLowerCase().includes(this.strSOProductFilter.toLowerCase())).forEach(order => order.Select = this.isAllSelected);
  }
  checkProcessInItemSelectAllStatus() {
    this.isAllSelected = this.lstSelectedProcessInDetails.every(order => order.Select);
  }
  CloseProcessInModel() {
    this.IsOpenSaveOrder = false;
    this.IsOpenSaveOrderItem = false;
  }
  CloseProcessInItemModel() {
    if (this.FGID > 0) {
      this.IsOpenSaveOrder = false;
      this.IsOpenSaveOrderItem = false;
    }
    else {
      this.IsOpenSaveOrder = true;
      this.IsOpenSaveOrderItem = false;
    }
  }
  SubmitProcessInModel() {
    if (this.lstProcessIn) {
      const lst = this.lstProcessIn.filter(t => t.Select == true);
      if (lst && lst.length > 0) {
        this.lstSelectedProcessIn = lst.map((data: any) => (
          {
            ProcessInID: data.Order.ProcessInID,
            ProcessInNo: data.Order.ProcessInNo,
            ProcessInDate: data.Order.ProcessInDate
          }
        ));
        const ProcessInIDs: string = this.lstSelectedProcessIn.map(order => order.ProcessInID).join(',');

        this.fgService.GetPendingProcessInDetails(ProcessInIDs, this.FGID).then(
          (response: any) => {
            if (!response.success) {
              this.toastr.error("Error while getting Process In Details.", '', {
                enableHtml: true,
                closeButton: true
              });
            }
            else {
              this.lstSelectedProcessInDetails = response.data.map(
                (t: any) => (
                  {
                    Select: (this.ProductDetails && this.ProductDetails.findIndex((p) => p.WOPlanningItemComponentID == t.WOPlanningItemComponentID && p.ProcessInItemID == t.ProcessInItemID) >= 0),
                    Data: {
                      WOPlanningItemComponentID: t.WOPlanningItemComponentID,
                      WOPlanningItemID: t.WOPlanningItemID,
                      WOPlanningID: t.WOPlanningID,
                      WONo: t.WONo,
                      ProcessInItemID: t.ProcessInItemID,
                      ProcessInID: t.ProcessInID,
                      ProcessInNo: t.ProcessInNo,
                      SrNo: t.SrNo,
                      ParentProductID: t.ParentProductID,
                      ProductID: t.ProductID,
                      sku: t.sku,
                      ProductName: t.ProductName,
                      ComponentID: t.ComponentID,
                      ComponentName: t.ComponentName,
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
          this.CloseProcessInModel();
          this.checkProcessInItemSelectAllStatus();
          this.IsOpenSaveOrderItem = true;
        });

      }
      else {
        this.toastr.error("Please select process in.", '', {
          enableHtml: true,
          closeButton: true
        });
      }
    }
  }
  filteredProcessIns() {
    if (!this.strSOFilter) {
      return this.lstProcessIn; // If no filter is applied, return all orders
    }

    // Apply filter to SalesOrderNo and SalesOrderDate
    return this.lstProcessIn.filter(order => order.Order.WONo?.toLowerCase().includes(this.strSOFilter.toLowerCase())
      || order.Order.ProcessInDate?.toLocaleString().includes(this.strSOFilter.toLowerCase())
      );
  }

  SubmitProcessInItemModel() {
    if (this.lstSelectedProcessInDetails) {
      const lst = this.lstSelectedProcessInDetails.filter(t => t.Select == true);
      if (lst && lst.length > 0) {
          
        const str: string[] = [];
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
        this.lstSelectedProcessInDetails.filter(t => t.Select == true).forEach(item => {
              let p: FG_Item_AddModel =
              {
                ID: 0,
                WOPlanningItemComponentID: item.Data.WOPlanningItemComponentID,
                ProcessInItemID: item.Data.ProcessInItemID,
                WONo: item.Data.WONo || "",
                ProcessInNo: item.Data.ProcessInNo || "",
                SrNo: srNo,
                ParentProductID: item.Data.ParentProductID,
                ProductID: item.Data.ProductID,
                sku: item.Data.sku,
                ProductName: item.Data.ProductName,
                ComponentID: item.Data.ComponentID, 
                ComponentName: item.Data.ComponentName,
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
        this.toastr.error("Please select process in items.", '', {
          enableHtml: true,
          closeButton: true
        });
      }
    }
  }


}


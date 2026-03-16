import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Select2Data, Select2DataOption, Select2Option } from '../../../Models/select2';
import { PartyService } from '../../../services/Masters/party.service';
import { ComponentService } from '../../../services/Masters/component.service';
import { ProductService } from '../../../services/Masters/product.service';
import { ProcessOut_AddModel, ProcessOut_Item_AddModel, ProcessOut_WorkOrderPlanning_ViewModel, ProcessOut_WorkOrderPlanning_Item_ViewModel } from '../../../Models/Sales/ProcessOutModel';
import { ProcessoutService } from '../../../services/Sales/processout.service';
import { UserService } from '../../../services/user.service';
import { MatSelectChange } from '@angular/material/select';
import { Editor, Toolbar } from 'ngx-editor';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { ProcessService } from '../../../services/Masters/process.service';

@Component({
  selector: 'app-process-out-add',
  templateUrl: './process-out-add.component.html',
  styleUrl: './process-out-add.component.css'
})
export class ProcessOutAddComponent implements OnInit, AfterViewInit, OnDestroy {

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
  ProcessOutID: number = 0;
  ProcessOutNo: string = "";
  ProcessOutDate: Date | null = new Date();
  ProcessOutType: string = "Workorder Planning";
  ProcessID: number = 0;
  PartyID: number = 0;
  IssueType: string = "";
  WorkType: string = "";
  StartDate: Date | null = new Date();
  EndDate: Date | null = new Date();
  DueDays: number | null = null;
  Remarks: string = "";
  TotalQty: number = 0;
  IsLocked: boolean = false;
  ProductDetails: ProcessOut_Item_AddModel[] = [];

  @Output() BackEvent = new EventEmitter<void>();
  
  lstProcesses: any[] = [];
  lstPartys: any[] = [];
  lstIssueType: any[] = [{ IssueTypeID: "", IssueType: "Please Select"}, { IssueTypeID: "Fresh", IssueType: "Fresh"}, { IssueTypeID: "Repair", IssueType: "Repair"}, { IssueTypeID: "Damage", IssueType: "Damage"}];
  lstWorkType: any[] = [{ WorkTypeID: "", WorkType: "Please Select"}, { WorkTypeID: "Jobwork", WorkType: "Jobwork"}, { WorkTypeID: "In-House", WorkType: "In-House"}];

  lstUsers: any[] = [];
  lstSelectedWorkOrder: { WOPlanningID: number, WONo: string, WODate: Date }[] = [];
  lstSelectedWorkOrderDetails: { Select: boolean, Data: ProcessOut_WorkOrderPlanning_Item_ViewModel }[] = [];
  IsOpenSaveOrder: boolean = false;
  IsOpenSaveOrderItem: boolean = false;
  lstWorkOrder: any[] = [];
  strSOProductFilter: string = "";
  strSOFilter: string = "";
  lstComponents: { ComponentID: number, ComponentName: string }[] = [];
  lstSelectedComponents: { ComponentID: number, ComponentName: string }[] = [];

  constructor(private toastr: ToastrService,
    private processoutService: ProcessoutService,
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
    this.BindProcesses();
    this.FillComponent();
    this.FillParty();
  }

  GetHeaderText() {
    let s = "Create Process Out";
    if (this.ProcessOutID > 0 && this.IsLocked)
      s = "View Process Out";
    else if (this.ProcessOutID > 0)
      s = "Edit Process Out";
    return s;;
  }

  FillComponent() {
    this.componentService.Get(0).subscribe(users => {
      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.lstComponents = d.data.map((component: any) => ({ ComponentID: component.ComponentID, ComponentName: component.ComponentName }));
      }

    });
  }
  compareComponents(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.ComponentID === c2.ComponentID : c1 === c2;
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
          this.lstPartys.unshift({
          ProcessID: 0,
          ProcessName: "Please Select"
        });

        }
  
      });
    }

  async OpenProcessOut(OrderID: number) {
    this.IsAddNew = true;
    this.ProcessOutID = OrderID;
    if (OrderID > 0) {
      const model: {
        ProcessOutID: number,
        FromDate: Date | null,
        ToDate: Date | null,
        ProcessOutNo: string
      } = {
        ProcessOutID: this.ProcessOutID,
        FromDate: null,
        ToDate: null,
        ProcessOutNo: ""
      }

      await this.processoutService.Get(model).then(
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
              this.ProcessOutNo = order.ProcessOutNo;
              this.ProcessOutDate = order.ProcessOutDate ? new Date(order.ProcessOutDate) : null;
              this.ProcessOutType = order.ProcessOutType;
              this.ProcessID = order.ProcessID;
              this.PartyID = order.PartyID;
              this.IssueType = order.IssueType;
              this.WorkType = order.WorkType;
              this.StartDate = order.StartDate ? new Date(order.StartDate) : null;
              this.EndDate = order.EndDate ? new Date(order.EndDate) : null;
              this.DueDays = order.DueDays;
              this.Remarks = order.Remarks;
              this.TotalQty = order.TotalQty;
              this.IsLocked = order.IsLocked;
              this.ProductDetails = [];

              this.processoutService.GetOrderDetails(this.ProcessOutID).then(
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
                    // if (responseDetail.SelectedSO && responseDetail.SelectedSO.length > 0) {
                    //   this.lstSelectedSalesOrder = responseDetail.SelectedSO.map((data: any) => (
                    //     {
                    //       SalesOrderID: data.SalesOrderID,
                    //       SalesOrderNo: data.SalesOrderNo,
                    //       SalesOrderDate: data.SalesOrderDate
                    //     }
                    //   ));
                    // }

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

        this.lstPartys = a.filter(t => t.PartyTypeID == 6).map((party) => ({
          PartyID: party.PartyID,
          PartyName: party.PartyName
        }));

        this.lstPartys.unshift({
          PartyID: 0,
          PartyName: "Please Select"
        });

      }

    });
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

    const Items: ProcessOut_Item_AddModel[] = this.ProductDetails.map(p => ({
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


    let model: ProcessOut_AddModel = {
      ProcessOutID: this.ProcessOutID ?? 0,
      ProcessOutNo: this.ProcessOutNo ?? "",
      ProcessOutDate: this.ProcessOutDate ? this.ProcessOutDate : new Date(),
      ProcessOutType: this.ProcessOutType ?? "",
      ProcessID: this.ProcessID ?? 0,
      PartyID: this.PartyID ?? 0,
      IssueType: this.IssueType ?? '',
      WorkType: this.WorkType ?? '',
      StartDate: this.StartDate,
      EndDate: this.EndDate,
      DueDays: this.DueDays,
      Remarks: this.Remarks ?? "",
      TotalQty: this.TotalQty ?? 0,
      Items: Items
    };

    this.processoutService.Create(model).subscribe(
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
  PartyDropdownSelectionChange(event: MatSelectChange) {

  }

  ClearForm() {

    this.ProcessOutID = 0;
    this.ProcessOutNo = "";
    this.ProcessOutDate = new Date();
    this.ProcessOutType = "Local";
    this.ProcessID = 0;
    this.PartyID = 0;
    this.IssueType = '';
    this.WorkType = '';
    this.StartDate = null;
    this.EndDate = null;
    this.DueDays = null;
    this.Remarks = "";
    this.ProductDetails = [];
    this.TotalQty = 0;
    this.IsLocked = false;

    this.isSOAllSelected = false;
    this.lstSelectedWorkOrder = [];
    this.lstSelectedWorkOrderDetails = [];
    this.lstWorkOrder = [];
  }

  StartDateChanged(value: any) {
    this.StartDate = value ? new Date(value) : null;
    this.updateDueDaysFromDates();
  }

  EndDateChanged(value: any) {
    this.EndDate = value ? new Date(value) : null;
    this.updateDueDaysFromDates();
  }

  DueDaysChanged(value: any) {
    const days = value !== null && value !== undefined && value !== '' ? Number(value) : null;
    this.DueDays = days;
    if (this.StartDate && days !== null && !isNaN(days)) {
      const sd = new Date(this.StartDate);
      sd.setHours(0,0,0,0);
      const ed = new Date(sd.getTime() + days * 24 * 60 * 60 * 1000);
      this.EndDate = ed;
    }
  }

  private updateDueDaysFromDates() {
    if (this.StartDate && this.EndDate) {
      const sd = new Date(this.StartDate);
      const ed = new Date(this.EndDate);
      sd.setHours(0,0,0,0);
      ed.setHours(0,0,0,0);
      const diff = Math.round((ed.getTime() - sd.getTime()) / (1000 * 60 * 60 * 24));
      this.DueDays = diff + 1;
    }
    else {
      this.DueDays = null;
    }
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
    if (!this.ProcessOutDate) {
      result = false;
      msg += "Please select process out date." + "<br/>"
    }
    if (!this.ProcessID) {
      result = false;
      msg += "Please select process." + "<br/>"
    }
    if (!this.PartyID) {
      result = false;
      msg += "Please select worker name." + "<br/>"
    }
    if (!this.IssueType) {
      result = false;
      msg += "Please select issue type." + "<br/>"
    }
    if (!this.WorkType) {
      result = false;
      msg += "Please select work type." + "<br/>"
    }
    if (!this.StartDate) {
      result = false;
      msg += "Please select start date." + "<br/>"
    }
    if (!this.EndDate) {
      result = false;
      msg += "Please select end date." + "<br/>"
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

    let result: boolean = true;
    let msg: string = "";
    if (!this.ProcessID) {
      result = false;
      msg += "Please select process." + "<br/>"
    }
    if (!this.PartyID) {
      result = false;
      msg += "Please select worker name." + "<br/>"
    }
    if (!this.IssueType) {
      result = false;
      msg += "Please select issue type." + "<br/>"
    }
    if (!result) {
      this.toastr.error(msg, '', {
        enableHtml: true,
        closeButton: true
      });
      return;
    }

      this.processoutService.GetPendingWorkOrders(this.IssueType, this.ProcessID, this.PartyID).then(
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
    if (this.ProcessOutID > 0) {
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

        this.processoutService.GetPendingWorkOrderDetails(WorkOrderIDs, this.ProcessOutID, this.IssueType, this.ProcessID, this.PartyID).then(
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
              let p: ProcessOut_Item_AddModel =
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
        this.ProcessOutType = "Workorder Planning";
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

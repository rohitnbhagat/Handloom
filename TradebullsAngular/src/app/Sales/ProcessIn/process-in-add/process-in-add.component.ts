import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Select2Data, Select2DataOption, Select2Option } from '../../../Models/select2';
import { PartyService } from '../../../services/Masters/party.service';
import { ComponentService } from '../../../services/Masters/component.service';
import { ProductService } from '../../../services/Masters/product.service';
import { ProcessIn_AddModel, ProcessIn_Item_AddModel, ProcessIn_ProcessOut_ViewModel, ProcessIn_ProcessOut_Item_ViewModel } from '../../../Models/Sales/ProcessInModel';
import { ProcessinService } from '../../../services/Sales/processin.service';
import { UserService } from '../../../services/user.service';
import { MatSelectChange } from '@angular/material/select';
import { Editor, Toolbar } from 'ngx-editor';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { ProcessService } from '../../../services/Masters/process.service';

@Component({
  selector: 'app-process-in-add',
  templateUrl: './process-in-add.component.html',
  styleUrl: './process-in-add.component.css'
})
export class ProcessInAddComponent implements OnInit, AfterViewInit, OnDestroy {

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
  ProcessInID: number = 0;
  ProcessInNo: string = "";
  ProcessInDate: Date | null = new Date();
  ProcessInType: string = "ProcessOut";
  ProcessID: number = 0;
  PartyID: number = 0;
  Remarks: string = "";
  TotalQty: number = 0;
  IsLocked: boolean = false;
  ProductDetails: ProcessIn_Item_AddModel[] = [];

  @Output() BackEvent = new EventEmitter<void>();
  
  lstProcesses: any[] = [];
  lstPartys: any[] = [];


  lstUsers: any[] = [];
  lstSelectedProcessOut: { ProcessOutID: number, ProcessOutNo: string, ProcessOutDate: Date }[] = [];
  lstSelectedProcessOutDetails: { Select: boolean, Data: ProcessIn_ProcessOut_Item_ViewModel }[] = [];
  IsOpenSaveOrder: boolean = false;
  IsOpenSaveOrderItem: boolean = false;
  lstProcessOut: any[] = [];
  strSOProductFilter: string = "";
  strSOFilter: string = "";

  constructor(private toastr: ToastrService,
    private processinService: ProcessinService,
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
    this.FillParty();
  }

  GetHeaderText() {
    let s = "Create Process In";
    if (this.ProcessInID > 0 && this.IsLocked)
      s = "View Process In";
    else if (this.ProcessInID > 0)
      s = "Edit Process In";
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

  async OpenProcessIn(OrderID: number) {
    this.IsAddNew = true;
    this.ProcessInID = OrderID;
    if (OrderID > 0) {
      const model: {
        ProcessInID: number,
        FromDate: Date | null,
        ToDate: Date | null,
        ProcessInNo: string
      } = {
        ProcessInID: this.ProcessInID,
        FromDate: null,
        ToDate: null,
        ProcessInNo: ""
      }

      await this.processinService.Get(model).then(
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
              this.ProcessInNo = order.ProcessInNo;
              this.ProcessInDate = order.ProcessInDate ? new Date(order.ProcessInDate) : null;
              this.ProcessInType = order.ProcessInType;
              this.ProcessID = order.ProcessID;
              this.PartyID = order.PartyID;
              this.Remarks = order.Remarks;
              this.TotalQty = order.TotalQty;
              this.IsLocked = order.IsLocked;
              this.ProductDetails = [];

              this.processinService.GetOrderDetails(this.ProcessInID).then(
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
                          ProcessOutItemID: t.ProcessOutItemID,
                          WONo: t.WONo,
                          ProcessOutNo: t.ProcessOutNo,
                          SrNo: t.SrNo,
                          ParentProductID: t.ParentProductID,
                          ProductID: t.ProductID,
                          sku: t.sku,
                          ProductName: t.ProductName,
                          ComponentID: t.ComponentID,
                          ComponentName: t.ComponentName,
                          Qty: t.Qty,
                          DQty: t.DQty,
                          RQty: t.RQty,
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

    const Items: ProcessIn_Item_AddModel[] = this.ProductDetails.map(p => ({
      ID: p.ID,
      WOPlanningItemComponentID: p.WOPlanningItemComponentID,
      ProcessOutItemID: p.ProcessOutItemID,
      WONo: p.WONo,
      ProcessOutNo: p.ProcessOutNo,
      SrNo: p.SrNo,
      ParentProductID: p.ParentProductID,
      ProductID: p.ProductID,
      sku: p.sku,
      ProductName: p.ProductName,
      ComponentID: p.ComponentID,
      ComponentName: p.ComponentName,
      Qty: p.Qty,
      DQty: p.DQty,
      RQty: p.RQty,
      Remarks: p.Remarks,
      Photo: p.Photo
    }));
    this.CalculateAmount();


    let model: ProcessIn_AddModel = {
      ProcessInID: this.ProcessInID ?? 0,
      ProcessInNo: this.ProcessInNo ?? "",
      ProcessInDate: this.ProcessInDate ? this.ProcessInDate : new Date(),
      ProcessInType: this.ProcessInType ?? "",
      ProcessID: this.ProcessID ?? 0,
      PartyID: this.PartyID ?? 0,
      Remarks: this.Remarks ?? "",
      TotalQty: this.TotalQty ?? 0,
      Items: Items
    };

    this.processinService.Create(model).subscribe(
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

    this.ProcessInID = 0;
    this.ProcessInNo = "";
    this.ProcessInDate = new Date();
    this.ProcessInType = "Local";
    this.ProcessID = 0;
    this.PartyID = 0;
    this.Remarks = "";
    this.ProductDetails = [];
    this.TotalQty = 0;
    this.IsLocked = false;

    this.isPOAllSelected = false;
    this.lstSelectedProcessOut = [];
    this.lstSelectedProcessOutDetails = [];
    this.lstProcessOut = [];
  }

  onSelectionChange(event: MatSelectChange): void {

  }

  CalculateAmount() {
    const qty = this.ProductDetails.reduce((sum, element) => sum + (element.Qty??0) + (element.DQty??0) + (element.RQty??0), 0);
    this.TotalQty = Number(qty.toFixed(2));
  }

  FormValidate(): boolean {
    let result: boolean = true;
    let msg: string = "";
    if (!this.ProcessInDate) {
      result = false;
      msg += "Please select process in date." + "<br/>"
    }
    if (!this.PartyID) {
      result = false;
      msg += "Please select worker name." + "<br/>"
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

  OpenProcessOut() {
    if (this.lstSelectedProcessOutDetails && this.lstSelectedProcessOutDetails.length > 0) {
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
    if (!result) {
      this.toastr.error(msg, '', {
        enableHtml: true,
        closeButton: true
      });
      return;
    }

      this.processinService.GetPendingProcessOuts(this.ProcessID, this.PartyID).then(
        (response: any) => {

          if (!response.success) {
            this.toastr.error(response.message, '', {
              enableHtml: true,
              closeButton: true
            });
          }
          else {
            this.lstProcessOut = response.data.map((row: any) => (
              {
                Select: (this.lstSelectedProcessOut && this.lstSelectedProcessOut.findIndex((o) => o.ProcessOutID == row.ProcessOutID) >= 0),
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
  toggleProcessOutSelectAll() {
    this.lstProcessOut.forEach(order => order.Select = this.isPOAllSelected);
  }
  checkProcessOutSelectAllStatus() {
    this.isPOAllSelected = this.lstProcessOut.every(order => order.Select);
  }
  isAllSelected: boolean = false;
  IsPicVisibleInProcessOutItem: boolean = false;
  toggleProcessOutItemSelectAll() {
    if (!this.strSOProductFilter) {
      this.lstSelectedProcessOutDetails.forEach(order => order.Select = this.isAllSelected);
    }
    this.lstSelectedProcessOutDetails.filter(order => order.Data.ProductName?.toLowerCase().includes(this.strSOProductFilter.toLowerCase())).forEach(order => order.Select = this.isAllSelected);
  }
  checkProcessOutItemSelectAllStatus() {
    this.isAllSelected = this.lstSelectedProcessOutDetails.every(order => order.Select);
  }
  CloseProcessOutModel() {
    this.IsOpenSaveOrder = false;
    this.IsOpenSaveOrderItem = false;
  }
  CloseProcessOutItemModel() {
    if (this.ProcessInID > 0) {
      this.IsOpenSaveOrder = false;
      this.IsOpenSaveOrderItem = false;
    }
    else {
      this.IsOpenSaveOrder = true;
      this.IsOpenSaveOrderItem = false;
    }
  }
  SubmitProcessOutModel() {
    if (this.lstProcessOut) {
      const lst = this.lstProcessOut.filter(t => t.Select == true);
      if (lst && lst.length > 0) {
        this.lstSelectedProcessOut = lst.map((data: any) => (
          {
            ProcessOutID: data.Order.ProcessOutID,
            ProcessOutNo: data.Order.ProcessOutNo,
            ProcessOutDate: data.Order.ProcessOutDate
          }
        ));
        const ProcessOutIDs: string = this.lstSelectedProcessOut.map(order => order.ProcessOutID).join(',');

        this.processinService.GetPendingProcessOutDetails(ProcessOutIDs, this.ProcessInID).then(
          (response: any) => {
            if (!response.success) {
              this.toastr.error("Error while getting Process Out Details.", '', {
                enableHtml: true,
                closeButton: true
              });
            }
            else {
              this.lstSelectedProcessOutDetails = response.data.map(
                (t: any) => (
                  {
                    Select: (this.ProductDetails && this.ProductDetails.findIndex((p) => p.WOPlanningItemComponentID == t.WOPlanningItemComponentID && p.ProcessOutItemID == t.ProcessOutItemID) >= 0),
                    Data: {
                      WOPlanningItemComponentID: t.WOPlanningItemComponentID,
                      WOPlanningItemID: t.WOPlanningItemID,
                      WOPlanningID: t.WOPlanningID,
                      WONo: t.WONo,
                      ProcessOutItemID: t.ProcessOutItemID,
                      ProcessOutID: t.ProcessOutID,
                      ProcessOutNo: t.ProcessOutNo,
                      SrNo: t.SrNo,
                      ParentProductID: t.ParentProductID,
                      ProductID: t.ProductID,
                      sku: t.sku,
                      ProductName: t.ProductName,
                      ComponentID: t.ComponentID,
                      ComponentName: t.ComponentName,
                      Qty: t.Qty,
                      UsedQty: t.UsedQty,
                      UsedDQty: t.UsedDQty,
                      UsedRQty: t.UsedRQty,
                      Remarks: t.Remarks,
                      Photo: t.Photo
                    }
                  }
                )
              );


            }
          }
        ).finally(() => {
          this.CloseProcessOutModel();
          this.checkProcessOutItemSelectAllStatus();
          this.IsOpenSaveOrderItem = true;
        });

      }
      else {
        this.toastr.error("Please select process out.", '', {
          enableHtml: true,
          closeButton: true
        });
      }
    }
  }
  filteredProcessOuts() {
    if (!this.strSOFilter) {
      return this.lstProcessOut; // If no filter is applied, return all orders
    }

    // Apply filter to SalesOrderNo and SalesOrderDate
    return this.lstProcessOut.filter(order => order.Order.WONo?.toLowerCase().includes(this.strSOFilter.toLowerCase())
      || order.Order.ProcessOutDate?.toLocaleString().includes(this.strSOFilter.toLowerCase())
      );
  }

  SubmitProcessOutItemModel() {
    if (this.lstSelectedProcessOutDetails) {
      const lst = this.lstSelectedProcessOutDetails.filter(t => t.Select == true);
      if (lst && lst.length > 0) {
          
        const str: string[] = [];
        lst.forEach(item => {
          if (item.Data.UsedQty > item.Data.Qty) {
            str.push("Used Qty cannot be grater then Qty for " + item.Data.ProductName);
          }
          if (item.Data.UsedQty < 0) {
            str.push("Used Qty cannot be less then 0 for " + item.Data.ProductName);
          }
          if (item.Data.UsedDQty > item.Data.Qty) {
            str.push("Used Damage Qty cannot be grater then Qty for " + item.Data.ProductName);
          }
          if (item.Data.UsedDQty < 0) {
            str.push("Used Damage Qty cannot be less then 0 for " + item.Data.ProductName);
          }
          if (item.Data.UsedRQty > item.Data.Qty) {
            str.push("Used Repair Qty cannot be grater then Qty for " + item.Data.ProductName);
          }
          if (item.Data.UsedRQty < 0) {
            str.push("Used Repair Qty cannot be less then 0 for " + item.Data.ProductName);
          }
          if ((item.Data.UsedQty??0) + (item.Data.UsedDQty??0) + (item.Data.UsedRQty??0) > item.Data.Qty) {
            str.push("Total used qty cannot be greater than qty for " + item.Data.ProductName);
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
        this.lstSelectedProcessOutDetails.filter(t => t.Select == true).forEach(item => {
              let p: ProcessIn_Item_AddModel =
              {
                ID: 0,
                WOPlanningItemComponentID: item.Data.WOPlanningItemComponentID,
                ProcessOutItemID: item.Data.ProcessOutItemID,
                WONo: item.Data.WONo || "",
                ProcessOutNo: item.Data.ProcessOutNo || "",
                SrNo: srNo,
                ParentProductID: item.Data.ParentProductID,
                ProductID: item.Data.ProductID,
                sku: item.Data.sku,
                ProductName: item.Data.ProductName,
                ComponentID: item.Data.ComponentID, 
                ComponentName: item.Data.ComponentName,
                Qty: item.Data.UsedQty,
                DQty: item.Data.UsedDQty,
                RQty: item.Data.UsedRQty,
                Remarks: item.Data.Remarks,
                Photo: item.Data.Photo??""
              }
              srNo++;
              this.ProductDetails.push(p);
        });
        this.CalculateAmount();
        this.ProcessInType = "ProcessOut";
        this.IsOpenSaveOrder = false;
        this.IsOpenSaveOrderItem = false;
      }
      else {
        this.toastr.error("Please select process out items.", '', {
          enableHtml: true,
          closeButton: true
        });
      }
    }
  }


}

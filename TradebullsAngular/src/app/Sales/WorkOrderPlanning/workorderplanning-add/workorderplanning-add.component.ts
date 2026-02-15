import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Select2Data, Select2DataOption, Select2Option } from '../../../Models/select2';
import { PartyService } from '../../../services/Masters/party.service';
import { ComponentService } from '../../../services/Masters/component.service';
import { ProductService } from '../../../services/Masters/product.service';
import { WorkorderplanningAddProductComponent } from '../workorderplanning-add-product/workorderplanning-add-product.component';
import { WorkOrderPlanning_AddModel, WorkOrderPlanning_Item_AddModel, WorkOrderPlanning_Item, WorkOrderPlanning_SalesOrder_Item } from '../../../Models/Sales/WorkOrderPlanningModel';
import { WorkorderplanningService } from '../../../services/Sales/workorderplanning.service';
import { UserService } from '../../../services/user.service';
import { MatSelectChange } from '@angular/material/select';
import { Editor, Toolbar } from 'ngx-editor';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-workorderplanning-add',
  templateUrl: './workorderplanning-add.component.html',
  styleUrl: './workorderplanning-add.component.css'
})
export class WorkorderplanningAddComponent implements OnInit, AfterViewInit, OnDestroy {

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
  WOPlanningID: number = 0;
  VoucherNo: string = "";
  VoucherDate: Date | null = new Date();
  WOType: string = "Local";
  PreparedBy: number = 0;
  AssignedTo: number = 0;
  AuthorizedBy: number = 0;
  StartDate: Date | null = new Date();
  EndDate: Date | null = new Date();
  DueDays: number | null = null;
  Remarks: string = "";
  SalesOrderNo: string = "";
  TotalQty: number = 0;
  IsLocked: boolean = false;
  ProductDetails: WorkOrderPlanning_Item[] = [];

  @Output() BackEvent = new EventEmitter<void>();
  @ViewChild("CntProduct") CntProduct?: WorkorderplanningAddProductComponent;

  lstUsers: any[] = [];
  lstSelectedSalesOrder: { SalesOrderID: number, SalesOrderNo: string, SalesOrderDate: Date }[] = [];
  lstSelectedSalesOrderDetails: { Select: boolean, Data: WorkOrderPlanning_SalesOrder_Item }[] = [];
  IsOpenSaveOrder: boolean = false;
  IsOpenSaveOrderItem: boolean = false;
  lstSalesOrder: any[] = [];
  strSOProductFilter: string = "";
  strSOFilter: string = "";
  lstComponents: { ComponentID: number, ComponentName: string }[] = [];
  UserId: number = 0;

  constructor(private toastr: ToastrService,
    private workOrderPlanningService: WorkorderplanningService,
    private productService: ProductService,
    private userService: UserService,
    private componentService: ComponentService
  ) {

  }
  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    if(localStorage.getItem("userSession")){
    let userSession:any = localStorage.getItem("userSession");
    let context = JSON.parse(<string>userSession);
    this.UserId = context.data.UserID;
    this.PreparedBy = this.UserId;
    }

    this.editor = new Editor();
    this.FillComponent();
    this.FillUsers();
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


  FillUsers() {
    this.userService.GetUsers(0, 0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstUsers = a.map((brand) => ({
          value: brand.UserID,
          label: brand.FullName,
          data: brand,
        }));

        this.lstUsers.unshift({
          value: 0,
          label: "Please Select",
          data: { UserID: 0, FullName: "Please Select" },
        });

      }

    });
  }

  GetHeaderText() {
    let s = "Create Work Order Planning";
    if (this.WOPlanningID > 0 && this.IsLocked)
      s = "View Work Order Planning";
    else if (this.WOPlanningID > 0)
      s = "Edit Work Order Planning";
    return s;;
  }

  async OpenWorkOrderPlanning(OrderID: number) {
    this.IsAddNew = true;
    this.WOPlanningID = OrderID;
    if (OrderID > 0) {
      const model: {
        WOPlanningID: number,
        FromDate: Date | null,
        ToDate: Date | null,
        WONo: string
      } = {
        WOPlanningID: this.WOPlanningID,
        FromDate: null,
        ToDate: null,
        WONo: ""
      }

      await this.workOrderPlanningService.Get(model).then(
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
              this.VoucherNo = order.WONo;
              this.VoucherDate = order.WODate ? new Date(order.WODate) : null;
              this.WOType = order.WOType;
              this.PreparedBy = order.PreparedBy;
              this.AssignedTo = order.AssignedTo;
              this.AuthorizedBy = order.AuthorizedBy;
              this.StartDate = order.StartDate ? new Date(order.StartDate) : null;
              this.EndDate = order.EndDate ? new Date(order.EndDate) : null;
              this.DueDays = order.DueDays;
              this.Remarks = order.Remarks;
              this.TotalQty = order.TotalQty;
              this.IsLocked = order.IsLocked;
              this.SalesOrderNo = order.SalesOrderNo;
              this.ProductDetails = [];

              this.workOrderPlanningService.GetOrderDetails(this.WOPlanningID).then(
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
                          SrNo: t.SrNo,
                          SalesOrderItemID: t.SalesOrderItemID,
                          SalesOrderNo: t.SalesOrderNo,
                          ParentProductID: t.ParentProductID,
                          ProductID: t.ProductID,
                          sku: t.sku,
                          ProductName: t.ProductName,
                          AttributeValues: t.AttributeValues.map((m: any) => ({
                            ProductAttributeID: m.ProductAttributeID,
                            ProductAttributeValueID: m.ProductAttributeValueID,
                            Name: m.name,
                            Option: m.option
                          })),
                          Qty: t.Qty,
                          Remarks: t.Remarks,
                          Photo: t.Photo,
                          SOItems: (t.SOItems ? t.SOItems.map((m: any) => ({
                            SalesOrderItemID: m.SalesOrderItemID,
                            SalesOrderNo: m.SalesOrderNo,
                            Qty: m.Qty
                          })) : []),
                          Components: (t.Components ?t.Components.map((m: any) => ({
                            ComponentID: m.ComponentID,
                            ComponentName: m.ComponentName
                          })) : [])
                        }
                      )
                    );
                    if (responseDetail.SelectedSO && responseDetail.SelectedSO.length > 0) {
                      this.lstSelectedSalesOrder = responseDetail.SelectedSO.map((data: any) => (
                        {
                          SalesOrderID: data.SalesOrderID,
                          SalesOrderNo: data.SalesOrderNo,
                          SalesOrderDate: data.SalesOrderDate
                        }
                      ));
                    }

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

  OpenProduct(product: any) {
    this.CntProduct?.OpenProduct(product);
  }

  AddeditProductSave(product: any) {
    console.log(product);
    if (product) {
      if (product.SrNo == 0) {
        const maxSrNo = (this.ProductDetails.length == 0) ? 0 : Math.max(...this.ProductDetails.map(product => product.SrNo));
        product.SrNo = (this.ProductDetails.length == 0) ? 1 : maxSrNo + 1;

        let p: WorkOrderPlanning_Item =
        {
          ID: product.ID,
          SalesOrderItemID: "",
          SalesOrderNo: "",
          SrNo: product.SrNo,
          ParentProductID: product.ParentProductID,
          ProductID: product.ProductID,
          sku: product.sku,
          ProductName: product.ProductName,
          AttributeValues: product.AttributeValues,
          Qty: product.Qty,
          Remarks: product.Remarks,
          Photo: product.Photo,
          SOItems: [],
          Components: product.Components
        }

        this.ProductDetails.push(p);
        this.CalculateAmount();

      }
      else {
        this.ProductDetails.forEach(p => {
          if (p.SrNo == product.SrNo) {
            p.ID = product.ID;
            p.SrNo = product.SrNo;
            p.ParentProductID = product.ParentProductID;
            p.ProductID = product.ProductID;
            p.sku = product.sku;
            p.ProductName = product.ProductName;
            p.AttributeValues = product.AttributeValues;
            p.Qty = product.Qty;
            p.Remarks = product.Remarks;
            p.Photo = product.Photo;
            p.Components = product.Components;

            this.CalculateAmount();
          }
        });
      }
    }
  }


  DeleteProduct(product: any) {
    this.ProductDetails = this.ProductDetails.filter(t => t.SrNo != product.SrNo);
    this.ProductDetails.forEach((product, index) => { product.SrNo = index + 1 });
    if (this.WOType == "Sales Order") {
      if (product.SOItems && product.SOItems.length > 0) {

        product.SOItems.forEach((so: any) => {
          this.lstSelectedSalesOrderDetails.filter(t => t.Data.SalesOrderItemID == so.SalesOrderItemID).forEach((t) => {
            t.Select = false;
          });
        });

      };
    }
    this.CalculateAmount();
  }

  SaveOrderClick() {
    if (!this.FormValidate())
      return;

    const Items: WorkOrderPlanning_Item_AddModel[] = this.ProductDetails.map(t => (
      {
        ID: t.ID,
        SalesOrderItemID: t.SalesOrderItemID,
        SalesOrderNo: t.SalesOrderNo,
        SrNo: t.SrNo,
        ParentProductID: t.ParentProductID,
        ProductID: t.ProductID,
        AttributeValues: t.AttributeValues.map(m => ({ ProductAttributeID: m.ProductAttributeID, ProductAttributeValueID: m.ProductAttributeValueID })),
        Qty: t.Qty,
        Remarks: t.Remarks,
        SOItems: t.SOItems,
        Components: t.Components.map(c => ({ ComponentID: c.ComponentID, ComponentName: c.ComponentName }))
      }
    ));

    this.CalculateAmount();


    let model: WorkOrderPlanning_AddModel = {
      WOPlanningID: this.WOPlanningID ?? 0,
      WONo: this.VoucherNo ?? "",
      WODate: this.VoucherDate ? this.VoucherDate : new Date(),
      WOType: this.WOType ?? "",
      PreparedBy: this.PreparedBy ?? 0,
      AssignedTo: this.AssignedTo ?? 0,
      AuthorizedBy: this.AuthorizedBy ?? 0,
      StartDate: this.StartDate,
      EndDate: this.EndDate,
      DueDays: this.DueDays,
      Remarks: this.Remarks ?? "",
      TotalQty: this.TotalQty ?? 0,
      SalesOrderNo: this.SalesOrderNo ?? "",
      Items: Items
    };

    this.workOrderPlanningService.Create(model).subscribe(
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

    this.WOPlanningID = 0;
    this.VoucherNo = "";
    this.VoucherDate = new Date();
    this.WOType = "Local";
    this.PreparedBy = this.UserId;
    this.AssignedTo = 0;
    this.AuthorizedBy = 0;
    this.StartDate = null;
    this.EndDate = null;
    this.DueDays = null;
    this.Remarks = "";
    this.ProductDetails = [];
    this.TotalQty = 0;
    this.IsLocked = false;
    this.SalesOrderNo = "";

    this.isSOAllSelected = false;
    this.lstSelectedSalesOrder = [];
    this.lstSelectedSalesOrderDetails = [];
    this.lstSalesOrder = [];
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
    const qty = this.ProductDetails.reduce((sum, element) => sum + element.Qty, 0);
    this.TotalQty = Number(qty.toFixed(2));
  }

  FormValidate(): boolean {
    let result: boolean = true;
    let msg: string = "";
    if (!this.VoucherDate) {
      result = false;
      msg += "Please select voucher date." + "<br/>"
    }
    // if (!this.BrandID) {
    //   result = false;
    //   msg += "Please select brand." + "<br/>"
    // }
    // if (!this.PartyID) {
    //   result = false;
    //   msg += "Please select party." + "<br/>"
    // }
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

  LocalButtonClick() {
    if (confirm("Are you sure, you want to change from Sales Order to Local?")) {
      this.WOType = "Local";
      this.lstSelectedSalesOrder = [];
      this.lstSelectedSalesOrderDetails = [];
      this.ProductDetails = [];
      this.CalculateAmount();
    }
  }
  OpenSalesOrder() {
    if (this.lstSelectedSalesOrderDetails && this.lstSelectedSalesOrderDetails.length > 0) {
      this.IsOpenSaveOrderItem = true;
      return;
    }

    if (this.WOType != "Local" || confirm("Are you sure, you want to change from Local to Sales Order?")) {
      const model: {
        SalesOrderID: number,
        FromDate: Date | null,
        ToDate: Date | null,
        SalesOrderNo: string,
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
        SalesOrderID: 0,
        FromDate: null,
        ToDate: null,
        SalesOrderNo: "",
        BrandID: 0,
        PartyID: 0,
        ConsigneeID: 0,
        AgentID: 0,
        SalesLocationID: 0,
        Priority: "",
        Status: "",
        ExhibitionID: 0,
        CreditTypeID: 0
      }

      this.workOrderPlanningService.GetPendingSalesOrder(model).then(
        (response: any) => {

          if (!response.success) {
            this.toastr.error(response.message, '', {
              enableHtml: true,
              closeButton: true
            });
          }
          else {
            this.lstSalesOrder = response.data.map((row: any) => (
              {
                Select: (this.lstSelectedSalesOrder && this.lstSelectedSalesOrder.findIndex((o) => o.SalesOrderID == row.SalesOrderID) >= 0),
                Order: row
              }
            ));
            this.IsOpenSaveOrder = true;
          }

        });
    }
  }
  SetSalesOrderDetails() {
    let str = "";
    this.lstSelectedSalesOrder.forEach((order) => {
      let SOdate = this.formatDate(new Date(order.SalesOrderDate));
      str = str + ((str.length > 0) ? "\n" : "") + order.SalesOrderNo;
      str = str + " - " + SOdate;
    });
    this.SalesOrderNo = str;
  }
  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2); // Adds leading zero if necessary
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adds leading zero if necessary
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  isSOAllSelected: boolean = false;
  toggleSalesOrderSelectAll() {
    this.lstSalesOrder.forEach(order => order.Select = this.isSOAllSelected);
  }
  checkSalesOrderSelectAllStatus() {
    this.isSOAllSelected = this.lstSalesOrder.every(order => order.Select);
  }
  isAllSelected: boolean = false;
  IsPicVisibleInSalesOrderItem: boolean = false;
  toggleSalesOrderItemSelectAll() {
    if (!this.strSOProductFilter) {
      this.lstSelectedSalesOrderDetails.forEach(order => order.Select = this.isAllSelected);
    }
    this.lstSelectedSalesOrderDetails.filter(order => order.Data.ProductName?.toLowerCase().includes(this.strSOProductFilter.toLowerCase())).forEach(order => order.Select = this.isAllSelected);
  }
  checkSalesOrderItemSelectAllStatus() {
    this.isAllSelected = this.lstSelectedSalesOrderDetails.every(order => order.Select);
  }
  CloseSalesorderModel() {
    this.IsOpenSaveOrder = false;
    this.IsOpenSaveOrderItem = false;
  }
  CloseSalesorderItemModel() {
    if (this.WOPlanningID > 0) {
      this.IsOpenSaveOrder = false;
      this.IsOpenSaveOrderItem = false;
    }
    else {
      this.IsOpenSaveOrder = true;
      this.IsOpenSaveOrderItem = false;
    }
  }
  SubmitSalesorderModel() {
    if (this.lstSalesOrder) {
      const lst = this.lstSalesOrder.filter(t => t.Select == true);
      if (lst && lst.length > 0) {
        this.lstSelectedSalesOrder = lst.map((data: any) => (
          {
            SalesOrderID: data.Order.SalesOrderID,
            SalesOrderNo: data.Order.SalesOrderNo,
            SalesOrderDate: data.Order.SalesOrderDate
          }
        ));
        const SalesOrderIDs: string = this.lstSelectedSalesOrder.map(order => order.SalesOrderID).join(',');

        this.workOrderPlanningService.GetPendingSalesOrderDetails(SalesOrderIDs, this.WOPlanningID).then(
          (response: any) => {
            if (!response.success) {
              this.toastr.error("Error while getting Sales Order Details.", '', {
                enableHtml: true,
                closeButton: true
              });
            }
            else {
              this.lstSelectedSalesOrderDetails = response.data.map(
                (t: any) => (
                  {
                    Select: (this.ProductDetails && this.ProductDetails.findIndex((p) => p.SOItems && p.SOItems.findIndex((so) => so.SalesOrderItemID == t.SalesOrderItemID) >= 0) >= 0),
                    Data: {
                      SalesOrderItemID: t.SalesOrderItemID,
                      SalesOrderNo: t.SalesOrderNo,
                      SalesOrderDate: t.SalesOrderDate,
                      SrNo: t.SrNo,
                      ParentProductID: t.ParentProductID,
                      ProductID: t.ProductID,
                      sku: t.sku,
                      ProductName: t.ProductName,
                      AttributeValues: t.AttributeValues.map((m: any) => ({
                        ProductAttributeID: m.ProductAttributeID,
                        ProductAttributeValueID: m.ProductAttributeValueID,
                        Name: m.name,
                        Option: m.option
                      })),
                      Qty: t.Qty,
                      UsedQty: t.UsedQty,
                      HSNCodeID: t.HSNCodeID,
                      HSNCodeName: t.HSNCodeName,
                      Remarks: t.Remarks,
                      Photo: t.Photo,
                      Components: t.Components ? t.Components.map((c: any) => ({
                        ComponentID: c.ComponentID,
                        ComponentName: c.ComponentName
                      })) : []
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
        this.toastr.error("Please select sales order.", '', {
          enableHtml: true,
          closeButton: true
        });
      }
    }
  }
  filteredSalesOrders() {
    if (!this.strSOFilter) {
      return this.lstSalesOrder; // If no filter is applied, return all orders
    }

    // Apply filter to SalesOrderNo and SalesOrderDate
    return this.lstSalesOrder.filter(order => order.Order.SalesOrderNo?.toLowerCase().includes(this.strSOFilter.toLowerCase())
      || order.Order.SalesOrderDate?.toLocaleString().includes(this.strSOFilter.toLowerCase())
      || order.Order.PartyName?.toLowerCase().includes(this.strSOFilter.toLowerCase())
      || order.Order.PONo?.toLowerCase().includes(this.strSOFilter.toLowerCase())
      || order.Order.PODate?.toLowerCase().includes(this.strSOFilter.toLowerCase()));

  }

  SubmitSalesorderItemModel() {
    if (this.lstSelectedSalesOrderDetails) {
      const lst = this.lstSelectedSalesOrderDetails.filter(t => t.Select == true);
      if (lst && lst.length > 0) {
        this.ProductDetails = [];
        let srNo = 1;
        this.lstSelectedSalesOrderDetails.filter(t => t.Select == true).forEach(item => {
          if (item.Data.Components && item.Data.Components.length > 0) {
            const alreadyAdded = this.ProductDetails.find(p => p.ParentProductID == item.Data.ParentProductID && p.ProductID == item.Data.ProductID && p.Remarks == item.Data.Remarks);
            if (alreadyAdded) {
              alreadyAdded.Qty += item.Data.Qty;
              alreadyAdded.SalesOrderItemID += "," + item.Data.SalesOrderItemID;
              if (alreadyAdded.SOItems.findIndex((so: any) => so.SalesOrderNo == item.Data.SalesOrderNo || "") == -1) {
                alreadyAdded.SalesOrderNo += ", " + item.Data.SalesOrderNo;
                alreadyAdded.SOItems.push({
                  SalesOrderItemID: item.Data.SalesOrderItemID,
                  SalesOrderNo: item.Data.SalesOrderNo || "",
                  Qty: item.Data.UsedQty
                });
              }
              alreadyAdded.Components = alreadyAdded.Components || [];
            }
            else {
              let p: WorkOrderPlanning_Item =
              {
                ID: 0,
                SrNo: srNo,
                SalesOrderItemID: item.Data.SalesOrderItemID.toString(),
                SalesOrderNo: item.Data.SalesOrderNo || "",
                ParentProductID: item.Data.ParentProductID,
                ProductID: item.Data.ProductID,
                sku: item.Data.sku,
                ProductName: item.Data.ProductName,
                AttributeValues: item.Data.AttributeValues,
                Qty: item.Data.UsedQty,
                Remarks: item.Data.Remarks,
                Photo: item.Data.Photo,
                SOItems: [{
                  SalesOrderItemID: item.Data.SalesOrderItemID,
                  SalesOrderNo: item.Data.SalesOrderNo || "",
                  Qty: item.Data.UsedQty
                }],
                Components: item.Data.Components.map(c => ({ ComponentID: c.ComponentID, ComponentName: c.ComponentName }))
              }
              srNo++;
              this.ProductDetails.push(p);
            }
          }
        });
        this.SetSalesOrderDetails();
        this.CalculateAmount();
        this.WOType = "Sales Order";
        this.IsOpenSaveOrder = false;
        this.IsOpenSaveOrderItem = false;
      }
      else {
        this.toastr.error("Please select sales order items.", '', {
          enableHtml: true,
          closeButton: true
        });
      }
    }
  }

  compareComponents(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.ComponentID === c2.ComponentID : c1 === c2;
  }

  removeChip(component: any, item: { Select: boolean, Data: WorkOrderPlanning_SalesOrder_Item }) {
    const index_product_Item = this.lstSelectedSalesOrderDetails.indexOf(item);
    if (index_product_Item >= 0) {
      this.lstSelectedSalesOrderDetails[index_product_Item].Data.Components = this.lstSelectedSalesOrderDetails[index_product_Item].Data.Components.filter((c: any) => c.ComponentID != component.ComponentID);
    }
  }
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedComponent(event: MatAutocompleteSelectedEvent, item: { Select: boolean, Data: WorkOrderPlanning_SalesOrder_Item }) {
    const index_product_Item = this.lstSelectedSalesOrderDetails.indexOf(item);
    const selectedID = event.option.viewValue;
    if (index_product_Item >= 0) {
      const lst = this.lstComponents.find((c: any) => c.ComponentID == selectedID);
    }
  }

}

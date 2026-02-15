import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Select2Data, Select2DataOption, Select2Option } from '../../../Models/select2';
import { PartyService } from '../../../services/Masters/party.service';
import { ProductService } from '../../../services/Masters/product.service';
import { InsertStockAddProductComponent } from '../insertstock-add-product/insertstock-add-product.component';
import { InsertStock_AddModel, InsertStock_Item_AddModel, InsertStock_Item } from '../../../Models/Sales/InsertStockModel';
import { InsertStockService } from '../../../services/Sales/insertstock.service';
import { MatSelectChange } from '@angular/material/select';
import { Editor, Toolbar } from 'ngx-editor';
import { PartyAddComponent } from '../../../Masters/Party/party-add/party-add.component';
import { BrandService } from '../../../services/Masters/brand.service';

@Component({
  selector: 'app-insertstock-add',
  templateUrl: './insertstock-add.component.html',
  styleUrl: './insertstock-add.component.css'
})
export class InsertStockAddComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("partycomp") partycomp?: PartyAddComponent;

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
  InsertStockID: number = 0;
  VoucherNo: string = "";
  VoucherDate: Date | null = new Date();
  PartyID: number = 0;
  BrandID: number = 0;
  Remarks: string = "";
  ProductDetails: InsertStock_Item[] = [];
  TotalQty: number = 0;
  IsLocked: boolean = false;

  @Output() BackEvent = new EventEmitter<void>();
  @ViewChild("CntProduct") CntProduct?: InsertStockAddProductComponent;

  lstPartys: any[] = [];
  lstBrands: any[] = [];

  constructor(private toastr: ToastrService,
    private partyService: PartyService,
    private insertStockService: InsertStockService,
    private productService: ProductService,
    private brandService: BrandService
  ) {

  }
  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  ngAfterViewInit(): void {
  }

  
  ngOnInit(): void {
    this.editor = new Editor();
    this.FillParty();
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
    let s = "Create Insert Stock";
    if(this.InsertStockID > 0 && this.IsLocked)
       s = "View Insert Stock";
    else if (this.InsertStockID > 0)
      s = "Edit Insert Stock";
    return s;;
  }

  async OpenSalesOrder(OrderID: number) {
    this.IsAddNew = true;
    this.InsertStockID = OrderID;
    if (OrderID > 0) {
      const model:{
        InsertStockID: number,
        FromDate: Date | null,
        ToDate: Date | null,
        InsertStockNo: string,
        PartyID: number,
        BrandID: number
      } = {
        InsertStockID: this.InsertStockID,
        FromDate: null,
        ToDate: null,
        InsertStockNo: "",
        PartyID: 0,
        BrandID: 0
      }

      await this.insertStockService.Get(model).then(
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
              this.VoucherNo = order.InsertStockNo;
              this.VoucherDate = order.InsertStockDate ? new Date(order.InsertStockDate) : null;
              this.PartyID = order.PartyID;
              this.BrandID = order.BrandID;
              this.Remarks = order.Remarks;
              this.TotalQty = order.TotalQty;
              this.IsLocked = order.IsLocked;
              this.ProductDetails = [];

              this.insertStockService.GetOrderDetails(this.InsertStockID).then(
                (responseDetail: any) => {
                  if (!responseDetail.success) {
                    this.toastr.error(response.message, '', {
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
                          HSNCodeID: t.HSNCodeID,
                          HSNCodeName: t.HSNCodeName,
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
    if(confirm('Are you sure you want to go back?'))
    {
      this.IsAddNew = false;
      this.BackEvent.emit();
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

        this.lstPartys = a.filter(t => t.PartyTypeID == 3).map((party) => ({
          value: party.PartyID,
          label: party.PartyName,
          data: party,
        }));

        this.lstPartys.unshift({
          value: 0,
          label: "Please Select",
          data: { PartyID: 0, PartyName: "Please Select" },
        });

      }

    });
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

        let p: InsertStock_Item =
        {
          ID: product.ID,
          SrNo: product.SrNo,
          ParentProductID: product.ParentProductID,
          ProductID: product.ProductID,
          sku: product.sku,
          ProductName: product.ProductName,
          AttributeValues: product.AttributeValues,
          Qty: product.Qty,
          HSNCodeID: product.HSNCodeID,
          HSNCodeName: product.HSNCodeName,
          Remarks: product.Remarks,
          Photo: product.Photo
        }
        // const shippingAddress = this.BillingAddress?.GetAddressData();
        // this.productService.GetTaxRate({ CountryID: shippingAddress.CountryID, StateID: shippingAddress.StateID, ProductIDs: String(product.ProductID) }).then(
        //   (res: any) => {
        //     if (res.success) {
        //       p.Taxes = res.data.map((element: any) => (
        //         {
        //           TaxRateID: element.TaxRateID,
        //           TaxClassID: element.TaxClassID,
        //           name: element.name,
        //           rate: element.rate,
        //           Amount: (product.TotalAmount * element.rate) / 100
        //         }
        //       ));
        //     }
        //   }
        // ).finally(
        //   () => {
        //     const totalTaxAmount = p.Taxes.reduce((sum, element) => sum + element.Amount, 0);
        //     p.TotalTaxAmount = Number(totalTaxAmount.toFixed(2));
        //     p.FinalAmount = Number((p.TotalAmount + p.TotalTaxAmount).toFixed(2));
        //     this.ProductDetails.push(p);
        //     this.RefreshTaxDetails();
        //     this.CalculateAmount();
        //   }
        // );
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
            p.HSNCodeID = product.HSNCodeID;
            p.HSNCodeName = product.HSNCodeName;
            p.Remarks = product.Remarks;
            p.Photo = product.Photo;

            // const shippingAddress = this.BillingAddress?.GetAddressData();
            // this.productService.GetTaxRate({ CountryID: shippingAddress.CountryID, StateID: shippingAddress.StateID, ProductIDs: String(product.ProductID) }).then(
            //   (res: any) => {
            //     if (res.success) {
            //       p.Taxes = res.data.map((element: any) => (
            //         {
            //           TaxRateID: element.TaxRateID,
            //           TaxClassID: element.TaxClassID,
            //           name: element.name,
            //           rate: element.rate,
            //           Amount: (product.TotalAmount * element.rate) / 100
            //         }
            //       ));
            //     }
            //   }
            // ).finally(
            //   () => {
            //     const totalTaxAmount = p.Taxes.reduce((sum, element) => sum + element.Amount, 0);
            //     p.TotalTaxAmount = Number(totalTaxAmount.toFixed(2));
            //     p.FinalAmount = Number((p.TotalAmount + p.TotalTaxAmount).toFixed(2));
            //     this.RefreshTaxDetails();
            //     this.CalculateAmount();
            //   }
            // );
            this.CalculateAmount();
          }
        });
      }
    }
  }

  
  DeleteProduct(product: any) {
    this.ProductDetails = this.ProductDetails.filter(t => t.SrNo != product.SrNo);
    this.ProductDetails.forEach((product, index) => { product.SrNo = index + 1 });
    this.CalculateAmount();
  }

  SaveOrderClick() {
    if(!this.FormValidate())
      return;

    const Items: InsertStock_Item_AddModel[] = this.ProductDetails.map(t => (
      {
        ID: t.ID,
        SrNo: t.SrNo,
        ParentProductID: t.ParentProductID,
        ProductID: t.ProductID,
        AttributeValues: t.AttributeValues.map(m => ({ ProductAttributeID: m.ProductAttributeID, ProductAttributeValueID: m.ProductAttributeValueID })),
        Qty: t.Qty,
        HSNCodeID: t.HSNCodeID,
        Remarks: t.Remarks
      }
    ));

    this.CalculateAmount();

    // const billingAddress = this.BillingAddress?.GetAddressData();
    // const shippingAddress = this.ShippingAddress?.GetAddressData();

    let model: InsertStock_AddModel = {
      InsertStockID: this.InsertStockID ?? 0,
      InsertStockNo: this.VoucherNo ?? "",
      InsertStockDate: this.VoucherDate ? this.VoucherDate : new Date(),
      PartyID: this.PartyID ?? 0,
      BrandID: this.BrandID ?? 0,
      Remarks: this.Remarks ?? "",
      TotalQty: this.TotalQty ?? 0,
      Items: Items
    };

    this.insertStockService.Create(model).subscribe(
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

    this.InsertStockID = 0;
    this.VoucherNo = "";
    this.VoucherDate = new Date();
    this.PartyID = 0;
    this.Remarks = "";
    this.ProductDetails = [];
    this.TotalQty = 0;
    this.IsLocked = false;
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
    if (!this.BrandID) {
      result = false;
      msg += "Please select brand." + "<br/>"
    }
    if (!this.PartyID) {
      result = false;
      msg += "Please select party." + "<br/>"
    }
    if (!this.ProductDetails || this.ProductDetails.length == 0) {
      result = false;
      msg += "Please enter product details." + "<br/>"
    }
    
    if(!result)
    {
    this.toastr.error(msg, '', {
      enableHtml: true,
      closeButton: true
    });
  }

    return result;
  }

  CreateParty() {
    this.partycomp?.OpenModel(-1, 'Create Party', 1);
  }

}

import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Select2Data, Select2DataOption, Select2Option } from '../../../Models/select2';
import { ProductService } from '../../../services/Masters/product.service';
import { RemoveStockAddProductComponent } from '../removestock-add-product/removestock-add-product.component';
import { RemoveStock_AddModel, RemoveStock_Item_AddModel, RemoveStock_Item } from '../../../Models/Sales/RemoveStockModel';
import { RemoveStockService } from '../../../services/Sales/removestock.service';
import { MatSelectChange } from '@angular/material/select';
import { Editor, Toolbar } from 'ngx-editor';
import { BrandService } from '../../../services/Masters/brand.service';

@Component({
  selector: 'app-removestock-add',
  templateUrl: './removestock-add.component.html',
  styleUrl: './removestock-add.component.css'
})
export class RemoveStockAddComponent implements OnInit, AfterViewInit, OnDestroy {
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
  RemoveStockID: number = 0;
  VoucherNo: string = "";
  VoucherDate: Date | null = new Date();
  BrandID: number = 0;
  Remarks: string = "";
  ProductDetails: RemoveStock_Item[] = [];
  TotalQty: number = 0;
  IsLocked: boolean = false;

  @Output() BackEvent = new EventEmitter<void>();
  @ViewChild("CntProduct") CntProduct?: RemoveStockAddProductComponent;

  lstPartys: any[] = [];
  lstBrands: any[] = [];

  constructor(private toastr: ToastrService,
    private removeStockService: RemoveStockService,
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
    let s = "Create Remove Stock";
    if (this.RemoveStockID > 0 && this.IsLocked)
      s = "View Remove Stock";
    else if (this.RemoveStockID > 0)
      s = "Edit Remove Stock";
    return s;
  }

  async OpenSalesOrder(OrderID: number) {
    this.IsAddNew = true;
    this.RemoveStockID = OrderID;
    if (OrderID > 0) {
      const model: {
        RemoveStockID: number,
        FromDate: Date | null,
        ToDate: Date | null,
        RemoveStockNo: string,
        BrandID: number
      } = {
        RemoveStockID: this.RemoveStockID,
        FromDate: null,
        ToDate: null,
        RemoveStockNo: "",
        BrandID: 0
      }

      await this.removeStockService.Get(model).then(
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
              this.VoucherNo = order.RemoveStockNo;
              this.VoucherDate = order.RemoveStockDate ? new Date(order.RemoveStockDate) : null;
              this.BrandID = order.BrandID;
              this.Remarks = order.Remarks;
              this.TotalQty = order.TotalQty;
              this.IsLocked = order.IsLocked;
              this.ProductDetails = [];

              this.removeStockService.GetOrderDetails(this.RemoveStockID).then(
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
    if (confirm('Are you sure you want to go back?')) {
      this.IsAddNew = false;
      this.BackEvent.emit();
    }
  }

  OpenProduct(product: any) {
    if (!this.BrandID) {
      this.toastr.error("Please select brand.", '', {
        enableHtml: true,
        closeButton: true
      });

      return;
    }
    this.CntProduct?.OpenProduct(product, this.BrandID, this.RemoveStockID, "Remove Stock");
  }

  AddeditProductSave(product: any) {


    if (product) {
      if (product.SrNo == 0) {
        const maxSrNo = (this.ProductDetails.length == 0) ? 0 : Math.max(...this.ProductDetails.map(product => product.SrNo));
        product.SrNo = (this.ProductDetails.length == 0) ? 1 : maxSrNo + 1;

        let p: RemoveStock_Item =
        {
          ID: product.ID,
          SrNo: product.SrNo,
          StockItemID: product.StockItemID,
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

        this.ProductDetails.push(p);
        this.CalculateAmount();

      }
      else {
        this.ProductDetails.forEach(p => {
          if (p.SrNo == product.SrNo) {
            p.ID = product.ID;
            p.SrNo = product.SrNo;
            p.StockItemID = product.StockItemID;
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
    if (!this.FormValidate())
      return;

    const Items: RemoveStock_Item_AddModel[] = this.ProductDetails.map(t => (
      {
        ID: t.ID,
        SrNo: t.SrNo,
        StockItemID: t.StockItemID,
        ParentProductID: t.ParentProductID,
        ProductID: t.ProductID,
        AttributeValues: t.AttributeValues.map(m => ({ ProductAttributeID: m.ProductAttributeID, ProductAttributeValueID: m.ProductAttributeValueID })),
        Qty: t.Qty,
        HSNCodeID: t.HSNCodeID,
        Remarks: t.Remarks
      }
    ));

    this.CalculateAmount();

    let model: RemoveStock_AddModel = {
      RemoveStockID: this.RemoveStockID ?? 0,
      RemoveStockNo: this.VoucherNo ?? "",
      RemoveStockDate: this.VoucherDate ? this.VoucherDate : new Date(),
      BrandID: this.BrandID ?? 0,
      Remarks: this.Remarks ?? "",
      TotalQty: this.TotalQty ?? 0,
      Items: Items
    };

    this.removeStockService.Create(model).subscribe(
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

    this.RemoveStockID = 0;
    this.VoucherNo = "";
    this.VoucherDate = new Date();
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


}

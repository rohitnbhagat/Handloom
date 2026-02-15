import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Select2Data, Select2DataOption, Select2Option } from '../../../Models/select2';
import { ProductService } from '../../../services/Masters/product.service';
import { HSNCodeService } from '../../../services/Masters/hSNCode.service';
import { forkJoin, Observable, of } from 'rxjs';

@Component({
  selector: 'app-insertstock-add-product',
  templateUrl: './insertstock-add-product.component.html',
  styleUrl: './insertstock-add-product.component.css'
})
export class InsertStockAddProductComponent implements AfterViewInit {

  IsAddNew: boolean = false;
  selectedProduct: any;
  ID: number = 0;
  SrNo: number = 0;
  ParentProductID: number = 0;
  ProductID: number = 0;
  HSNCodeID: number = 0;
  HSNCodeName:string = "";
  Qty: number = 1;
  ImageSrc: string = "";
  Remarks: string = "";
  AttributeValues: { ProductAttributeID: number, ProductAttributeValueID: number, Name: string, Option: string }[] = [];
  IsDisabled: boolean = false;

  @Output() BackEvent = new EventEmitter<void>();
  @Output() SaveEvent = new EventEmitter<{
    ID: number,
    SrNo: number,
    ParentProductID: number,
    ProductID: number,
    sku: string,
    ProductName: string,
    AttributeValues: {
      ProductAttributeID: number,
      ProductAttributeValueID: number,
      Name: string,
      Option: string
    }[],
    Qty: number,
    HSNCodeID: number,
    HSNCodeName: string,
    Remarks: string,
    Photo: string
  }>();
  lstParentProducts: any[] = [];
  lstProducts: any[] = [];
  lstProductAttributes: any[] = [];
  lstProductAttributeValues: any[] = [];
  lstHSNCode: any[] = [];

  constructor(private toastr: ToastrService,
    private productService: ProductService,
    private hSNCodeService: HSNCodeService
  ) {

  }
  ngAfterViewInit(): void {
    this.FillParentProduct();
    this.FillHSNCode();
  }

  async OpenProduct(product: any) {
    this.IsAddNew = true;
    if (product) {
      this.ID = product.ID;
      this.SrNo = product.SrNo;
      this.ParentProductID = product.ParentProductID;
      this.ProductID = product.ProductID;
      if(product.SalesOrderItemID && product.SalesOrderItemID > 0)
      {
        this.IsDisabled = true;
      }

      const results = await Promise.all([
        await this.FillProduct_Attribute(),
        await this.FillProduct_AttributeValue(),
        
      ]);

      this.AttributeValues = product.AttributeValues;

      const results1 = await Promise.all([
        await this.FillProduct(this.ProductID)
      ]);

      this.Qty = product.Qty;
      this.HSNCodeID = product.HSNCodeID;
      this.HSNCodeName = product.HSNCodeName;
      this.Remarks = product.Remarks;
    }
    else{

      this.ID = 0;
      this.SrNo = 0;
      this.ParentProductID = 0;
      this.ProductID = 0;
      this.Qty = 1;
      this.AttributeValues = [];
      this.selectedProduct = null;
      this.lstProductAttributes = [];
      this.lstProductAttributeValues = [];
      this.ImageSrc = "";
      this.HSNCodeID = 0;
      this.HSNCodeName = "";
      this.Remarks = "";
    }
  }

  BackProduct() {
    this.IsAddNew = false;
    this.BackEvent.emit();
  }

  FillParentProduct() {
    const model = {
      ProductID: 0,
      ParentProductID: 0,
      ProductType: 1,
      ProductName: "",
      ProductAttributeIDs: '',
      ProductAttributeValueIDs: '',
      ProductIDs: ''
    }

    this.productService.Get(model).then(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstParentProducts = a.map((prod) => ({
          value: prod.ProductID,
          label: prod.name,
          data: prod,
        }));

        this.lstParentProducts.unshift({
          value: 0,
          label: "Please Select",
          data: { ProductID: 0, name: "Please Select" },
        });

      }

    });
  }

  FillHSNCode() {
    this.hSNCodeService.Get(0).subscribe(users => {

      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const a: any[] = d.data;

        this.lstHSNCode = a.map((prod) => ({
          value: prod.HSNCodeID,
          label: prod.HSNCodeName,
          data: prod,
        }));

        this.lstHSNCode.unshift({
          value: 0,
          label: "Please Select",
          data: { HSNCodeID: 0, HSNCodeName: "Please Select" },
        });

      }

    });
  }

  HSNSelectionChange(event:any){
    if (event && event.options) {
      this.HSNCodeID = event.options[0].data.HSNCodeID;
      this.HSNCodeName = (this.HSNCodeID == 0) ? "" : event.options[0].data.HSNCodeName;
    }
  }

  ProductSelectionChange(event: any) {
    if (event && event.options) {
      if (this.ParentProductID != event.options[0].data.ProductID) {
        this.ParentProductID = event.options[0].data.ProductID;
        this.ImageSrc = event.options[0].data.Photo;

        this.AttributeValues = [];
        this.selectedProduct = null;
        this.ProductID = 0;

        this.FillProduct_Attribute();
        this.FillProduct_AttributeValue();
      }
    }
  }

  async FillProduct_Attribute() {
    console.log("FillProduct_Attribute Start");
    if (this.ParentProductID > 0) {
      await this.productService.GetAttribute(this.ParentProductID, 0).then(users => {
        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '', {
            enableHtml: true,
            closeButton: true
          });
        }
        else {
          this.lstProductAttributes = d.data;
        }
        console.log("FillProduct_Attribute Complete");
      });
    }
    else {
      this.lstProductAttributes = []
    }
    console.log("FillProduct_Attribute End");
  }

  async FillProduct_AttributeValue() {
    if (this.ParentProductID > 0) {
      await this.productService.GetAttributeValue(this.ParentProductID, 0, 0).then(users => {
        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '', {
            enableHtml: true,
            closeButton: true
          });
        }
        else {
          this.lstProductAttributeValues = d.data;
        }
      });
    }
    else {
      this.lstProductAttributeValues = [];
    }
  }

  GetProduct_AttributeValue(ProductAttributeID: number) {
    return this.lstProductAttributeValues.filter(t => t.ProductAttributeID == ProductAttributeID);
  }

  Attribute_SelectionChange(att: any, att_V: any) {
    if (att && att_V) {
      //(att.ProductAttributeID, att_V.ProductAttributeValueID)
      if (this.AttributeValues.some(t => t.ProductAttributeID == att.ProductAttributeID && t.ProductAttributeValueID == att_V.ProductAttributeValueID))
        this.AttributeValues = this.AttributeValues.filter(t => t.ProductAttributeValueID != att_V.ProductAttributeValueID);
      else {
        this.AttributeValues = this.AttributeValues.filter(t => t.ProductAttributeID != att.ProductAttributeID);
        this.AttributeValues.push({
          ProductAttributeID: att.ProductAttributeID,
          ProductAttributeValueID: att_V.ProductAttributeValueID,
          Name: att.Name,
          Option: att_V.option
        });
      }
      this.FillProduct();
    }
  }

  getAttributeSelectionClass(attID: number, attrValueID: number) {
    return this.AttributeValues.some(t => t.ProductAttributeID == attID && t.ProductAttributeValueID == attrValueID) ? "btn-danger" : "btn-success";
  }

  async FillProduct(pid: number = 0) {
    this.lstProducts = [];
    if (this.lstProductAttributes.length == this.AttributeValues.length) {
      const ProductAttributeIDs = [...new Set(this.AttributeValues.map(item => item.ProductAttributeID))].join(',');
      const ProductAttributeValueIDs = [...new Set(this.AttributeValues.map(item => item.ProductAttributeValueID))].join(',');
      const model = {
        ProductID: pid,
        ParentProductID: this.ParentProductID,
        ProductType: 2,
        ProductName: "",
        ProductAttributeIDs: (pid > 0) ? "" : ProductAttributeIDs,
        ProductAttributeValueIDs: (pid > 0) ? "" : ProductAttributeValueIDs,
        ProductIDs: ''
      }
      await this.productService.Get(model).then(users => {

        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '', {
            enableHtml: true,
            closeButton: true
          });
        }
        else {
          this.lstProducts = d.data;
          if (this.lstProducts.length > 0) {
            this.selectedProduct = this.lstProducts[0];
            this.ProductID = this.selectedProduct.ProductID;
            this.ImageSrc = this.selectedProduct.Photo;
          }
        }
      });
    }
    else {
      this.selectedProduct = null;
      this.ProductID = 0;
    }
  }


  SaveProduct(isClose:boolean) {

    if (this.ParentProductID <= 0) {
      this.toastr.error("Please select product.", '', { enableHtml: true, closeButton: true });
      return;
    }
    else if (this.ProductID <= 0 || !this.selectedProduct) {
      this.toastr.error("Please select attribute.", '', { enableHtml: true, closeButton: true });
      return;
    }
    else if (this.Qty <= 0) {
      this.toastr.error("Please enter qty.", '', { enableHtml: true, closeButton: true });
      return;
    }
    else {

      let ProductDetail: {
        ID: number,
        SrNo: number,
        ParentProductID: number,
        ProductID: number,
        sku: string,
        ProductName: string,
        AttributeValues: {
          ProductAttributeID: number,
          ProductAttributeValueID: number,
          Name: string,
          Option: string
        }[],
        Qty: number,
        HSNCodeID: number,
        HSNCodeName: string,
        Remarks: string,
        Photo: string
      } = {
        ID: this.ID,
        SrNo: this.SrNo,
        ParentProductID: this.ParentProductID,
        ProductID: this.ProductID,
        sku: this.selectedProduct.sku,
        ProductName: this.selectedProduct.name,
        AttributeValues: this.AttributeValues,
        Qty: this.Qty,
        HSNCodeID: this.HSNCodeID,
        HSNCodeName: this.HSNCodeName,
        Remarks: this.Remarks,
        Photo: this.ImageSrc
      };
      this.SaveEvent.emit(ProductDetail);
      if(isClose)
      {
      this.IsAddNew = false;
      }
      else
      {
      this.ID = 0;
      this.SrNo = 0;
      this.ProductID = 0;
      this.Qty = 1;
      this.selectedProduct = null;
      this.HSNCodeID = 0;
      this.HSNCodeName = "";
      this.Remarks = "";
      }
    }

  }

}

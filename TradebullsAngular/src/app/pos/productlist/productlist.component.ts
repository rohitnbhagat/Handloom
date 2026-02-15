import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/Masters/product.service';
import { ToastrService } from 'ngx-toastr';
import { HSNCodeService } from '../../services/Masters/hSNCode.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css'
})
export class ProductlistComponent implements OnInit {
  lstParentProducts: any[] = [];
  lstProductAttributes: any[] = [];
  lstProductAttributeValues: any[] = [];
  lstHSNCode: any[] = [];

  strProductFilter: string = "";
  SelectedParentProductID: number = 0;
  SelectedParentProduct:any = null;
  AttributeValues: { ProductAttributeID: number, ProductAttributeValueID: number, Name: string, Option: string }[] = [];
  IsAddNew: boolean = false;
  ProductID: number = 0;
  HSNCodeID: number = 0;
  HSNCodeName:string = "";
  Qty: number = 1;
  Price: number = 0;
  ImageSrc: string = "";
  Remarks: string = "";
  selectedProduct: any;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private hSNCodeService: HSNCodeService
  ){}

  ngOnInit(): void {
    this.FillParentProduct();  
    this.FillHSNCode();
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
        this.lstParentProducts = d.data;
      }

    });
  }

  async FillProduct_Attribute() {
    console.log("FillProduct_Attribute Start");
    if (this.SelectedParentProductID > 0) {
      await this.productService.GetAttribute(this.SelectedParentProductID, 0).then(users => {
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
    if (this.SelectedParentProductID > 0) {
      await this.productService.GetAttributeValue(this.SelectedParentProductID, 0, 0).then(users => {
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
  
  async ProductSelected(product:any){
    alert(product.name);
    this.SelectedParentProductID = product.ProductID;
    this.SelectedParentProduct = product;
    await this.FillProduct_Attribute();
    await this.FillProduct_AttributeValue();
    this.IsAddNew = true;
  }
  BackProduct(){
    this.IsAddNew = false;
  }
  GetProduct_AttributeValue(ProductAttributeID: number) {
    return this.lstProductAttributeValues.filter(t => t.ProductAttributeID == ProductAttributeID);
  }
  getAttributeSelectionClass(attID: number, attrValueID: number) {
    return this.AttributeValues.some(t => t.ProductAttributeID == attID && t.ProductAttributeValueID == attrValueID) ? "btn-danger" : "btn-success";
  }
  Attribute_SelectionChange(att: any, att_V: any) {
    if (att && att_V) {
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
  async FillProduct(pid: number = 0) {
    let lstProducts = [];
    if (this.lstProductAttributes.length == this.AttributeValues.length) {
      const ProductAttributeIDs = [...new Set(this.AttributeValues.map(item => item.ProductAttributeID))].join(',');
      const ProductAttributeValueIDs = [...new Set(this.AttributeValues.map(item => item.ProductAttributeValueID))].join(',');
      const model = {
        ProductID: pid,
        ParentProductID: this.SelectedParentProductID,
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
          lstProducts = d.data;
          if (lstProducts.length > 0) {
            this.selectedProduct = lstProducts[0];
            this.ProductID = this.selectedProduct.ProductID;
            this.Price = this.selectedProduct.price;
            this.ImageSrc = this.selectedProduct.Photo;
          }
        }
      });
    }
    else {
      this.selectedProduct = null;
      this.ProductID = 0;
      this.Price = 0;
    }
  }

  HSNSelectionChange(event:any){
    if (event && event.options) {
      this.HSNCodeID = event.options[0].data.HSNCodeID;
      this.HSNCodeName = (this.HSNCodeID == 0) ? "" : event.options[0].data.HSNCodeName;
    }
  }
  GetTotalAmount(): number {
    return (this.Qty == 0 || this.Price == 0) ? 0 : this.Qty * this.Price;
  }
}

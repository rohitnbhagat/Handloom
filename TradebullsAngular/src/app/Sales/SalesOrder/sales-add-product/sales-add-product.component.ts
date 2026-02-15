import { Component, OnInit, AfterViewInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Select2Data, Select2DataOption, Select2Option } from '../../../Models/select2';
import { ProductService } from '../../../services/Masters/product.service';
import { HSNCodeService } from '../../../services/Masters/hSNCode.service';
import { BrandService } from '../../../services/Masters/brand.service';
import { forkJoin, Observable, of } from 'rxjs';
import { StockService } from '../../../services/Sales/stock.service';
import { Stock_FilterModel, Stock_ViewModel, Stock_View_response_Model, Stock_Used_ViewModel } from '../../../Models/Sales/StockModel';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-sales-add-product',
  templateUrl: './sales-add-product.component.html',
  styleUrl: './sales-add-product.component.css'
})
export class SalesAddProductComponent implements AfterViewInit {

  @Input() IsStock: boolean = false;
  OpenStock: boolean = false;
  BrandID: number = 0;
  IsAddNew: boolean = false;
  selectedProduct: any;
  ID: number = 0;
  SrNo: number = 0;
  ParentProductID: number = 0;
  ProductID: number = 0;
  HSNCodeID: number = 0;
  HSNCodeName: string = "";
  Qty: number = 1;
  Price: number = 0;
  ImageSrc: string = "";
  Remarks: string = "";
  AttributeValues: { ProductAttributeID: number, ProductAttributeValueID: number, Name: string, Option: string }[] = [];
  IsDisabled: boolean = false;
  lstBrands: any[] = [];
  TransID: number = 0;
  TransType: string = "";

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
    Price: number,
    TotalAmount: number,
    HSNCodeID: number,
    HSNCodeName: string,
    Remarks: string,
    Photo: string,
    Stock: Stock_Used_ViewModel[]
  }>();
  lstParentProducts: any[] = [];
  lstProducts: any[] = [];
  lstProductAttributes: any[] = [];
  lstProductAttributeValues: any[] = [];
  lstHSNCode: any[] = [];
  selectedStocks: Stock_Used_ViewModel[] = [];
  //lstStockItems: Stock_ViewModel[] = [];

  Stock_ParentProductID: number = 0;
  Stock_lstProductAttributes: any[] = [];
  Stock_lstProductAttributeValues: any[] = [];
  Stock_AttributeValues: { ProductAttributeID: number, ProductAttributeValueID: number, Name: string, Option: string }[] = [];
  Stock_lstProducts: any[] = [];

  constructor(private toastr: ToastrService,
    private productService: ProductService,
    private hSNCodeService: HSNCodeService,
    private stockService: StockService,
    private brandService: BrandService
  ) {

  }
  ngAfterViewInit(): void {
    this.FillParentProduct();
    this.FillHSNCode();
    this.FillBrand();
  }

  async OpenProduct(product: any, brandID: number, transID: number, transType: string) {
    this.IsAddNew = true;
    this.BrandID = brandID;
    this.TransID = transID;
    this.TransType = transType;

    if (product) {
      this.ID = product.ID;
      this.SrNo = product.SrNo;
      this.ParentProductID = product.ParentProductID;
      this.ProductID = product.ProductID;
      if (product.SalesOrderItemID && product.SalesOrderItemID > 0) {
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
      this.Price = product.Price;
      this.HSNCodeID = product.HSNCodeID;
      this.HSNCodeName = product.HSNCodeName;
      this.Remarks = product.Remarks;
      this.selectedStocks = product.Stock
      //this.FillStock();
    }
    else {

      this.ID = 0;
      this.SrNo = 0;
      this.ParentProductID = 0;
      this.ProductID = 0;
      this.Qty = 1;
      this.Price = 0;
      this.AttributeValues = [];
      this.selectedProduct = null;
      this.lstProductAttributes = [];
      this.lstProductAttributeValues = [];
      this.ImageSrc = "";
      this.HSNCodeID = 0;
      this.HSNCodeName = "";
      this.Remarks = "";

      this.Stock_ParentProductID = 0;
      this.Stock_AttributeValues = [];
      this.Stock_lstProductAttributes = [];
      this.Stock_lstProductAttributeValues = [];
      this.selectedStocks = [];
      //this.lstStockItems = [];
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

  HSNSelectionChange(event: any) {
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
        this.Price = 0;
        //this.lstStockItems = [];

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
            this.Price = this.selectedProduct.price;
            this.ImageSrc = this.selectedProduct.Photo;

            //this.FillStock();
          }
        }
      });
    }
    else {
      this.selectedProduct = null;
      this.ProductID = 0;
      this.Price = 0;
      //this.lstStockItems = [];
    }
  }

  GetTotalAmount(): number {
    return (this.Qty == 0 || this.Price == 0) ? 0 : this.Qty * this.Price;
  }

  SaveProduct(isClose: boolean) {

    if (this.ParentProductID <= 0) {
      this.toastr.error("Please select product.", '', { enableHtml: true, closeButton: true });
      return;
    }
    else if (this.ProductID <= 0 || !this.selectedProduct) {
      this.toastr.error("Please select attribute.", '', { enableHtml: true, closeButton: true });
      return;
    }
    else if (this.Price <= 0) {
      this.toastr.error("Please enter price.", '', { enableHtml: true, closeButton: true });
      return;
    }
    else if (this.Qty <= 0) {
      this.toastr.error("Please enter qty.", '', { enableHtml: true, closeButton: true });
      return;
    }
    else if (this.IsStock == true) {
      const stockqty = this.GetTotalStockQty();
      if (stockqty <= 0) {
        this.toastr.error("Please select stock.", '', { enableHtml: true, closeButton: true });
        return;
      }
      else if (this.Qty < stockqty) {
        this.toastr.error("Order qty should not be less then total stock qty.", '', { enableHtml: true, closeButton: true });
        return;
      }
      else if (this.Qty > stockqty) {
        this.toastr.error("Total stock qty should not be less then order qty.", '', { enableHtml: true, closeButton: true });
        return;
      }
    }


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
      Price: number,
      TotalAmount: number,
      HSNCodeID: number,
      HSNCodeName: string,
      Remarks: string,
      Photo: string,
      Stock: Stock_Used_ViewModel[]
    } = {
      ID: this.ID,
      SrNo: this.SrNo,
      ParentProductID: this.ParentProductID,
      ProductID: this.ProductID,
      sku: this.selectedProduct.sku,
      ProductName: this.selectedProduct.name,
      AttributeValues: this.AttributeValues,
      Qty: this.Qty,
      Price: this.Price,
      TotalAmount: this.GetTotalAmount(),
      HSNCodeID: this.HSNCodeID,
      HSNCodeName: this.HSNCodeName,
      Remarks: this.Remarks,
      Photo: this.ImageSrc,
      Stock: this.selectedStocks
    };
    this.SaveEvent.emit(ProductDetail);
    if (isClose) {
      this.IsAddNew = false;
    }
    else {
      this.ID = 0;
      this.SrNo = 0;
      this.ProductID = 0;
      this.Qty = 1;
      this.Price = 0;
      this.selectedProduct = null;
      this.HSNCodeID = 0;
      this.HSNCodeName = "";
      this.Remarks = "";

      this.Stock_ParentProductID = 0;
      this.Stock_AttributeValues = [];
      this.Stock_lstProductAttributes = [];
      this.Stock_lstProductAttributeValues = [];
      this.selectedStocks = [];
      //this.lstStockItems = [];
    }

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
  Stock_ProductSelectionChange(event: any) {
    if (event && event.options) {
      if (this.Stock_ParentProductID != event.options[0].data.ProductID) {
        this.Stock_ParentProductID = event.options[0].data.ProductID;

        this.Stock_AttributeValues = [];

        this.Stock_FillProduct_Attribute();
        this.Stock_FillProduct_AttributeValue();
        this.Stock_FillProduct();
      }
    }
  }
  async Stock_FillProduct_Attribute() {
    console.log("Stock_FillProduct_Attribute Start");
    if (this.ParentProductID > 0) {
      await this.productService.GetAttribute(this.Stock_ParentProductID, 0).then(users => {
        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '', {
            enableHtml: true,
            closeButton: true
          });
        }
        else {
          this.Stock_lstProductAttributes = d.data;
        }
        console.log("Stock_FillProduct_Attribute Complete");
      });
    }
    else {
      this.Stock_lstProductAttributes = []
    }
    console.log("Stock_FillProduct_Attribute End");
  }
  Stock_getAttributeSelectionClass(attID: number, attrValueID: number) {
    return this.Stock_AttributeValues.some(t => t.ProductAttributeID == attID && t.ProductAttributeValueID == attrValueID) ? "btn-danger" : "btn-success";
  }
  async Stock_FillProduct_AttributeValue() {
    if (this.Stock_ParentProductID > 0) {
      await this.productService.GetAttributeValue(this.Stock_ParentProductID, 0, 0).then(users => {
        let d: any = users;
        if (!d.success) {
          this.toastr.error(d.message, '', {
            enableHtml: true,
            closeButton: true
          });
        }
        else {
          this.Stock_lstProductAttributeValues = d.data;
        }
      });
    }
    else {
      this.Stock_lstProductAttributeValues = [];
    }
  }
  Stock_GetProduct_AttributeValue(ProductAttributeID: number) {
    return this.Stock_lstProductAttributeValues.filter(t => t.ProductAttributeID == ProductAttributeID);
  }
  Stock_Attribute_SelectionChange(att: any, att_V: any) {
    if (att && att_V) {
      if (this.Stock_AttributeValues.some(t => t.ProductAttributeID == att.ProductAttributeID && t.ProductAttributeValueID == att_V.ProductAttributeValueID))
        this.Stock_AttributeValues = this.Stock_AttributeValues.filter(t => t.ProductAttributeValueID != att_V.ProductAttributeValueID);
      else {
        this.Stock_AttributeValues = this.Stock_AttributeValues.filter(t => t.ProductAttributeID != att.ProductAttributeID);
        this.Stock_AttributeValues.push({
          ProductAttributeID: att.ProductAttributeID,
          ProductAttributeValueID: att_V.ProductAttributeValueID,
          Name: att.Name,
          Option: att_V.option
        });
      }
      this.Stock_FillProduct();
    }
  }
  async Stock_FillProduct(pid: number = 0) {
    this.Stock_lstProducts = [];

    const ProductAttributeIDs = [...new Set(this.Stock_AttributeValues.map(item => item.ProductAttributeID))].join(',');
    const ProductAttributeValueIDs = [...new Set(this.Stock_AttributeValues.map(item => item.ProductAttributeValueID))].join(',');
    const model = {
      ProductID: pid,
      ParentProductID: this.Stock_ParentProductID,
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
        this.Stock_lstProducts = d.data;
        const ProductIDs = [...new Set(this.Stock_lstProducts.map(item => item.ProductID))].join(',');

        const filter: Stock_FilterModel = {
          BrandID: this.BrandID,
          ParentProductID: 0,
          ProductID: 0,
          ProductName: "",
          Sku: "",
          ProductIDs: ProductIDs,
          TransID: this.TransID,
          TransType: this.TransType,
          Remarks: this.Remarks,
          IsRemarks: -1
        };
        this.Stock_lstProducts = [];

        this.stockService.Get(filter).then(
          (res: any) => {
            const response: Stock_View_response_Model = res;
            if (!response.success || response.data == null) {
              this.toastr.error(response.message, '', {
                enableHtml: true,
                closeButton: true
              });
            }
            else {
              this.Stock_lstProducts = response.data.map((data: Stock_ViewModel) => ({
                StockItemID: data.StockItemID,
                BrandID: data.BrandID,
                BrandName: data.BrandName,
                ProductID: data.ProductID,
                ParentProductID: data.ParentProductID,
                SKU: data.SKU,
                ProductName: data.ProductName,
                Remarks: data.Remarks,
                Qty: data.Qty,
                UsedQty: this.selectedStocks.filter(t => t.StockItemID == data.StockItemID).reduce((sum, element) => sum + element.Qty, 0)
              }));

            }
          }
        );

      }
    });


  }
  OpenStockModel() {
    this.Stock_ParentProductID = this.ParentProductID;
    this.Stock_AttributeValues = [];
    this.Stock_lstProductAttributes = [];
    this.Stock_lstProductAttributeValues = [];
    this.Stock_lstProducts = [];
    this.Stock_FillProduct_Attribute();
    this.Stock_FillProduct_AttributeValue();
    this.Stock_FillProduct();
    this.OpenStock = true;
  }
  CloseStockModel(Save: boolean) {
    this.Stock_ParentProductID = 0;
    this.Stock_lstProductAttributes = [];
    this.Stock_lstProductAttributeValues = [];
    this.Stock_AttributeValues = [];
    this.Stock_lstProducts = [];
    this.OpenStock = false;
  }
  AddStock(item: any) {
    if (item.UsedQty <= 0) {
      alert("Used Qty should not be less then or equals to 0.");
      return;
    }
    if (item.UsedQty > item.Qty) {
      alert("Used Qty should not be greater then Stock Qty.");
      return;
    }
    if (this.selectedStocks.length > 0) {
      this.selectedStocks = this.selectedStocks.filter(t => t.StockItemID != item.StockItemID);
    }
    this.selectedStocks.push({
      StockItemID: item.StockItemID,
      BrandID: item.BrandID,
      BrandName: item.BrandName,
      ProductID: item.ProductID,
      ParentProductID: item.ParentProductID,
      SKU: item.SKU,
      ProductName: item.ProductName,
      Remarks: item.Remarks,
      Qty: item.UsedQty
    });

  }
  DeleteStock(item: any) {
    if (this.selectedStocks.length > 0) {
      this.selectedStocks = this.selectedStocks.filter(t => t.StockItemID != item.StockItemID);
    }
  }
  GetTotalStockQty(): number {
    let total = this.selectedStocks.reduce((sum, element) => sum + element.Qty, 0);
    return total;
  }
  BrandDropdownSelectionChange(event: MatSelectChange) {
    this.Stock_FillProduct();
  }

  AutoStockDeduct() {
    this.selectedStocks = [];

    const filter: Stock_FilterModel = {
      BrandID: 0,
      ParentProductID: 0,
      ProductID: this.ProductID,
      ProductName: "",
      Sku: "",
      ProductIDs: "",
      TransID: this.TransID,
      TransType: this.TransType,
      Remarks: this.Remarks,
      IsRemarks: 1
    };
    let lstStocks: Stock_ViewModel[] = [];

    this.stockService.Get(filter).then(
      (res: any) => {
        const response: Stock_View_response_Model = res;
        if (!response.success || response.data == null) {
          this.toastr.error(response.message, '', {
            enableHtml: true,
            closeButton: true
          });
        }
        else {
          lstStocks = response.data.map((data: Stock_ViewModel) => ({
            StockItemID: data.StockItemID,
            BrandID: data.BrandID,
            BrandName: data.BrandName,
            ProductID: data.ProductID,
            ParentProductID: data.ParentProductID,
            SKU: data.SKU,
            ProductName: data.ProductName,
            Remarks: data.Remarks,
            Qty: data.Qty,
            UsedQty: 0
          }));

        }
      }
    ).finally( ()=> {

        let totalQty = this.Qty;
        let totalAllocatedQty = this.Qty;
        let q: number = 0;

        if(lstStocks.length > 0){
            lstStocks.filter(t=>t.BrandID == this.BrandID).forEach( i => {
              q = 0;
              if(totalAllocatedQty > 0)
              {
                if(i.Qty <= totalAllocatedQty){
                  q = i.Qty;
                }
                else{
                  q = totalAllocatedQty;
                }
                if(q > 0){
                  this.selectedStocks.push({
                  StockItemID: i.StockItemID,
                  BrandID: i.BrandID,
                  BrandName: i.BrandName,
                  ProductID: i.ProductID,
                  ParentProductID: i.ParentProductID,
                  SKU: i.SKU,
                  ProductName: i.ProductName,
                  Remarks: i.Remarks,
                  Qty: q
                });
                totalAllocatedQty = totalAllocatedQty - q;
                }

              }

            });
            lstStocks.filter(t=>t.BrandID != this.BrandID).forEach( i => {
              q = 0;
              if(totalAllocatedQty > 0)
              {

                if(i.Qty <= totalAllocatedQty){
                  q = i.Qty;
                }
                else{
                  q = totalAllocatedQty;
                }
                if(q > 0){
                  this.selectedStocks.push({
                  StockItemID: i.StockItemID,
                  BrandID: i.BrandID,
                  BrandName: i.BrandName,
                  ProductID: i.ProductID,
                  ParentProductID: i.ParentProductID,
                  SKU: i.SKU,
                  ProductName: i.ProductName,
                  Remarks: i.Remarks,
                  Qty: q
                });
                totalAllocatedQty = totalAllocatedQty - q;
                }

              }

            });
        }
    });

  }

}

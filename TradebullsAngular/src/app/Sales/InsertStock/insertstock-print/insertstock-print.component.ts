import { Component, OnInit, AfterContentInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InsertStockService } from '../../../services/Sales/insertstock.service';
import { ToastrService } from 'ngx-toastr';
import { InsertStock_AddModel, InsertStock_Item_AddModel, InsertStock_Item } from '../../../Models/Sales/InsertStockModel';
import { LabelprintsettinsService } from '../../../services/Masters/labelprintsettins.service';
import { MatSelectChange } from '@angular/material/select';
import { BrandService } from '../../../services/Masters/brand.service';

declare var JsBarcode: any;

@Component({
  selector: 'app-insertstock-print',
  templateUrl: './insertstock-print.component.html',
  styleUrl: './insertstock-print.component.css'
})
export class InsertStockPrintComponent implements OnInit, AfterContentInit, AfterViewInit {

  SettingID: number = 0;
  IsOpen: boolean = false;
  isModalOpen: boolean = false;
  barcodeValue = '1234567890';
  lstPrinterSettings: {
    SettingID: number,
    SettingName: string,
    printerDPI: string,
    width: string,
    height: string,
    columns: number,
    columnSpace: string,
    rowSpace: string
  }[] = [];
  IsPicVisible: boolean = true;

  @Output() BackEvent = new EventEmitter<void>();
  PrintType: number = 1;
  InsertStockID: number = 0;
  VoucherNo: string = "";
  VoucherDate: Date | null = null;
  PartyID: number = 0;
  PartyName: string = "";
  BrandID: number = 0;
  BrandName: string = "";
  Remarks: string = "";
  ParentProductDetails: any[] = [];
  ProductDetails: InsertStock_Item[] = [];
  Brand:any = null;

  PrintSetting: {
    printerDPI: string,
    width: string,
    height: string,
    columns: number,
    columnSpace: string,
    rowSpace: string
  } = {
      printerDPI: '203',
      width: '50mm',
      height: '25mm',
      columns: 2,
      columnSpace: '2mm',
      rowSpace: '2mm'
    };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private insertStockService: InsertStockService,
    private toastr: ToastrService,
    private labelprintsettinsService: LabelprintsettinsService,
    private brandService: BrandService
  ) { }
  ngAfterViewInit(): void {

  }
  ngAfterContentInit(): void {
    //this.OpenSalesOrder();
  }

  ngOnInit(): void {
    this.labelprintsettinsService.Get(0).subscribe(users => {
      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.lstPrinterSettings = d.data.map((element: any) => ({
          SettingID: element.SettingID,
          SettingName: element.SettingName,
          printerDPI: element.printerDPI,
          width: element.width + "mm",
          height: element.height + "mm",
          columns: element.columns,
          columnSpace: element.columnSpace + "mm",
          rowSpace: element.rowSpace + "mm"
        }));
        if (this.lstPrinterSettings.length > 0) {
          this.SettingID = this.lstPrinterSettings[0].SettingID;
          this.PrintSetting = {
            printerDPI: this.lstPrinterSettings[0].printerDPI,
            width: this.lstPrinterSettings[0].width,
            height: this.lstPrinterSettings[0].height,
            columns: this.lstPrinterSettings[0].columns,
            columnSpace: this.lstPrinterSettings[0].columnSpace,
            rowSpace: this.lstPrinterSettings[0].rowSpace
          }
        }

      }

    });
  }
  CloseModel() {
    this.isModalOpen = false;
    this.IsOpen = false;
    this.BackEvent.emit();
  }
  BacktoList() {
    this.IsOpen = false;
    this.BackEvent.emit();
  }

  btnOkay_Click() {
    this.IsOpen = true;
    this.isModalOpen = false;
  }

  OpenSalesOrder(SID: number) {
    this.isModalOpen = true;
    this.InsertStockID = SID;
    if (this.InsertStockID > 0) {
      const model: {
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
      this.insertStockService.Get(model).then(
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
              this.VoucherDate = order.InsertStockDate;
              this.PartyID = order.PartyID;
              this.PartyName = order.PartyName;
               this.BrandID = order.BrandID;
              this.BrandName = order.BrandName;
              this.Remarks = order.Remarks;
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

                    

                    this.ParentProductDetails = responseDetail.ParentProduct.map(
                      (t: any) => (
                        {
                          SrNo: t.SrNo,
                          ProductID: t.ProductID,
                          ProductName: t.ProductName,
                          Qty: t.Qty,
                          Photo: t.Photo
                        }
                      )
                    );
                  }
                }
              );

              this.brandService.Get(this.BrandID).subscribe(users => {

                let d: any = users;
                if (!d.success) {
                  this.toastr.error(d.message, '', {
                    enableHtml: true,
                    closeButton: true
                  });
                }
                else {
                  const a: any[] = d.data;
                  if(a)
                    this.Brand = a[0];
                }

              });


            }
          }

        });
    }
  }

  

  GetTotalQty(): number {
    const TotalQty = this.ProductDetails.reduce((sum, element) => sum + element.Qty, 0);
    return TotalQty;
  }

  GetProductDetails(ProductID: number): InsertStock_Item[] {
    const filter = this.ProductDetails.filter(t => t.ParentProductID == ProductID);
    return filter;
  }

  Print(): void {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    // Get the content from the div
    const content = document.getElementById('contenttoprint')?.innerHTML;

    const iframeDocument = iframe.contentWindow?.document;
    iframeDocument?.open();
    iframeDocument?.write('<html><head><title>Print</title>');


    iframeDocument?.write('<link rel="stylesheet" href="../../styles.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/bootstrap/dist/css/bootstrap.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/font-awesome/css/font-awesome.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/nprogress/nprogress.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/iCheck/skins/flat/green.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/google-code-prettify/bin/prettify.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/select2/dist/css/select2.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/switchery/dist/switchery.min.cs" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/starrr/dist/starrr.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/jqvmap/dist/jqvmap.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/bootstrap-daterangepicker/daterangepicker.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/vendors/animate.css/animate.min.css" type="text/css">');
    iframeDocument?.write('<link rel="stylesheet" href="../../assets/build/css/custom.css" type="text/css">');

    // let strScript: string = "<script>";
    //  strScript = strScript + "window.onload = function() { window.print(); window.close();};";
    //  strScript = strScript + "</script>";
    //  iframeDocument?.write(strScript);

    if (this.PrintType == 2) {
      let strStyle: string = "<style>";
      strStyle = strStyle + "body{background:red;}";
      strStyle = strStyle + "@media print {";
      strStyle = strStyle + "@page {size: " + this.PrintSetting.width + " " + this.PrintSetting.height + ";padding:0px;margin: 0px;}";
      strStyle = strStyle + "}";
      strStyle = strStyle + "</style>";
      iframeDocument?.write(strStyle);
    }
    // else
    // {
    //   let strStyle: string = "<style>";
    //   strStyle = strStyle + "body{background:red;}";
    //   strStyle = strStyle + "@media print {";
    //   strStyle = strStyle + "@page {size: "+ this.PrintSetting.width + " " + this.PrintSetting.height +";padding:0px;margin: 0px;}";
    //   strStyle = strStyle + "}";
    //   strStyle = strStyle + "</style>";
    //   iframeDocument?.write(strStyle);
    // }

    iframeDocument?.write('</head><body>');
    if (this.PrintType != 2)
      iframeDocument?.write('<div class="container body"><div class="main_container"><div class="right_col m-0 p-0">');
    iframeDocument?.write(content || '');
    if (this.PrintType != 2)
      iframeDocument?.write('</div></div></div>');
    iframeDocument?.write('</body></html>');
    iframeDocument?.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();  // Ensure the iframe has focus
      iframe.contentWindow?.print();  // Trigger print dialog
      document.body.removeChild(iframe);  // Clean up by removing iframe after print
    };

  }

  forloop(num: number): number[] {
    let row: number[] = [];
    for (let i = 0; i < num; i++) {
      row.push(i);
    }
    return row;
  }

  DropdownSelectionChange(event: MatSelectChange) {
    this.SettingID = event.value;
    this.lstPrinterSettings.filter(t => t.SettingID == event.value).forEach(
      (data: any) => {
        this.PrintSetting = {
          printerDPI: data.printerDPI,
          width: data.width,
          height: data.height,
          columns: data.columns,
          columnSpace: data.columnSpace,
          rowSpace: data.rowSpace
        }
      }
    );

  }

  GetAddress(): string{
    let address: string = "";
    if(this.Brand)
      address = this.Brand.Remarks.replace(/\n/g, '<br>');
    return address;
  }

}

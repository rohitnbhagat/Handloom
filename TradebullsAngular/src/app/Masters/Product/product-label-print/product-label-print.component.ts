import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../services/Masters/product.service';
import { LabelprintsettinsService } from '../../../services/Masters/labelprintsettins.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-product-label-print',
  templateUrl: './product-label-print.component.html',
  styleUrl: './product-label-print.component.css'
})
export class ProductLabelPrintComponent implements OnInit {

  SettingID: number = 0;
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
  PrintSetting: {
    printerDPI: string,
    width: string,
    height: string,
    columns: number,
    columnSpace: string,
    rowSpace: string
  }={
    printerDPI: '203',
    width: '50mm',
    height: '25mm',
    columns: 2,
    columnSpace: '2mm',
    rowSpace: '2mm'
  };

  ProductID: number = 0;
  lstParentProducts: any[] = [];
  lstProducts: any[] = [];
  isLoading:boolean = false;
  IsOpen: boolean = false;

constructor(private toastr: ToastrService,
    private productService: ProductService,
    private labelprintsettinsService: LabelprintsettinsService
  ) {
  }
  ngOnInit(): void {
    this.FillPrinter();
    this.FillParentProduct();
  }
  FillPrinter() {
    this.labelprintsettinsService.Get(0).subscribe(users => {
          let d: any = users;
          if (!d.success) {
            this.toastr.error(d.message, '', {
              enableHtml: true,
              closeButton: true
            });
          }
          else {
            this.lstPrinterSettings = d.data.map((element:any) => ({
              SettingID: element.SettingID,
              SettingName: element.SettingName,
              printerDPI: element.printerDPI,
              width: element.width + "mm",
              height: element.height + "mm",
              columns: element.columns,
              columnSpace: element.columnSpace + "mm",
              rowSpace: element.rowSpace + "mm"
            }));
            if( this.lstPrinterSettings.length > 0){
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

        

      }

    });
  }

  async ProductSelectionChange(event: any) {
    this.isLoading = true;
    await this.FillProduct();
    this.isLoading = false;
  }

  async FillProduct() {
    this.lstProducts = [];
    if(this.ProductID > 0)
    {
    const model = {
      ProductID: 0,
      ParentProductID: this.ProductID,
      ProductType: 2,
      ProductName: "",
      ProductAttributeIDs: '',
      ProductAttributeValueIDs: '',
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
        const a: any[] = d.data;

        this.lstProducts = a.map((prod) => ({
          data: prod,
          qty: 0
        }));

      }

    });
  }
  
  }
DropdownSelectionChange(event: MatSelectChange) {
      this.SettingID = event.value;
      this.lstPrinterSettings.filter(t=>t.SettingID == event.value).forEach(
        (data:any) => {
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
  forloop(num: number): number[] {
    let row:number[] = [];
    for (let i = 0; i < num; i++) {
      row.push(i);
    }
    return row;
  }


  Printing(){
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '90vw';
    iframe.style.height = '90vh';
    iframe.style.border = 'none';
    iframe.style.top = '0px';
    iframe.style.left = '2%';
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

    let strStyle: string = "<style>";
    strStyle = strStyle + "body{background:red;}";
    strStyle = strStyle + "@media print {";
    strStyle = strStyle + "@page {size: "+ this.PrintSetting.width + " " + this.PrintSetting.height +";padding:0px;margin: 0px;}";
    strStyle = strStyle + "}";
    strStyle = strStyle + "</style>";
    iframeDocument?.write(strStyle);

     iframeDocument?.write('</head><body style="background-color: transparent;padding:0;margin:0;">');
    //  iframeDocument?.write('<div class="container body"><div class="main_container"><div class="right_col m-0 p-0">');
     iframeDocument?.write(content || '');
    //  iframeDocument?.write('</div></div></div>');
     iframeDocument?.write('</body></html>');
     iframeDocument?.close();

     iframe.onload = () => {
      iframe.contentWindow?.focus();  // Ensure the iframe has focus
      iframe.contentWindow?.print();  // Trigger print dialog
      document.body.removeChild(iframe);  // Clean up by removing iframe after print
    };
  }

}

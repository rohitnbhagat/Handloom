import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../services/Masters/product.service';
import { LabelprintsettinsService } from '../../../services/Masters/labelprintsettins.service';
import { MatSelectChange } from '@angular/material/select';
import { ComponentService } from '../../../services/Masters/component.service';
import { ProcessService } from '../../../services/Masters/process.service';
import { ProductBOMService } from '../../../services/Masters/product-bom.service';
import { ProductBOM_AddModel, ProductBOM_Component_AddModel, ProductBOM_Process_AddModel } from '../../../Models/Masters/ProductBOMModel';

@Component({
  selector: 'app-product-bom-add',
  templateUrl: './product-bom-add.component.html',
  styleUrl: './product-bom-add.component.css'
})
export class ProductBOMAddComponent implements OnInit {

  ProductID: number = 0;
  lstComponents: any[] = [];
  lstProcesses: any[] = [];
  lstParentProducts: any[] = [];
  isLoading: boolean = false;
  IsOpen: boolean = false;
  
  constructor(private toastr: ToastrService,
    private productService: ProductService,
    private componentService: ComponentService,
    private processService: ProcessService,
    private productBOMService: ProductBOMService
  ) {
  }
  ngOnInit(): void {
    this.FillParentProduct();
    // this.FillComponent();
    this.FillProcess();
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

  async FillComponent() {
    this.lstComponents = [];
    await this.componentService.Get(0).subscribe(users => {
      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.lstComponents = d.data.map((comp: any) => ({
          ComponentID: comp.ComponentID,
          ComponentName: comp.ComponentName,
          IsSelected: false,
          Processes: [] as number[]
        }));
      }
    });
  }

  FillProcess() {
    this.lstProcesses = [];
    this.processService.Get(0).subscribe(users => {
      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.lstProcesses = d.data;
        this.lstProcesses = d.data.map((comp: any) => ({
          ProcessID: comp.ProcessID,
          ProcessName: comp.ProcessName,
          IsSelected: false
        }));
      }
    });
  }

  async ProductSelectionChange(event: any) {
    this.isLoading = true;
    this.FillProductBOM();
    this.isLoading = false;
  }


  async FillProductBOM() {
    await this.FillComponent();
    this.productBOMService.GetComponents(this.ProductID).subscribe(users => {
      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        const bomComponents: any[] = d.data;
        this.lstComponents.forEach(comp => {
          const bomComp = bomComponents.find(bc => bc.ComponentID === comp.ComponentID);
          if (bomComp) {
            comp.IsSelected = true;
            comp.Processes = bomComp.Processes.map((proc: any) => proc.ProcessID);
          }
        });
      }
    }
    );
  }

  SaveBOM() {
    const selectedComponents: any[] = this.lstComponents.filter(c => c.IsSelected);
    

    const bomModel: ProductBOM_AddModel = new ProductBOM_AddModel();
    bomModel.ProductID = this.ProductID;
    bomModel.Remarks = "BOM created via UI";
    bomModel.Components = [];
    selectedComponents.forEach(comp => {
      const componentModel: ProductBOM_Component_AddModel = new ProductBOM_Component_AddModel();
      componentModel.ComponentID = comp.ComponentID;
      if (comp.Processes && comp.Processes.length > 0) {
        componentModel.Processes = comp.Processes.map((procID: number) => {
          const processModel: ProductBOM_Process_AddModel = new ProductBOM_Process_AddModel();
          processModel.ProcessID = procID;
          return processModel;
        });
      }
      bomModel.Components.push(componentModel);
    });

    console.log("Final BOM Model to be saved:", bomModel);
    this.productBOMService.Create(bomModel).subscribe(data => {
      console.log(data);
      let d: any = data;
      if (!d.success) {
        this.toastr.error(d.message, '', { enableHtml: true, closeButton: true });
      }
      else {
        this.toastr.success(d.message, '', { enableHtml: true, closeButton: true });
      }
    },
      error => {
        console.log(error);
        this.toastr.error(error.error.message, '');
      }
    );

  }



}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Page404Component } from './misc/page404/page404.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { ClientMasterListComponent } from './ClientMaster/client-master-list/client-master-list.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { BrandListComponent } from './Masters/Brand/brand-list/brand-list.component';
import { CreditTypeListComponent } from './Masters/CreditType/credit-type-list/credit-type-list.component';
import { DueDaysListComponent } from './Masters/DueDays/due-days-list/due-days-list.component';
import { ExhitionListComponent } from './Masters/Exhition/exhition-list/exhition-list.component';
import { HSNCodeListComponent } from './Masters/HSNCode/hsncode-list/hsncode-list.component';
import { RatingListComponent } from './Masters/Rating/rating-list/rating-list.component';
import { SalesLocationListComponent } from './Masters/SalesLocation/sales-location-list/sales-location-list.component';
import { PartyTypeListComponent } from './Masters/PartyType/party-type-list/party-type-list.component';
import { AddressTypeListComponent } from './Masters/AddressType/address-type-list/address-type-list.component';
import { PartyListComponent } from './Masters/Party/party-list/party-list.component';
import { StockTypeListComponent } from './Masters/StockType/stock-type-list/stock-type-list.component';
import { StoreListComponent } from './Masters/Store/store-list/store-list.component';
import { SalesOrderListComponent } from './Sales/SalesOrder/sales-order-list/sales-order-list.component';
import { SyncTablesComponent } from './Settings/sync-tables/sync-tables.component';
import { CountryListComponent } from './Masters/Country/country-list/country-list.component';
import { StateListComponent } from './Masters/State/state-list/state-list.component';
import { CityListComponent } from './Masters/City/city-list/city-list.component';
import { SalesOrderPrintComponent } from './Sales/SalesOrder/sales-order-print/sales-order-print.component';
import { SalesOrderReportComponent } from './Sales/SalesOrder/sales-order-report/sales-order-report.component';
import { GdnListComponent } from './Sales/GDN/gdn-list/gdn-list.component';
import { HomeComponent as POSHomeComponent } from './pos/home/home.component';
import { DashboardComponent as POSDashboardComponent } from './pos/dashboard/dashboard.component';
import { LabelprintsettingsListComponent } from './Masters/LabelPrintSettings/labelprint-settings-list/labelprint-settings-list.component';
import { ProductLabelPrintComponent } from './Masters/Product/product-label-print/product-label-print.component';
import { InsertStockListComponent } from './Sales/InsertStock/insertstock-list/insertstock-list.component';
import { RemoveStockListComponent } from './Sales/RemoveStock/removestock-list/removestock-list.component';
import { StockReportComponent } from './Sales/Stock/stock-report/stock-report.component';
import { ProcessListComponent } from './Masters/Process/process-list/process-list.component';
import { ComponentListComponent } from './Masters/Component/component-list/component-list.component';
import { ProductBOMAddComponent } from './Masters/ProductBOM/product-bom-add/product-bom-add.component';
import { WorkorderplanningListComponent } from './Sales/WorkOrderPlanning/workorderplanning-list/workorderplanning-list.component';

const routes: Routes = [
  {
    path:"",
    redirectTo:"login",
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children:[
      {
        path:"UserList",
        component: UserListComponent
      },
      {
        path:"ClientList",
        component: ClientMasterListComponent
      },
      {
        path:"Master",
        children:[
          {
            path:"BrandList",
            component: BrandListComponent
          },
          {
            path:"CreditTypeList",
            component: CreditTypeListComponent
          },
          {
            path:"SalesLocationList",
            component: SalesLocationListComponent
          },
          {
            path:"ExhitionList",
            component: ExhitionListComponent
          },
          {
            path:"DueDaysList",
            component: DueDaysListComponent
          },
          {
            path:"RatingList",
            component: RatingListComponent
          },
          {
            path:"HSNCodeList",
            component: HSNCodeListComponent
          },
          {
            path:"PartyTypeList",
            component: PartyTypeListComponent
          },
          {
            path:"AddressTypeList",
            component: AddressTypeListComponent
          },
          {
            path:"PartyList",
            component: PartyListComponent
          },
          {
            path:"StockTypeList",
            component: StockTypeListComponent
          },
          {
            path:"StoreList",
            component: StoreListComponent
          },
          {
            path:"CountryList",
            component: CountryListComponent
          },
          {
            path:"StateList",
            component: StateListComponent
          },
          {
            path:"CityList",
            component: CityListComponent
          },
          {
            path:"LabelPrintSettingList",
            component: LabelprintsettingsListComponent
          },
          {
            path:"ProductLblPrint",
            component: ProductLabelPrintComponent
          },
          {
            path:"ProcessList",
            component: ProcessListComponent
          },
          {
            path:"ComponentList",
            component: ComponentListComponent
          },
          {
            path:"ProductBOM",
            component: ProductBOMAddComponent
          }
        ]
      },
      {
        path: "Sales",
        children:[
          {
            path:"OrderList",
            component: SalesOrderListComponent
          },
          {
            path:"GDNList",
            component: GdnListComponent
          },
          {
            path: 'rptOrder',
            component: SalesOrderReportComponent
          },
          {
            path:"InsertStockList",
            component: InsertStockListComponent
          },
          {
            path:"RemoveStockList",
            component: RemoveStockListComponent
          },
           {
            path:"StockList",
            component: StockReportComponent
          },
          {
            path:"WOPlanningList",
            component: WorkorderplanningListComponent
          }
        ]
      },
      {
        path: "Settings",
        children:[
          {
            path:"SyncTables",
            component: SyncTablesComponent
          }
        ]
      },
      {
        path: 'logout',
        component: LogoutComponent
      },
      {
        path:"**",
        component: HomeComponent
      }
    ]
  },
  {
    path: 'pos',
    component: POSHomeComponent,
    children:[
      {
        path:"dashboard",
        component: POSDashboardComponent
      },
      {
        path:"**",
        component: POSDashboardComponent
      }
    ]
  },
  {
    path: "**",
    component: Page404Component,
    pathMatch: 'full'
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

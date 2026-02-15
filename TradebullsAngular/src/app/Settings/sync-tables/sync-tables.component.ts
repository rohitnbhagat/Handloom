import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SyncTablesService } from '../../services/sync-tables.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sync-tables',
  templateUrl: './sync-tables.component.html',
  styleUrl: './sync-tables.component.css'
})
export class SyncTablesComponent implements AfterViewInit {

  CTableID: number = 0;
  STableID: number = 0;
  TableList: any[] = [];
  isLoading: boolean = false;
  LoadingMessage: string = "Loading...";
  @ViewChild('btnSync') btnSync: ElementRef | undefined;

  constructor(private syncTablesService: SyncTablesService,
    private toastr: ToastrService
  ) {

  }
  ngAfterViewInit(): void {
    this.LoadTables();
  }

  LoadTables() {
    this.ShowProgress();
    this.syncTablesService.GetTables().subscribe((res: any) => {
      if (!res.success) {
        this.toastr.error(res.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.TableList = [];
        res.data.forEach((element: any) => {
          this.TableList.push({ status: 0, data: element });
        });
      }
      this.HideProgress();
    });
  }

  async SyncTables() {
    if (this.btnSync)
      this.btnSync.nativeElement.disabled = true;
    this.CTableID = 0;
    this.STableID = 0;

    this.TableList.forEach((element: any) => {
      element.status = 0;
    });

    await this.Sync_TaxClasses();
    await this.Sync_TaxRates();
    await this.Sync_Products();
    await this.Sync_Customers();
    await this.Sync_Orders();

    if (this.btnSync)
      this.btnSync.nativeElement.disabled = false;

    this.CTableID = 0;
    this.STableID = 0;
    this.LoadTables();
  }


  async Sync_TaxClasses() {
    const TableID: number = 1;
    this.CTableID = TableID;
    const StartDate: Date = new Date();
    await this.syncTablesService.Sync_TaxClasses().then((res: any) => {
      if (!res.success) {
        this.toastr.error(res.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.TableList.forEach((table: any) => {
          if (table.data.TableID == TableID)
            table.status = 2
        });
      }

      this.syncTablesService.AddHistory({ TableID: TableID, SyncStartDate: StartDate, SyncEndDate: new Date() }).subscribe();

    });
  }
  async Sync_TaxRates() {
    const TableID: number = 2;
    this.CTableID = TableID;
    const StartDate: Date = new Date();
    await this.syncTablesService.Sync_TaxRates().then((res: any) => {
      if (!res.success) {
        this.toastr.error(res.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.TableList.forEach((table: any) => {
          if (table.data.TableID == TableID)
            table.status = 2
        });
      }
      this.syncTablesService.AddHistory({ TableID: TableID, SyncStartDate: StartDate, SyncEndDate: new Date() }).subscribe();
    });
  }
  async Sync_Products() {
    const TableID: number = 3;
    this.CTableID = TableID;
    const StartDate: Date = new Date();
    await this.syncTablesService.Sync_Products().then((res: any) => {
      if (!res.success) {
        this.toastr.error(res.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.TableList.forEach((table: any) => {
          if (table.data.TableID == TableID)
            table.status = 2
        });
      }
      this.syncTablesService.AddHistory({ TableID: TableID, SyncStartDate: StartDate, SyncEndDate: new Date() }).subscribe();
    });
  }
  async Sync_Customers() {
    const TableID: number = 4;
    this.CTableID = TableID;
    const StartDate: Date = new Date();
    await this.syncTablesService.Sync_Customers().then((res: any) => {
      if (!res.success) {
        this.toastr.error(res.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.TableList.forEach((table: any) => {
          if (table.data.TableID == TableID)
            table.status = 2
        });
      }
      this.syncTablesService.AddHistory({ TableID: TableID, SyncStartDate: StartDate, SyncEndDate: new Date() }).subscribe();
    });
  }
  async Sync_Orders() {
    const TableID: number = 5;
    this.CTableID = TableID;
    const StartDate: Date = new Date();
    await this.syncTablesService.Sync_Orders().then((res: any) => {
      if (!res.success) {
        this.toastr.error(res.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.TableList.forEach((table: any) => {
          if (table.data.TableID == TableID)
            table.status = 2
        });
      }
      this.syncTablesService.AddHistory({ TableID: TableID, SyncStartDate: StartDate, SyncEndDate: new Date() }).subscribe();
    });
  }

  ShowProgress(message: string = "") {
    this.isLoading = true;
    this.LoadingMessage = (message.length > 0) ? this.LoadingMessage : "Loading ...";
  }
  HideProgress() {
    this.isLoading = false;
    this.LoadingMessage = "Loading ...";
  }

  async btnTaxClassSync(){
    if (this.btnSync)
      this.btnSync.nativeElement.disabled = true;

    const TableID: number = 1;
    this.STableID = TableID;
    this.TableList.forEach((table: any) => {
      if (table.data.TableID == TableID)
        table.status = 0
    });
    await this.Sync_TaxClasses();
    this.STableID = 0;
    this.CTableID = 0;
    this.LoadTables();

    if (this.btnSync)
      this.btnSync.nativeElement.disabled = false;
  }
  async btnSync_Click(tid:number){
    if (this.btnSync)
      this.btnSync.nativeElement.disabled = true;

    const TableID: number = tid;
    if(tid == 1)
      await this.Sync_TaxClasses();
    else if(tid == 2)
      await this.Sync_TaxRates();
    else if (tid == 3)
      await this.Sync_Products();
    else if (tid == 4)
      await this.Sync_Customers();
    else if (tid == 5)
      await this.Sync_Orders();

    this.CTableID = 0;
    // this.TableList.forEach((table: any) => {
    //   if (table.data.TableID == TableID)
    //     table.status = 0
    // });
    this.LoadTables();

    if (this.btnSync)
      this.btnSync.nativeElement.disabled = false;
  }

}

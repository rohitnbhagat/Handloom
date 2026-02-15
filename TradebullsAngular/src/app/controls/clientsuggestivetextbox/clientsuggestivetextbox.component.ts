import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { environment } from '../../../environments/environment';
import { ClientListModel } from '../../Models/ClientListModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clientsuggestivetextbox',
  templateUrl: './clientsuggestivetextbox.component.html',
  styleUrl: './clientsuggestivetextbox.component.css'
})
export class ClientsuggestivetextboxComponent {

  @Output() SubmitEvent = new EventEmitter<ClientListModel>(); 
  UserList!: ClientListModel[];
  
  searchTerm: string = '';
  selectedItems?: ClientListModel;
  filteredOptions: any[] = [];
  showSuggestions = false;
  activeOptionIndex = -1; // Track the active option for keyboard navigation
  UserData: any;

  constructor(private clientService: ClientService, private toastr: ToastrService) {
    this.filteredOptions = [];
  }
  ngOnInit(): void {
    this.clientService.Get(0).subscribe(users => {
      let d: any = users;
      if (!d.success) {
        this.toastr.error(d.message, '', {
          enableHtml: true,
          closeButton: true
        });
      }
      else {
        this.UserList = d.data;
        this.filteredOptions =d.data;
      }
    });

  }

  filterOptions(): void {
    if (this.searchTerm) {
      this.filteredOptions  = this.UserList.filter(m => 
          m.ClientName?.toLocaleLowerCase().includes(this.searchTerm.toLocaleLowerCase()) ||
          m.ClientCode?.toLocaleLowerCase().includes(this.searchTerm.toLocaleLowerCase())
    );
      this.showSuggestions = (this.filteredOptions.length > 0) ? true : false;
    } else {
      this.filteredOptions = [];
      this.showSuggestions = false;
    }
    this.activeOptionIndex = -1;
  }

  selectOption(option: ClientListModel): void {
    console.log(option);
    if(option)
    {
      this.searchTerm = "";
      this.showSuggestions = false;
      this.SubmitEvent.emit(option);
    }
  }

  hideSuggestions(): void {
    setTimeout(() => (this.showSuggestions = false), 200);
  }

  onKeydown(event: KeyboardEvent): void {
    const key = event.key;
    if (key === 'ArrowDown') {
      // Navigate down in suggestions list
      if (this.activeOptionIndex < this.filteredOptions.length - 1) {
        this.activeOptionIndex++;
      }
    } else if (key === 'ArrowUp') {
      // Navigate up in suggestions list
      if (this.activeOptionIndex > 0) {
        this.activeOptionIndex--;
      }
    } else if (key === 'Enter') {
      // Select the active option on Enter key press
      if (this.activeOptionIndex >= 0 && this.activeOptionIndex < this.filteredOptions.length) {
        this.selectOption(this.filteredOptions[this.activeOptionIndex]);
      }
    }
  }
  

}

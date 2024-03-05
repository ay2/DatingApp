import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css'
})
export class RolesModalComponent {
  public onClose: Subject<boolean> | undefined;
  username = '';
  availableRoles: any[] = [];
  selectedRoles: any[] = [];
  
  constructor(public bsModalRef: BsModalRef) {
    this.onClose = new Subject();
  }

  ngOnInit() {
    this.onClose?.next(false);
  }

  updateChecked(checkedValue: string) {
    const index = this.selectedRoles.indexOf(checkedValue);
    index !== -1 ? this.selectedRoles.splice(index, 1) : this.selectedRoles.push(checkedValue);
  }

  onLeave(toSubmit: boolean) {
    this.onClose?.next(toSubmit);
    this.bsModalRef.hide();
  }
}

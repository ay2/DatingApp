import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/user';
import { BsModalRef, BsModalService, ModalModule, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  availableRoles = ['Admin', 'Moderator', 'Member'];

  constructor(private adminsService: AdminService, private modalService: BsModalService) {}

  ngOnInit() {
    this.getUsersWithRoles()
  }

  getUsersWithRoles() {
    this.adminsService.getUsersWithRoles().subscribe({
      next: users => this.users = users
    })
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    
    // user pressed the Submit button?
    this.bsModalRef.content?.onClose?.subscribe({
      next: result => {
        console.log('modal result: ', result);
        if (result) {
          this.bsModalRef.onHide?.subscribe({
            next: () => {
              const selectedRoles = this.bsModalRef.content?.selectedRoles;
              if (!this.arrayEqual(selectedRoles!, user.roles)) {
                this.adminsService.updateUserRoles(user.username, selectedRoles!.toString()).subscribe({
                  next: roles => user.roles = roles
                })
              }
            }
          })
        }
      }
    })
  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
}

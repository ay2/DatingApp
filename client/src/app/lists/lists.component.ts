import { Component } from '@angular/core';
import { Member } from '../models/member';
import { MembersService } from '../services/members.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { Pagination } from '../models/pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
    selector: 'app-lists',
    standalone: true,
    templateUrl: './lists.component.html',
    styleUrl: './lists.component.css',
    imports: [ButtonsModule, FormsModule, MemberCardComponent, PaginationModule]
})
export class ListsComponent {
  members: Member[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination | undefined;

  constructor(private memberService: MembersService) {}

  ngOnInit() {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
}

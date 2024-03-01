import { Component } from '@angular/core';
import { Message } from '../models/message';
import { Pagination } from '../models/pagination';
import { MessageService } from '../services/message.service';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TitleCasePipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule, ButtonsModule, TitleCasePipe, TimeagoModule, PaginationModule, RouterLink, RouterLinkActive],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  messages?: Message[];
  pagination?: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  isLoading = false;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.loadmessages();
  }

  loadmessages() {
    this.isLoading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: response => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.isLoading = false;
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadmessages();
    }
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: _ => this.messages?.splice(this.messages.findIndex(m => m.id === id), 1)
    })
  }
}

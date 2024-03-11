import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { Message } from '../../models/message';
import { TimeagoModule } from 'ngx-timeago';
import { MessageService } from '../../services/message.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule, AsyncPipe],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() username?: string;
  messageContent = '';

  constructor(public messageService: MessageService) {}

  ngOnInit() {}

  sendMessage() {
    if (!this.username) return;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm?.reset();
    });
  }

}

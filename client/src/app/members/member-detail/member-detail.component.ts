import { Component } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { NgbNavChangeEvent, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { DatePipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';


@Component({
    selector: 'app-member-detail',
    standalone: true,
    templateUrl: './member-detail.component.html',
    styleUrl: './member-detail.component.css',
    imports: [NgbNavModule, GalleryModule, DatePipe, TimeagoModule, MemberMessagesComponent]
})
export class MemberDetailComponent {
  member: Member | undefined;
  images: GalleryItem[] = [];
  messages: Message[] = [];
  active = 1; // active Tab
  
  constructor(private memberService: MembersService, private route: ActivatedRoute,
    private messageService: MessageService) {}

  ngOnInit() {
    let showMessagesTab = false;

    this.route.queryParams.subscribe({
      next: params => {
        if (params['tab'] === 'Messages') {
          console.log('tab: Messages');
          showMessagesTab = true;
          this.active = 3;
        }
      }
    })
    
    this.loadMember(showMessagesTab);
  }

  loadMember(showMessagesTab: boolean) {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    // console.log('loading member ' + username + '...');
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member;
        this.getImages();
        if (showMessagesTab) this.loadMessages();
        // console.log('member ' + username + ' loaded');
      }
    })
  }

  loadMessages() {
    // console.log('loading messages...');
    if (this.member) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: messages => this.messages = messages
      });
    }
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    // console.log(changeEvent);
		if (changeEvent.nextId === 3) {
			this.loadMessages();
		}
	}

  getImages() {
    if (!this.member) return;
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}))
    }
  }
}

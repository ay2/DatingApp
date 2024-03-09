import { Component, ViewChild } from '@angular/core';
import { Member } from '../../models/member';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { AsyncPipe, DatePipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import { PresenceService } from '../../services/presence.service';
import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { take } from 'rxjs';


@Component({
    selector: 'app-member-detail',
    standalone: true,
    templateUrl: './member-detail.component.html',
    styleUrl: './member-detail.component.css',
    imports: [TabsModule, GalleryModule, DatePipe, TimeagoModule, MemberMessagesComponent, AsyncPipe]
})
export class MemberDetailComponent {
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];
  user?: User;
  
  constructor(private accountService: AccountService, private route: ActivatedRoute,
    private messageService: MessageService, public presenceService: PresenceService) {
      accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => {
          if (user) this.user = user;
        }
      })
    }

  ngOnInit() {
    this.route.data.subscribe({
      next: data => this.member = data['member']
    })

    //console.log(this.member);

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })

    this.getImages();
  }

  ngOnDestroy() {
    this.messageService.stopHubConnection();
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true
    }
  }

  loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
      });
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
		if (this.activeTab.heading === 'Messages' && this.user && this.member) {
			this.messageService.createHubConnection(this.user, this.member.userName);
		} else {
      this.messageService.stopHubConnection();
    }
	}

  getImages() {
    if (!this.member) return;
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}))
    }
  }
}

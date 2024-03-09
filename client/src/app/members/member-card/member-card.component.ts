import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { ToastrService } from 'ngx-toastr';
import { PresenceService } from '../../services/presence.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
 @Input() member: Member | undefined;

 constructor(private memberService: MembersService, private toastr: ToastrService, 
    public presenceService: PresenceService) {}

 addLike(member: Member) {
  this.memberService.addLike(member.userName).subscribe({
    next: () => this.toastr.success('You have liked ' + member.knownAs)
  })
 }

}

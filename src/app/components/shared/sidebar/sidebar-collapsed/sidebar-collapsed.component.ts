import {Component, input, OnInit} from '@angular/core';
import {ProfileService} from "@services/profile.service";
import {NgClass, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TooltipModule} from "primeng/tooltip";
import {ActiveTaskService} from "@services/active-task.service";
import {BadgeModule} from "primeng/badge";
import {ActiveTaskComponent} from "../../active-task/active-task.component";

@Component({
  selector: 'app-sidebar-collapsed',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass,
    RouterLink,
    TooltipModule,
    BadgeModule,
    ActiveTaskComponent
  ],
  templateUrl: './sidebar-collapsed.component.html',
  styles: ``
})
export class SidebarCollapsedComponent implements OnInit {

  protected imageUrl?: string = undefined;

  constructor(
    protected readonly profileService: ProfileService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
    protected readonly activeTask: ActiveTaskService
  ) {
  }


    ngOnInit(): void {
        this.imageUrl = this.profileService.cached.profileImageUrl
    }



}

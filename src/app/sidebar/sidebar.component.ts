/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, OnInit } from '@angular/core';
import { Octokit } from '@octokit/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  githubToken: string = localStorage.getItem('githubOAuthToken');
  user: any;
  avatarURL: string;
  octokit = new Octokit({ auth: this.githubToken });

  constructor() { }

  ngOnInit(): void {
    this.getUser();
  }

  async getUser() {
    this.user = await this.octokit.request('GET /user');
    this.avatarURL = `url("${this.user.data.avatar_url}")`;
  }

}

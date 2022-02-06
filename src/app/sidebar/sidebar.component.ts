/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, OnInit } from '@angular/core';
import { Octokit } from '@octokit/core';
import Chart from 'chart.js';

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

  displayContributionGraph(contributionData) {
    console.log(contributionData);
    const canvas = <HTMLCanvasElement>document.getElementById('contributionsChart');
    const ctx = canvas.getContext('2d');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const contributionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: new Array(53).fill(''),
        datasets: [{
          label: '# of Contributions',
          data: contributionData,
          borderColor: 'transparent',
          backgroundColor: '#9381FF',
          pointBackgroundColor: 'transparent',
        }],
      },
      options: {
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              display: false,
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  async getUser() {
    this.user = await this.octokit.request('GET /user');
    this.avatarURL = `url("${this.user.data.avatar_url}")`;
    const contribututions = await this.getContributions(this.githubToken, this.user?.data.login);
    const contributionData = [];
    contribututions.data.user.contributionsCollection.contributionCalendar.weeks.forEach((week: any) => {
      let weeklyContributionCount = 0;

      week.contributionDays.forEach((day: any) => {
        weeklyContributionCount += day.contributionCount;
      });
      contributionData.push(weeklyContributionCount);
    });
    this.displayContributionGraph(contributionData);
  }

  async getContributions(token: string, username: any) {
    const headers = {
      'Authorization': `bearer ${token}`,
    };
    const body = {
      "query": `query {
            user(login: "${username}") {
              name
              contributionsCollection {
                contributionCalendar {
                  colors
                  totalContributions
                  weeks {
                    contributionDays {
                      color
                      contributionCount
                      date
                      weekday
                    }
                    firstDay
                  }
                }
              }
            }
          }`
    };

    const response = await fetch('https://api.github.com/graphql', { method: 'POST', body: JSON.stringify(body), headers: headers });
    const data = await response.json();
    return data;
  }

}

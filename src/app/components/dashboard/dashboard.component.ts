import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../Services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { DashboardCardData } from '../../Models/DashBoard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userStats = [
    { title: 'Active Users', count: 45, color: 'text-success' },
    { title: 'Admin Users', count: 12, color: 'text-primary' },
    { title: 'Normal Users', count: 33, color: 'text-info' },
    { title: 'Inactive Users', count: 5, color: 'text-danger' }
  ];

  dashboardCards: DashboardCardData = {
    activeUser: 0,
    superAdminUser: 0,
    adminUser: 0,
    normalUser: 0,
    inActiveUser: 0
  };

   dashboardSrv:any = inject(DashboardService);
   toastr = inject(ToastrService);

  ngOnInit(): void {
      this.dashboardSrv.GetAllDashboard().subscribe((res: any) => {
        console.log(res, "response");
        if (res.success === true) {

          this.dashboardCards =  res.data;
          console.log(this.dashboardCards, "Dashboard Cards");
          
          // this.dashboardCards.SuperAdminUser = res.data.superAdminUser;
          // this.dashboardCards.AdminUser = res.data.adminUser;
          // this.dashboardCards.NormalUser = res.data.normalUser;
          // this.dashboardCards.InActiveUser = res.data.inActiveUser;
        } else {
          this.toastr.error(res.message);
        }
      },(error: any) => {
        this.toastr.error('Failed to fetch users');
      })
  }

}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { AppSettingsService } from '../../Services/app-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-app-settings',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './app-settings.component.html',
  styleUrl: './app-settings.component.css'
})
export class AppSettingsComponent  {
   private readonly router = inject(Router);
  private readonly settingsSrv = inject(AppSettingsService);
  private readonly toastr = inject(ToastrService);
  private readonly activeRoute = inject(ActivatedRoute);

  model = 'Update Application Setting';
  submitted = false;

  settingsModel: any = {
    key: '',
    value: '',
    description: ''
  };

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((params) => {
       const id = params.get('id');
      if (id) {
        this.getSettingById(id);
      }
    });
  }

  getSettingById(id: string): void {
    this.settingsSrv.getSettingById(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.settingsModel = res.data;
        } else {
          this.toastr.error(res.message, 'Fetch Failed');
        }
      },
      error: () => this.toastr.error('Error while fetching setting', 'Error'),
    });
  }

  updateSettings(): void {
    this.submitted = true;

    if (!this.settingsModel.value) {
      return;
    }

    this.settingsSrv.updateSetting(this.settingsModel).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message);
          this.router.navigateByUrl('/app-settings-list');
        } else {
          this.toastr.error(res.message);
        }
      },
      error: () => {
        this.toastr.error('An error occurred during update', 'Error');
      },
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/app-settings-list');
  }
}

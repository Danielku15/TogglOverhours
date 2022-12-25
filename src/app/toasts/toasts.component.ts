import { Component, TemplateRef } from '@angular/core';
import { ToastInfo, ToastService } from '../toast.service';

@Component({
  selector: 'to-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss']
})
export class ToastsComponent {
  public constructor(public toastService: ToastService) {
  }


  isTemplate(template: any): template is TemplateRef<any> {
    return template instanceof TemplateRef;
  }
}

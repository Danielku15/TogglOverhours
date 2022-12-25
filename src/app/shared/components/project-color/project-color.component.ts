import { Component, Input } from '@angular/core';
import { WorkspaceProject } from '@app/core/models/database';

@Component({
  selector: 'to-project-color',
  templateUrl: './project-color.component.html',
  styleUrls: ['./project-color.component.scss']
})
export class ProjectColorComponent {
  @Input() project?: WorkspaceProject;
}

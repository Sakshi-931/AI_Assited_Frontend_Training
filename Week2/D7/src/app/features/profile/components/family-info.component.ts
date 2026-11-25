import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { FamilyMember } from '../../../core/models/employee.model';

@Component({
  selector: 'app-family-info',
  standalone: true,
  imports: [],
  templateUrl: './family-info.component.html',
  styleUrl: './family-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyInfoComponent {
  readonly family = input.required<FamilyMember[]>();
}

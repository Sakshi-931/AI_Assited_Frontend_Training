import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { EmergencyContact } from '../../../core/models/employee.model';

@Component({
  selector: 'app-emergency-contact',
  standalone: true,
  imports: [],
  templateUrl: './emergency-contact.component.html',
  styleUrl: './emergency-contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergencyContactComponent {
  readonly contacts = input.required<EmergencyContact[]>();
}

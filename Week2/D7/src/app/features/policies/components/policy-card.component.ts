import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CompanyPolicy } from '../../../core/models/policy.model';

@Component({
  selector: 'app-policy-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './policy-card.component.html',
  styleUrl: './policy-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyCardComponent {
  readonly policy = input.required<CompanyPolicy>();
}

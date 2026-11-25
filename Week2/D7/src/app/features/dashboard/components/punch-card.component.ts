import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TodayPunch } from '../../../core/models/attendance.model';
import { StatusBadgeDirective } from '../../../shared/directives/status-badge.directive';

@Component({
  selector: 'app-punch-card',
  standalone: true,
  imports: [StatusBadgeDirective],
  templateUrl: './punch-card.component.html',
  styleUrl: './punch-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PunchCardComponent {
  readonly punch = input<TodayPunch | null>(null);
}

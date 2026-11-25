import { Directive, ElementRef, inject, input, effect } from '@angular/core';
import { AttendanceStatus } from '../../core/models/attendance.model';

@Directive({
  selector: '[appStatusBadge]',
  standalone: true,
})
export class StatusBadgeDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  // Signal input for the attendance status
  readonly appStatusBadge = input<AttendanceStatus | string | null>(null);

  constructor() {
    // Automatically re-apply styling classes whenever the status signal changes
    effect(() => {
      const status = this.appStatusBadge();
      this.updateBadgeStyle(status);
    });
  }

  private updateBadgeStyle(status: string | null): void {
    const nativeEl = this.el.nativeElement;

    // Reset known status classes
    nativeEl.classList.remove('badge-present', 'badge-late', 'badge-absent', 'badge-leave');

    // Add base badge class
    nativeEl.classList.add('status-badge');

    if (!status) return;

    switch (status.toLowerCase()) {
      case 'present':
        nativeEl.classList.add('badge-present');
        break;
      case 'late':
        nativeEl.classList.add('badge-late');
        break;
      case 'absent':
        nativeEl.classList.add('badge-absent');
        break;
      case 'leave':
        nativeEl.classList.add('badge-leave');
        break;
    }
  }
}

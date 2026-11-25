import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [TopbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  protected readonly uiState = inject(UiStateService);
  protected readonly isSidebarOpen = this.uiState.isSidebarOpen;

  closeSidebarOnBackdrop(): void {
    this.uiState.closeSidebar();
  }
}

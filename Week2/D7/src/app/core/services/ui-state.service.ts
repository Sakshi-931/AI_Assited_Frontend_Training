import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  // Sidebar open/closed state (defaults to false for compact hover-rail mode)
  private readonly _isSidebarOpen = signal<boolean>(false);

  // Readonly signal exposed to components
  readonly isSidebarOpen = this._isSidebarOpen.asReadonly();

  toggleSidebar(): void {
    this._isSidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this._isSidebarOpen.set(false);
  }

  openSidebar(): void {
    this._isSidebarOpen.set(true);
  }
}

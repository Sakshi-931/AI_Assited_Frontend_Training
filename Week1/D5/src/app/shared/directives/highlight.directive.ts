import { Directive, ElementRef, HostListener, Input, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input('appHighlight') highlightColor = '#f8fafc';

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.setHighlight(this.highlightColor || '#f8fafc', '#93c5fd');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.resetHighlight();
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.setHighlight(this.highlightColor || '#f8fafc', '#2563eb');
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.resetHighlight();
  }

  private setHighlight(bgColor: string, borderColor: string): void {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', bgColor);
    this.renderer.setStyle(this.el.nativeElement, 'borderColor', borderColor);
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.2s ease');
  }

  private resetHighlight(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
    this.renderer.removeStyle(this.el.nativeElement, 'borderColor');
  }
}

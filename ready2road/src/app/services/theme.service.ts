import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: string;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.currentTheme = this.loadThemeFromStorage() || 'dark-theme';
    this.applyTheme(this.currentTheme);

    this.renderer.listen('window', 'load', () => {
      this.setIconTheme();
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';
    this.applyTheme(this.currentTheme);
    this.saveThemeToStorage(this.currentTheme);

    this.setIconTheme()
  }

  private applyTheme(theme: string) {
    // Modifica le variabili CSS in base al tema corrente
    const root = document.documentElement;

    if (theme === 'dark-theme') {
      root.style.setProperty('--primary-color', '#ED2647');
      root.style.setProperty('--secondary-color', '#c51d39');
      root.style.setProperty('--shadow-color', '#000000');
      root.style.setProperty('--background-color', '#222222');
      root.style.setProperty('--accent-color', '#333333');
      root.style.setProperty('--alert-background', '#42414d');
      root.style.setProperty('--component-color', '#4d4d4d');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--secondary-text-color', '#d3d3d3');
    } else {
      root.style.setProperty('--primary-color', '#ED2647');
      root.style.setProperty('--secondary-color', '#c51d39');
      root.style.setProperty('--shadow-color', '#000000');
      root.style.setProperty('--background-color', '#ffffff');
      root.style.setProperty('--accent-color', '#e5e5e5');
      root.style.setProperty('--alert-background', '#f2f2f2');
      root.style.setProperty('--component-color', '#f9f9f9');
      root.style.setProperty('--text-color', '#000000');
      root.style.setProperty('--secondary-text-color', '#333333');
    }

  }

  private setIconTheme(): any{
    const component: any = document.getElementById('theme');
    if(this.currentTheme === 'dark-theme'){
      component.classList.remove('fa-sun');
      component.classList.add('fa-moon');
    }
    else{
      component.classList.remove('fa-moon');
      component.classList.add('fa-sun');
    }
  }

  private saveThemeToStorage(theme: string) {
    localStorage.setItem('currentTheme', theme);
  }

  private loadThemeFromStorage(): string | null {
    return localStorage.getItem('currentTheme');
  }
}

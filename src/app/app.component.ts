import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <div class="app-shell">
      <app-sidebar />
      <main class="main-content">
        <div class="page-content animate-in">
          <router-outlet />
        </div>
      </main>
    </div>
    <app-toast />
  `
})
export class AppComponent {}

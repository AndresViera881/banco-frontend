import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  collapsed = signal(false);

  navItems: NavItem[] = [
    { label: 'Clientes', icon: '👤', route: '/clientes' },
    { label: 'Cuentas', icon: '🏦', route: '/cuentas' },
    { label: 'Movimientos', icon: '↕', route: '/movimientos' },
    { label: 'Reportes', icon: '📊', route: '/reportes' }
  ];

  toggleCollapse(): void {
    this.collapsed.update(v => !v);
  }
}

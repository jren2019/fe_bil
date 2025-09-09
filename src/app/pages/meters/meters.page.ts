import { Component } from '@angular/core';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-meters-page',
  standalone: true,
  imports: [NavMenuComponent, ButtonModule, InputTextModule, ChartModule],
  templateUrl: 'meters.page.html',
  styleUrls: ['meters.page.scss']
})
export class MetersPageComponent {
  lineChartData = {
    labels: ['17 May', '18 May', '19 May', '20 May', '21 May'],
    datasets: [
      {
        label: 'FEET',
        data: [0, 600, 900, 500, null],
        fill: false,
        borderColor: '#1a6cff',
        tension: 0.4,
        pointBackgroundColor: '#1a6cff',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
        backgroundColor: 'rgba(26,108,255,0.1)'
      }
    ]
  };
  lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: false
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'FEET'
        },
        min: 0,
        max: 1000,
        ticks: {
          stepSize: 200
        },
        grid: {
          color: '#e5eaf2'
        }
      }
    }
  };
} 
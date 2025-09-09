import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-external-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class ExternalRequestsComponent {
  request = {
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    requesterName: '',
    requesterEmail: '',
    contactPhone: ''
  };

  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  categories = [
    'IT Support',
    'Facilities',
    'Equipment Repair',
    'Software Access',
    'Hardware Request',
    'Other'
  ];

  submitRequest() {
    console.log('Request submitted:', this.request);
    // Here you would typically send the request to your backend
    alert('Request submitted successfully! We will contact you soon.');
    this.resetForm();
  }

  resetForm() {
    this.request = {
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      requesterName: '',
      requesterEmail: '',
      contactPhone: ''
    };
  }
}

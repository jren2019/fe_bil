import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  blogs = [
    {
      title: 'The Future of Computing',
      date: 'March 15, 2024',
      excerpt: 'Exploring the latest trends and innovations in computing technology...',
      image: 'assets/images/blog/asset-management-1.jpg',
      slug: 'future-of-computing'
    },
    // Add more blog posts here
  ];
} 
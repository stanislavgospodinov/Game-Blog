import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogPost } from '../../../shared/interfaces/catalog-post';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  posts: CatalogPost[] = [
    {
      id: '1',
      title: 'Best RPG Games to Play This Year',
      category: 'RPG',
      imageUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
      summary: 'A selection of RPG titles with strong story, combat, and world-building.',
      authorUsername: 'Shoni',
      createdAt: '2026-04-18'
    },
    {
      id: '2',
      title: 'Why Racing Games Still Feel Amazing',
      category: 'Racing',
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      summary: 'From arcade fun to simulation depth, racing games remain one of the most exciting genres.',
      authorUsername: 'Alex',
      createdAt: '2026-04-17'
    },
    {
      id: '3',
      title: 'Top Indie Titles You Should Not Miss',
      category: 'Indie',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      summary: 'Creative mechanics, memorable art style, and unique stories make these indie games stand out.',
      authorUsername: 'Mira',
      createdAt: '2026-04-15'
    }
  ];
}


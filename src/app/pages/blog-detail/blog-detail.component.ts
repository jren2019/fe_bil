import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

interface TocItem {
  text: string;
  level: number;
  id: string;
  children?: TocItem[];
}

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MarkdownModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  blog: any;
  tableOfContents: TocItem[] = [];

  constructor(private route: ActivatedRoute) {
    // In a real application, you would fetch the blog content from a service
    // based on the route parameter
    this.blog = {
      title: 'The Future of Computing',
      date: 'March 15, 2024',
      author: 'John Doe',
      image: 'assets/images/blog/future-computing.jpeg',
      content: `# The Future of Computing Is AI—and the Future of AI Is Local

Computers have come a long way—from clunky machines filling rooms to sleek devices in our pockets. But the next big shift isn't about size or speed alone—it's about **intelligence**.

Artificial intelligence (AI) is poised to redefine how we use software, making it smarter, more intuitive, and woven into every corner of our digital lives. And the real game-changer? That AI isn't going to live in the cloud or rely on massive, sprawling systems.

**The future of AI is local**—small, efficient language models embedded right into the tools we use every day, from productivity apps to video games.

Here's why this shift is coming, and why it matters.

---

## AI: The Brain Behind Tomorrow's Software

Imagine a computer that doesn't just follow your commands but understands your needs—anticipating questions, solving problems, and adapting to you.

That's where AI is taking us. It's already started:

- Virtual assistants schedule our days  
- Algorithms recommend our playlists  
- Chatbots handle customer queries  

But this is just the tip of the iceberg.

Soon, AI won't be a separate tool you call up—it'll be **baked into every programme** you open. Examples:

- Your spreadsheet could suggest budget fixes  
- Your photo editor might tweak lighting on its own  
- Your favourite game could craft dialogue that feels alive  

AI is becoming the **brain of computing**, turning rigid software into something that thinks alongside us.

This isn't science fiction—it's the natural next step. As hardware gets more powerful and data grows richer, **software that learns will outpace software that just runs**.

---

## Why Local Matters More Than Ever

Today's AI often lives in the **cloud**—giant models like ChatGPT or Google tools running on remote servers.

That works for now, but it has drawbacks:

- **Lag**
- **Privacy risks**
- **Dependence on internet connectivity**

If your connection drops, your "smart" tool turns dumb. If a server hiccups, you're stuck. And all your data—work memos, game saves—may end up in someone else's hands.

**Enter local AI**: AI running directly on your device.

### Benefits of Local AI:

- No server delays  
- Improved privacy  
- Works offline  

It uses your computer's own **processor** and **memory** to do the heavy lifting. As devices get more powerful (think laptops with 16GB RAM or phones with neural chips), they're ready to host this kind of intelligence without breaking a sweat.

---

## Small Language Models: Big Impact, Tiny Footprint

Why small language models?

Large models—those billion-parameter giants—are overkill for most tasks. They're like using a **sledgehammer to crack a walnut**: powerful, but clumsy and wasteful.

**Small language models**, on the other hand, are:

- Leaner  
- Specialized (e.g., childcare, coding, gaming)  
- Efficient  

These models don't need to know everything—just what's useful to you.

They can:

- Answer questions  
- Spot patterns  
- Tweak settings  

All while running smoothly on a modern device.

Developers are already training them on **niche datasets**—from medical terms to fantasy lore—proving you don't need a giant to get smart results.

---

## Embedded Everywhere—Even Games

This shift isn't just for productivity—**it's coming to games**.

Imagine a game where the AI **adapts to how you play**:

- Racing games adjust rival strategies based on your driving style  
- Adventure games generate new dialogue dynamically  
- No internet needed  

That's the magic of **embedded small language models**—they turn static software into something dynamic, **right on your console or PC**.

### Example

A childcare app like **Rostiny** uses local AI to answer admin queries like:

> "What's due for MoE this week?"

Now imagine that same local AI in a pirate game:

> A pirate NPC remembers your last insult—and throws one back. No cloud required.

It's all about sharper, more personal experiences—**self-contained and smart**.

---

## The Road Ahead

The future of computing is AI because we crave tools that **think with us**, not just for us.

And the future of AI is local, small language models because we need that intelligence to be:

- **Fast**
- **Private**
- **Ours**

As hardware evolves and developers refine these compact models, you'll see them **everywhere**:

- Your calendar  
- Your design app  
- Your kid's next Minecraft clone  

It's not about replacing the cloud—it's about **bringing the smarts home**.

---

So, next time you fire up a programme or dive into a game, imagine an AI tucked inside—**quiet, clever, and ready to help**.

That's where we're headed: a world where computing isn't just powerful, but **personal**.

And it's starting right on your device.`
    };
  }

  ngOnInit() {
    this.generateTableOfContents();
  }

  generateTableOfContents() {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [...this.blog.content.matchAll(headingRegex)];
    const flatToc: TocItem[] = matches.map(match => {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^\w]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return { text, level, id, children: [] };
    });
    this.tableOfContents = this.buildTocTree(flatToc);
  }

  buildTocTree(flatToc: TocItem[]): TocItem[] {
    const root: TocItem[] = [];
    const parents: TocItem[] = [];
    flatToc.forEach(item => {
      while (parents.length && item.level <= parents[parents.length - 1].level) {
        parents.pop();
      }
      if (parents.length === 0) {
        root.push(item);
        parents.push(item);
      } else {
        const parent = parents[parents.length - 1];
        parent.children = parent.children || [];
        parent.children.push(item);
        parents.push(item);
      }
    });
    return root;
  }

  scrollToHeading(event: Event, id: string) {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
} 
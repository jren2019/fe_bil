import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';

// Library Interfaces
interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: Date;
  lastModified: Date;
  downloadCount: number;
  tags: string[];
  url: string;
  isPublic: boolean;
}

interface WorkOrderTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  workType: 'preventive' | 'corrective' | 'inspection' | 'project';
  estimatedDuration: string;
  priority: 'high' | 'medium' | 'low';
  instructions: string;
  checklist: ChecklistItem[];
  requiredParts: string[];
  skillsRequired: string[];
  createdBy: string;
  createdDate: Date;
  usageCount: number;
  isActive: boolean;
}

interface ChecklistItem {
  id: string;
  description: string;
  isRequired: boolean;
  order: number;
}

interface Procedure {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: ProcedureStep[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredTools: string[];
  safetyNotes: string[];
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
  version: string;
  isApproved: boolean;
}

interface ProcedureStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  notes?: string;
}

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'document' | 'image';
  attachments?: any[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpfulCount: number;
  viewCount: number;
  createdDate: Date;
}

@Component({
  selector: 'app-library-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavMenuComponent
  ],
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss']
})
export class LibraryPageComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  selectedView: string = 'documents';
  searchTerm: string = '';
  selectedCategory: string = '';

  // Chat-related properties
  chatMessages: ChatMessage[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  showSuggestions: boolean = true;

  // Filter properties
  documentCategories: string[] = ['Technical Manuals', 'Safety Documents', 'Compliance', 'Training', 'Policies'];
  templateCategories: string[] = ['Maintenance', 'Inspection', 'Repair', 'Installation', 'Calibration'];
  procedureCategories: string[] = ['Safety', 'Equipment', 'Process', 'Emergency', 'Quality Control'];

  // Sample data
  documents: Document[] = [
    {
      id: 'DOC001',
      title: 'Equipment Safety Manual',
      description: 'Comprehensive safety guidelines for all equipment operations',
      category: 'Safety Documents',
      fileType: 'PDF',
      fileSize: '2.3 MB',
      uploadedBy: 'Safety Team',
      uploadedDate: new Date('2024-01-15'),
      lastModified: new Date('2024-02-20'),
      downloadCount: 145,
      tags: ['safety', 'equipment', 'manual'],
      url: '#',
      isPublic: true
    },
    {
      id: 'DOC002',
      title: 'HVAC Maintenance Guide',
      description: 'Complete maintenance procedures for HVAC systems',
      category: 'Technical Manuals',
      fileType: 'PDF',
      fileSize: '5.1 MB',
      uploadedBy: 'Maintenance Team',
      uploadedDate: new Date('2024-02-01'),
      lastModified: new Date('2024-02-25'),
      downloadCount: 89,
      tags: ['hvac', 'maintenance', 'procedures'],
      url: '#',
      isPublic: true
    },
    {
      id: 'DOC003',
      title: 'Quality Control Standards',
      description: 'Standard operating procedures for quality control',
      category: 'Compliance',
      fileType: 'DOCX',
      fileSize: '1.8 MB',
      uploadedBy: 'Quality Team',
      uploadedDate: new Date('2024-01-20'),
      lastModified: new Date('2024-02-15'),
      downloadCount: 67,
      tags: ['quality', 'standards', 'compliance'],
      url: '#',
      isPublic: false
    }
  ];

  workOrderTemplates: WorkOrderTemplate[] = [
    {
      id: 'WOT001',
      name: 'Monthly HVAC Filter Replacement',
      description: 'Standard procedure for replacing HVAC filters monthly',
      category: 'Maintenance',
      workType: 'preventive',
      estimatedDuration: '2 hours',
      priority: 'medium',
      instructions: 'Replace all HVAC filters according to manufacturer specifications',
      checklist: [
        { id: 'C001', description: 'Turn off HVAC system', isRequired: true, order: 1 },
        { id: 'C002', description: 'Remove old filters', isRequired: true, order: 2 },
        { id: 'C003', description: 'Check filter dimensions', isRequired: true, order: 3 },
        { id: 'C004', description: 'Install new filters', isRequired: true, order: 4 },
        { id: 'C005', description: 'Turn on HVAC system', isRequired: true, order: 5 }
      ],
      requiredParts: ['HVAC Filter 20x25x1', 'HVAC Filter 16x20x1'],
      skillsRequired: ['Basic HVAC knowledge', 'Safety procedures'],
      createdBy: 'Maintenance Manager',
      createdDate: new Date('2024-01-10'),
      usageCount: 24,
      isActive: true
    },
    {
      id: 'WOT002',
      name: 'Equipment Safety Inspection',
      description: 'Comprehensive safety inspection for production equipment',
      category: 'Inspection',
      workType: 'inspection',
      estimatedDuration: '3 hours',
      priority: 'high',
      instructions: 'Perform thorough safety inspection of all equipment',
      checklist: [
        { id: 'C006', description: 'Check emergency stops', isRequired: true, order: 1 },
        { id: 'C007', description: 'Inspect safety guards', isRequired: true, order: 2 },
        { id: 'C008', description: 'Test warning systems', isRequired: true, order: 3 },
        { id: 'C009', description: 'Document findings', isRequired: true, order: 4 }
      ],
      requiredParts: [],
      skillsRequired: ['Safety certification', 'Equipment knowledge'],
      createdBy: 'Safety Inspector',
      createdDate: new Date('2024-01-05'),
      usageCount: 12,
      isActive: true
    }
  ];

  procedures: Procedure[] = [
    {
      id: 'PROC001',
      title: 'Emergency Shutdown Procedure',
      description: 'Step-by-step emergency shutdown procedure for all equipment',
      category: 'Emergency',
      steps: [
        {
          id: 'S001',
          stepNumber: 1,
          title: 'Activate Emergency Stop',
          description: 'Press the red emergency stop button located on the main control panel',
          notes: 'Ensure all personnel are clear of equipment'
        },
        {
          id: 'S002',
          stepNumber: 2,
          title: 'Isolate Power',
          description: 'Turn off main power switch and lock out/tag out the electrical panel',
          notes: 'Follow LOTO procedures'
        },
        {
          id: 'S003',
          stepNumber: 3,
          title: 'Secure Area',
          description: 'Clear the area and post warning signs',
          notes: 'Notify management immediately'
        }
      ],
      estimatedTime: '15 minutes',
      difficulty: 'beginner',
      requiredTools: ['Lockout devices', 'Warning signs'],
      safetyNotes: ['Always ensure personal safety first', 'Follow company emergency protocols'],
      createdBy: 'Safety Manager',
      createdDate: new Date('2024-01-08'),
      lastUpdated: new Date('2024-02-10'),
      version: '2.1',
      isApproved: true
    },
    {
      id: 'PROC002',
      title: 'Equipment Calibration Process',
      description: 'Standard calibration procedure for measuring equipment',
      category: 'Quality Control',
      steps: [
        {
          id: 'S004',
          stepNumber: 1,
          title: 'Prepare Equipment',
          description: 'Ensure equipment is clean and at proper temperature',
          notes: 'Allow 30 minutes for temperature stabilization'
        },
        {
          id: 'S005',
          stepNumber: 2,
          title: 'Set Reference Standards',
          description: 'Connect certified reference standards',
          notes: 'Verify calibration certificates are current'
        },
        {
          id: 'S006',
          stepNumber: 3,
          title: 'Perform Calibration',
          description: 'Follow manufacturer calibration sequence',
          notes: 'Record all measurements in calibration log'
        }
      ],
      estimatedTime: '45 minutes',
      difficulty: 'intermediate',
      requiredTools: ['Calibration standards', 'Measurement tools', 'Calibration certificate'],
      safetyNotes: ['Handle precision instruments carefully', 'Maintain clean environment'],
      createdBy: 'Quality Engineer',
      createdDate: new Date('2024-01-12'),
      lastUpdated: new Date('2024-02-05'),
      version: '1.3',
      isApproved: true
    }
  ];

  faqItems: FAQItem[] = [
    {
      id: 'FAQ001',
      question: 'How do I request a new work order?',
      answer: 'To request a new work order, go to the Work Orders page and click the "New Work Order" button. Fill in the required details including title, description, priority, and assignment.',
      category: 'Work Orders',
      tags: ['work-order', 'request', 'new'],
      helpfulCount: 25,
      viewCount: 156,
      createdDate: new Date('2024-01-15')
    },
    {
      id: 'FAQ002',
      question: 'What safety procedures should I follow?',
      answer: 'Always follow the safety procedures outlined in the Equipment Safety Manual. This includes wearing appropriate PPE, following lockout/tagout procedures, and reporting any safety concerns immediately.',
      category: 'Safety',
      tags: ['safety', 'procedures', 'ppe'],
      helpfulCount: 42,
      viewCount: 298,
      createdDate: new Date('2024-01-10')
    },
    {
      id: 'FAQ003',
      question: 'How often should equipment be inspected?',
      answer: 'Equipment inspection frequency depends on the type of equipment and manufacturer recommendations. Generally, critical equipment should be inspected monthly, while less critical equipment can be inspected quarterly.',
      category: 'Maintenance',
      tags: ['inspection', 'equipment', 'frequency'],
      helpfulCount: 18,
      viewCount: 124,
      createdDate: new Date('2024-01-20')
    }
  ];

  // Quick suggestion messages for the chatbot
  quickSuggestions: string[] = [
    'How do I create a work order?',
    'What are the safety procedures?',
    'Show me maintenance schedules',
    'How to access documents?',
    'Emergency contact information'
  ];

  constructor() {}

  ngOnInit() {
    this.initializeChat();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // View management
  setView(view: string) {
    this.selectedView = view;
    this.searchTerm = '';
    this.selectedCategory = '';
  }

  // Search and filter methods
  getFilteredDocuments(): Document[] {
    let filtered = this.documents;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(term) ||
        doc.description.toLowerCase().includes(term) ||
        doc.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(doc => doc.category === this.selectedCategory);
    }

    return filtered;
  }

  getFilteredTemplates(): WorkOrderTemplate[] {
    let filtered = this.workOrderTemplates;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term) ||
        template.category.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(template => template.category === this.selectedCategory);
    }

    return filtered;
  }

  getFilteredProcedures(): Procedure[] {
    let filtered = this.procedures;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(procedure =>
        procedure.title.toLowerCase().includes(term) ||
        procedure.description.toLowerCase().includes(term) ||
        procedure.category.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(procedure => procedure.category === this.selectedCategory);
    }

    return filtered;
  }

  // Document actions
  downloadDocument(doc: Document) {
    // Simulate download
    doc.downloadCount++;
    console.log('Downloading document:', doc.title);
  }

  previewDocument(doc: Document) {
    console.log('Previewing document:', doc.title);
  }

  // Template actions
  useTemplate(template: WorkOrderTemplate) {
    template.usageCount++;
    console.log('Using template:', template.name);
    // In real implementation, this would redirect to work order creation with template
  }

  editTemplate(template: WorkOrderTemplate) {
    console.log('Editing template:', template.name);
  }

  duplicateTemplate(template: WorkOrderTemplate) {
    console.log('Duplicating template:', template.name);
  }

  // Procedure actions
  viewProcedure(procedure: Procedure) {
    console.log('Viewing procedure:', procedure.title);
  }

  editProcedure(procedure: Procedure) {
    console.log('Editing procedure:', procedure.title);
  }

  // Chat functionality
  initializeChat() {
    // Add welcome message
    this.chatMessages = [
      {
        id: '1',
        message: 'Hello! I\'m your AI assistant. I can help you find documents, procedures, work order templates, and answer questions about your maintenance operations. How can I assist you today?',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }
    ];
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: this.newMessage,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    this.chatMessages.push(userMessage);
    const userQuestion = this.newMessage;
    this.newMessage = '';
    this.showSuggestions = false;

    // Simulate AI response
    this.simulateAIResponse(userQuestion);
  }

  sendQuickMessage(message: string) {
    this.newMessage = message;
    this.sendMessage();
  }

  private simulateAIResponse(userQuestion: string) {
    this.isTyping = true;

    setTimeout(() => {
      const response = this.generateAIResponse(userQuestion);

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        message: response,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };

      this.chatMessages.push(aiMessage);
      this.isTyping = false;
    }, 1500);
  }

  private generateAIResponse(question: string): string {
    const lowerQuestion = question.toLowerCase();

    // FAQ-based responses
    for (const faq of this.faqItems) {
      if (lowerQuestion.includes(faq.question.toLowerCase().substring(0, 10))) {
        faq.viewCount++;
        return faq.answer;
      }
    }

    // Keyword-based responses
    if (lowerQuestion.includes('work order') || lowerQuestion.includes('workorder')) {
      return 'To create a work order, go to the Work Orders page and click "New Work Order". You can also use our work order templates from the Library > Work Order Templates section to speed up the process. Would you like me to show you available templates?';
    }

    if (lowerQuestion.includes('safety') || lowerQuestion.includes('emergency')) {
      return 'Safety is our top priority! Please refer to our Emergency Shutdown Procedure in the Procedures section. Always follow lockout/tagout procedures and wear appropriate PPE. For immediate safety concerns, contact the safety team at ext. 911.';
    }

    if (lowerQuestion.includes('document') || lowerQuestion.includes('manual')) {
      return 'You can find all documents in the Documents section of the library. We have technical manuals, safety documents, compliance materials, and training resources. Use the search and filter options to find what you need quickly.';
    }

    if (lowerQuestion.includes('maintenance') || lowerQuestion.includes('inspect')) {
      return 'Maintenance schedules and procedures are available in the Procedures section. For routine maintenance, check our Work Order Templates which include pre-built checklists and required parts lists.';
    }

    if (lowerQuestion.includes('template')) {
      return 'Work order templates help standardize common tasks. We have templates for maintenance, inspections, repairs, and installations. Each template includes step-by-step instructions, required parts, and safety notes.';
    }

    // Default response
    return 'I\'d be happy to help! I can assist you with finding documents, work order templates, procedures, and answering questions about maintenance operations. Could you please be more specific about what you\'re looking for?';
  }

  private scrollToBottom() {
    if (this.chatContainer) {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.log('Could not scroll to bottom');
      }
    }
  }

  clearChat() {
    this.chatMessages = [];
    this.initializeChat();
    this.showSuggestions = true;
  }

  // Header actions
  exportLibraryReport() {
    console.log('Exporting library report...');
    // In real implementation, this would generate and download a report
  }

  uploadDocument() {
    console.log('Opening document upload dialog...');
    // In real implementation, this would open a file upload dialog
  }

  // Utility methods
  formatFileSize(size: string): string {
    return size;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDifficultyBadgeClass(difficulty: string): string {
    switch (difficulty) {
      case 'beginner': return 'difficulty-beginner';
      case 'intermediate': return 'difficulty-intermediate';
      case 'advanced': return 'difficulty-advanced';
      default: return 'difficulty-beginner';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  }

  getWorkTypeBadgeClass(workType: string): string {
    switch (workType) {
      case 'preventive': return 'work-type-preventive';
      case 'corrective': return 'work-type-corrective';
      case 'inspection': return 'work-type-inspection';
      case 'project': return 'work-type-project';
      default: return 'work-type-corrective';
    }
  }
}

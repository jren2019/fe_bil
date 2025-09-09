import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TimesheetEntry {
  id: string;
  workOrderId: number;
  userId: string;
  userName: string;
  userType: 'staff' | 'contractor' | 'supervisor' | 'manager';
  date: Date;
  startTime: string; // "09:00"
  duration: number; // minutes
  description: string;
  status: 'draft' | 'submitted' | 'approved';
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-external-timesheet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss'
})
export class ExternalTimesheetComponent implements OnInit {
  employeeInfo = {
    name: 'John Smith',
    employeeId: 'EXT001',
    email: 'john.smith@company.com',
    department: 'Engineering',
    supervisor: 'Sarah Johnson'
  };

  timesheetEntries: TimesheetEntry[] = [];
  editingEntry: TimesheetEntry | null = null;
  showAddEntryModal = false;
  isLoading = false;
  isCalendarView = false;

  newTimeEntry: any = {
    date: new Date(),
    startTime: '',
    duration: 0,
    description: '',
    status: 'draft'
  };

  weekStartDate: Date = this.getWeekStartDate();

  departments = [
    'Engineering',
    'Design',
    'Marketing',
    'Sales',
    'Support',
    'Operations',
    'HR'
  ];

  currentUserRole = {
    permissions: {
      canLogTime: true
    }
  };

  ngOnInit() {
    // Load sample data automatically when the component loads
    this.initializeSampleTimesheetEntries();
  }

  getWeekStartDate(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    return monday;
  }

  // Timesheet view methods
  setTimesheetView(view: string) {
    this.isCalendarView = view === 'calendar';

    // Debug calendar data when switching to calendar view
    if (view === 'calendar') {
      console.log('Switching to calendar view:', {
        totalEntries: this.timesheetEntries.length,
        weekData: this.getSafeTimesheetWeek(),
        sampleEntry: this.timesheetEntries[0] || 'No entries'
      });

      // Call debug method
      this.debugCalendarData();
    }
  }

  navigateTimesheetWeek(direction: 'prev' | 'next') {
    const newDate = new Date(this.weekStartDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    this.weekStartDate = newDate;
    this.loadTimesheetData();
  }

  loadTimesheetData() {
    // In a real app, this would load data from an API
    // For demo, we'll use sample data
  }

  getSafeTimesheetWeek() {
    const weekEnd = new Date(this.weekStartDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(this.weekStartDate);
      day.setDate(day.getDate() + i);
      days.push({
        date: day,
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
        totalHours: this.getDayTotalHours(day)
      });
    }

    return {
      weekStart: this.weekStartDate,
      weekEnd: weekEnd,
      days: days,
      totalHours: this.getTotalWeekHours() / 60 // Convert minutes to hours
    };
  }

  getDayTotalHours(date: Date): number {
    const dayEntries = this.timesheetEntries.filter(entry =>
      entry.date.toDateString() === date.toDateString()
    );
    return dayEntries.reduce((total, entry) => total + entry.duration, 0) / 60;
  }

  // Entry management methods
  getAllTimesheetEntries(): TimesheetEntry[] {
    return this.timesheetEntries.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  openAddEntryDialog() {
    this.newTimeEntry = {
      date: new Date(),
      startTime: '',
      duration: 0,
      description: '',
      status: 'draft'
    };
    this.showAddEntryModal = true;
  }

  closeAddEntryDialog() {
    this.showAddEntryModal = false;
    this.newTimeEntry = {
      date: new Date(),
      startTime: '',
      duration: 0,
      description: '',
      status: 'draft'
    };
  }

  isNewEntryValid(): boolean {
    return !!(
      this.newTimeEntry.date &&
      this.newTimeEntry.startTime &&
      this.newTimeEntry.duration > 0 &&
      this.newTimeEntry.description?.trim()
    );
  }

  saveNewTimeEntry() {
    if (!this.isNewEntryValid()) return;

    this.isLoading = true;

    const entry: TimesheetEntry = {
      id: Date.now().toString(),
      workOrderId: 1, // Default work order for external users
      userId: this.employeeInfo.employeeId || 'external',
      userName: this.employeeInfo.name || 'External User',
      userType: 'staff',
      date: new Date(this.newTimeEntry.date),
      startTime: this.newTimeEntry.startTime,
      duration: this.newTimeEntry.duration,
      description: this.newTimeEntry.description,
      status: this.newTimeEntry.status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simulate API call
    setTimeout(() => {
      this.timesheetEntries.push(entry);
      this.isLoading = false;
      this.closeAddEntryDialog();
    }, 500);
  }

  editTimeEntry(entry: TimesheetEntry) {
    this.editingEntry = { ...entry };
  }

  cancelEdit() {
    this.editingEntry = null;
  }

  saveTimeEntry() {
    if (!this.editingEntry) return;

    const index = this.timesheetEntries.findIndex(e => e.id === this.editingEntry!.id);
    if (index > -1) {
      this.editingEntry!.updatedAt = new Date();
      this.timesheetEntries[index] = { ...this.editingEntry };
    }
    this.editingEntry = null;
  }

  deleteTimeEntry(entryId: string) {
    if (!confirm('Are you sure you want to delete this timesheet entry?')) {
      return;
    }
    this.timesheetEntries = this.timesheetEntries.filter(entry => entry.id !== entryId);
  }

  viewTimeEntry(entry: TimesheetEntry) {
    // Show entry details - could open a modal
    console.log('Viewing entry:', entry);
  }

  // Utility methods
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  getDurationInHours(minutes: number): string {
    return (minutes / 60).toFixed(1) + 'h';
  }

  getTotalHours(): string {
    const totalMinutes = this.timesheetEntries.reduce((total, entry) => total + entry.duration, 0);
    return this.getDurationInHours(totalMinutes);
  }

  getTotalWeekHours(): number {
    return this.timesheetEntries.reduce((total, entry) => total + entry.duration, 0);
  }

  getWeekStatus(): string {
    if (this.timesheetEntries.length === 0) return 'draft';

    const hasApproved = this.timesheetEntries.some(entry => entry.status === 'approved');
    const hasSubmitted = this.timesheetEntries.some(entry => entry.status === 'submitted');
    const hasDraft = this.timesheetEntries.some(entry => entry.status === 'draft');

    if (hasApproved && !hasDraft && !hasSubmitted) return 'approved';
    if (hasSubmitted || hasApproved) return 'submitted';
    return 'draft';
  }

  clearAllTimesheetEntries() {
    this.timesheetEntries = [];
  }

  initializeSampleTimesheetEntries() {
    console.log('Initializing sample timesheet entries...');
    const today = new Date();
    // Use the same weekStartDate that the calendar uses
    const weekStart = this.weekStartDate;

    console.log('Week start date:', weekStart.toDateString());
    console.log('Current weekStartDate property:', this.weekStartDate.toDateString());

    const sampleEntries: TimesheetEntry[] = [
      // Monday
      {
        id: '1',
        workOrderId: 1001,
        userId: 'ext001',
        userName: this.employeeInfo.name,
        userType: 'staff',
        date: new Date(weekStart.getTime()),
        startTime: '09:00',
        duration: 480, // 8 hours
        description: 'Frontend development - User authentication module',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Tuesday
      {
        id: '2',
        workOrderId: 1002,
        userId: 'ext001',
        userName: this.employeeInfo.name,
        userType: 'staff',
        date: new Date(weekStart.getTime() + 86400000),
        startTime: '08:30',
        duration: 510, // 8.5 hours
        description: 'Database optimization and API integration',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Wednesday
      {
        id: '3',
        workOrderId: 1003,
        userId: 'ext001',
        userName: this.employeeInfo.name,
        userType: 'staff',
        date: new Date(weekStart.getTime() + 172800000),
        startTime: '09:15',
        duration: 450, // 7.5 hours
        description: 'Client meeting and requirements gathering',
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Thursday
      {
        id: '4',
        workOrderId: 1004,
        userId: 'ext001',
        userName: this.employeeInfo.name,
        userType: 'staff',
        date: new Date(weekStart.getTime() + 259200000),
        startTime: '09:00',
        duration: 480, // 8 hours
        description: 'Testing and bug fixes for payment gateway',
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Friday
      {
        id: '5',
        workOrderId: 1005,
        userId: 'ext001',
        userName: this.employeeInfo.name,
        userType: 'staff',
        date: new Date(weekStart.getTime() + 345600000),
        startTime: '08:45',
        duration: 420, // 7 hours
        description: 'Code review and documentation updates',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Friday - Second entry (different project)
      {
        id: '6',
        workOrderId: 1006,
        userId: 'ext001',
        userName: this.employeeInfo.name,
        userType: 'staff',
        date: new Date(weekStart.getTime() + 345600000),
        startTime: '16:00',
        duration: 120, // 2 hours
        description: 'Team standup and sprint planning',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.timesheetEntries = sampleEntries;

    console.log('Sample entries created:', {
      totalEntries: sampleEntries.length,
      entriesByDay: sampleEntries.map(e => ({
        id: e.id,
        date: e.date.toDateString(),
        startTime: e.startTime,
        description: e.description.substring(0, 30) + '...'
      })),
      weekStart: weekStart.toDateString()
    });
  }

  // Submission methods
  submitTimesheet() {
    if (this.timesheetEntries.length === 0) {
      alert('Please add at least one time entry before submitting.');
      return;
    }

    if (!this.employeeInfo.name || !this.employeeInfo.employeeId || !this.employeeInfo.email) {
      alert('Please fill in all required employee information.');
      return;
    }

    const timesheetData = {
      employee: this.employeeInfo,
      weekStartDate: this.weekStartDate,
      entries: this.timesheetEntries,
      totalHours: this.getTotalWeekHours() / 60,
      submittedAt: new Date().toISOString()
    };

    console.log('Timesheet submitted:', timesheetData);
    alert('Timesheet submitted successfully! Your supervisor will review it shortly.');

    // Mark all entries as submitted
    this.timesheetEntries.forEach(entry => {
      if (entry.status === 'draft') {
        entry.status = 'submitted';
      }
    });
  }

  exportToCSV() {
    if (this.timesheetEntries.length === 0) {
      alert('No time entries to export.');
      return;
    }

    const headers = ['Date', 'Start Time', 'Duration (min)', 'Description', 'Status'];
    const csvContent = [
      headers.join(','),
      ...this.timesheetEntries.map(entry => [
        entry.date.toISOString().split('T')[0],
        entry.startTime,
        entry.duration,
        `"${entry.description}"`,
        entry.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet-${this.weekStartDate.toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Calendar view helpers
  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }

  openTimeEntryModal(date: Date) {
    this.newTimeEntry.date = date;
    this.openAddEntryDialog();
  }

  // Time slots for calendar view (24 hour format)
  getTimeSlots() {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        displayTime: hour === 0 ? '12:00 AM' :
                    hour < 12 ? `${hour}:00 AM` :
                    hour === 12 ? '12:00 PM' :
                    `${hour - 12}:00 PM`
      });
    }
    return slots;
  }

  isCurrentTime(timeSlot: string): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const slotHour = parseInt(timeSlot.split(':')[0]);
    return currentHour === slotHour;
  }

  hasTimeEntryAtSlot(day: any, timeSlot: string): boolean {
    const dayEntries = this.getTimeEntriesForDay(day.date);
    return dayEntries.some(entry => {
      const entryHour = parseInt(entry.startTime.split(':')[0]);
      const slotHour = parseInt(timeSlot.split(':')[0]);
      return entryHour === slotHour;
    });
  }

  getTimeEntriesForDay(date: Date): TimesheetEntry[] {
    const dayEntries = this.timesheetEntries.filter(entry => {
      const entryDateStr = entry.date.toDateString();
      const targetDateStr = date.toDateString();
      return entryDateStr === targetDateStr;
    });

    // Debug logging
    if (dayEntries.length > 0) {
      console.log('getTimeEntriesForDay:', {
        targetDate: date.toDateString(),
        allEntries: this.timesheetEntries.length,
        dayEntries: dayEntries.length,
        dayEntriesData: dayEntries.map(e => ({ date: e.date.toDateString(), startTime: e.startTime, description: e.description }))
      });
    }

    return dayEntries;
  }

  getTimeEntriesForSlot(day: any, timeSlot: string): TimesheetEntry[] {
    const dayEntries = this.getTimeEntriesForDay(day.date);
    const slotHour = parseInt(timeSlot.split(':')[0]);

    const slotEntries = dayEntries.filter(entry => {
      const entryHour = parseInt(entry.startTime.split(':')[0]);
      return entryHour === slotHour;
    });

    // Debug logging for specific slots that should have data
    if (slotEntries.length > 0) {
      console.log('getTimeEntriesForSlot:', {
        day: day.date.toDateString(),
        timeSlot,
        slotHour,
        dayEntries: dayEntries.length,
        slotEntries: slotEntries.length,
        entryTimes: dayEntries.map(e => e.startTime)
      });
    }

    return slotEntries;
  }

  getEntryTopPosition(entry: TimesheetEntry): number {
    // Calculate position based on minutes within the hour
    const minutes = parseInt(entry.startTime.split(':')[1]);
    return (minutes / 60) * 100;
  }

  getEntryHeight(entry: TimesheetEntry): number {
    // Calculate height based on duration (max 60 minutes per hour slot)
    const maxDurationInSlot = Math.min(entry.duration, 60);
    return (maxDurationInSlot / 60) * 100;
  }

  openTimeEntryModalForSlot(date: Date, timeSlot: string) {
    this.selectedTimesheetDate = date;
    this.selectedTimeSlot = timeSlot;
    this.newTimeEntry = {
      date: date,
      startTime: timeSlot,
      duration: 60, // Default 1 hour
      description: '',
      status: 'draft'
    };
    this.openAddEntryDialog();
  }

  // Add missing properties
  selectedTimesheetDate: Date | null = null;
  selectedTimeSlot: string | null = null;

  // Debug method
  debugCalendarData() {
    const week = this.getSafeTimesheetWeek();
    const timeSlots = this.getTimeSlots();

    console.log('=== Calendar Debug ===');
    console.log('Week days:', week.days.map(d => d.date.toDateString()));
    console.log('Total timesheet entries:', this.timesheetEntries.length);

    week.days.forEach(day => {
      const dayEntries = this.getTimeEntriesForDay(day.date);
      console.log(`${day.dayName} (${day.date.toDateString()}):`, dayEntries.map(e => `${e.startTime} - ${e.description.substring(0, 20)}`));
    });
  }
}

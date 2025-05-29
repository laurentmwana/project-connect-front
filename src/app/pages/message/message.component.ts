import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Conversation } from '@/model/message.model';

@Component({
  selector: 'app-message',
  imports: [CommonModule, RouterLink],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  conversations: Conversation[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      initials: "SJ",
      message: "When can we schedule a call to discuss the project?",
      time: "10:15 AM",
    },
    {
      id: "2",
      name: "Michael Chen",
      initials: "MC",
      message: "I've shared the design files with you.",
      time: "Yesterday",
    },
    {
      id: "3",
      name: "E-commerce Project",
      initials: "EP",
      message: "Emily: I've updated the timeline for the project.",
      time: "Yesterday",
      isGroup: true,
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      initials: "AR",
      message: "Are you available for a new project next month?",
      time: "Monday",
    },
    {
      id: "5",
      name: "UX Design Team",
      initials: "UX",
      message: "Sarah: Let's meet tomorrow to discuss the user testing results.",
      time: "Monday",
      isGroup: true,
    },
    {
      id: "6",
      name: "David Wilson",
      initials: "DW",
      message: "Thanks for your help with the frontend implementation.",
      time: "Jul 15",
    },
    {
      id: "7",
      name: "Mobile App Project",
      initials: "MA",
      message: "John: I've pushed the latest changes to the repository.",
      time: "Jul 12",
      isGroup: true,
    },
  ]

}

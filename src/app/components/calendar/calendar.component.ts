import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';

import { InvitationserviceService } from 'src/app/services/invitationservice.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
     events: []
  };

  constructor(private invitationService: InvitationserviceService) {}

  ngOnInit(): void {
    this.invitationService.getInvitationsAcceptees().subscribe((events: any[]) => {
      this.calendarOptions.events = events.map(evt => ({
        title: evt.titre,
        start: evt.dateDebut,
        end: evt.dateFin
      }));
    });
  }
}
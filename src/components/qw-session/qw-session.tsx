import {Component, Event, EventEmitter} from '@stencil/core';
import {SessionLoaded$, SessionModel, SessionService} from '@qwentes/booking-state-manager';
import {debounceTime} from 'rxjs/operators';

@Component({
  tag: 'qw-session',
  styleUrl: 'qw-session.css',
  shadow: false,
})
export class QwSession {
  @Event() qwSessionChanged: EventEmitter<SessionModel>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$
      .pipe(debounceTime(300))
      .subscribe((session) => {
      this.qwSessionChanged.emit(session);
    });
  }
}

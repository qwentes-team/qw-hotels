import {Component, Event, EventEmitter} from '@stencil/core';
import {SessionLoaded$, SessionModel, SessionService} from '@qwentes/booking-state-manager';
import {debounceTime} from 'rxjs/operators';

@Component({
  tag: 'qw-session',
  styleUrl: 'qw-session.css',
  shadow: false,
})
export class QwSession {
  @Event() qwSessionChangedTrackingData: EventEmitter<SessionModel>;
  @Event() qwSessionLoaded: EventEmitter<SessionModel>;

  public componentWillLoad() {
    SessionService.getSession().subscribe(session => this.qwSessionLoaded.emit(session));
    SessionLoaded$
      .pipe(debounceTime(300))
      .subscribe((session) => {
        this.qwSessionChangedTrackingData.emit(session);
      });
  }
}

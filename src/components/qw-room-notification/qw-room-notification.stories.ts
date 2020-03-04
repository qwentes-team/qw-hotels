export default {
  title: 'Room/Room notification'
}

export const base = () => `
  <qw-room-notification></qw-room-notification>
  <hr>
  <h4>Use room list component to play and mutate the room notification behaviour</h4>
  <qw-room-list
    qw-room-list-show-prices="false"
    qw-room-list-show-rates="true"
    qw-room-list-type="card"
    qw-room-list-placeholders="2"></qw-room-list>
`;

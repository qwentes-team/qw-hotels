import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Room/Room detail'
}

export const base = () => `
  <qw-room-detail qw-room-detail-id="103252">
    <div slot="qwRoomDetailLoading">loading</div>
  </qw-room-detail>
  <hr>
  <h4>Use basket component to play and mutate the room detail behaviour</h4>
  <qw-basket qw-basket-show-price-if-empty="true" qw-basket-show-empty-button="true"></qw-basket>
`;

export const withImageResized = () => `
  <qw-room-detail
    qw-room-detail-id="103252"
    qw-room-detail-image-transformation-options='{"width": 2000}'>
    <div slot="qwRoomDetailLoading">loading</div>
  </qw-room-detail>
`;

window.addEventListener('qwRoomDetailAddToBasketSuccess', logEvent);
window.addEventListener('qwRoomDetailAddAnotherRoom', logEvent);
window.addEventListener('qwRoomDetailProceed', logEvent);

export default {
  title: 'Room/Room basket'
}

export const base = () => `
  <qw-room-basket>
    <div slot="qwRoomBasketLoading">loading room basket</div>
  </qw-room-basket>
  <hr>
  <h4>Use room list / basket component to play and mutate the room basket behaviour</h4>
    <qw-basket qw-basket-show-price-if-empty="true" qw-basket-show-empty-button="true"></qw-basket>
    <qw-room-list
      qw-room-list-show-prices="false"
      qw-room-list-show-rates="true"
      qw-room-list-type="card">
        <div slot="qwRoomListLoading">loading room list</div>
    </qw-room-list>
`;

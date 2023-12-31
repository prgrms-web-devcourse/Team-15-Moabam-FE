import paymentHandler from './payment';
import roomsHandlers from './rooms';
import membersHandlers from './members';
import bugsHandlers from './bugs';
import couponsHandlers from './coupons';
import itemHandlers from './item';
import reportsHandlers from './reports';
import notificationsHandlers from './notifications';
import timeHandler from './time';
import rankHandler from './rank';

const handlers = [
  ...roomsHandlers,
  ...membersHandlers,
  ...bugsHandlers,
  ...couponsHandlers,
  ...itemHandlers,
  ...reportsHandlers,
  ...notificationsHandlers,
  ...paymentHandler,
  ...rankHandler,
  timeHandler
];

export default handlers;

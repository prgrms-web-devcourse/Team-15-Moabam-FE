import { MyCoupon } from '@/core/types';

export const MY_COUPON: MyCoupon[] = [
  {
    walletId: 1,
    id: 1,
    name: '아침쿠폰',
    point: 10,
    description: '누가 나를 깨웠는가!',
    type: 'MORNING'
  },
  {
    walletId: 1123,
    id: 2,
    name: '밤쿠폰',
    point: 1,
    description: '누가 나를 재웠는가!',
    type: 'NIGHT'
  },
  {
    walletId: 1221,
    id: 5,
    name: '돈이 체고야',
    point: 1777,
    description: '행운의 주인공!',
    type: 'GOLDEN'
  },
  {
    walletId: 1523,
    id: 21,
    name: '결제할인',
    point: 10,
    description: '흑흑!',
    type: 'DISCOUNT'
  },
  {
    walletId: 1666,
    id: 26,
    name: '결제할인',
    point: 99,
    description: '엉엉',
    type: 'DISCOUNT'
  }
];

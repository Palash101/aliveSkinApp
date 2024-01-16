import {assets} from '../config/AssetsConfig';

export const bottomMenu = [
  {
    label: 'HOME',
    name: 'home',
    active: assets.home,
    inActive: assets.home,
  },
  {
    label: 'SHOP',
    name: 'products',
    active: assets.product,
    inActive: assets.product,
  },
  {
    label: 'SCHEDULE',
    name: 'Slots',
    active: assets.calendar,
    inActive: assets.calendar,
  },
  {
    label: 'BLOGS',
    name: 'blogs',
    active: assets.blog,
    inActive: assets.blog,
  },
  {
    label: 'PROFILE',
    name: 'profile',
    active: assets.profile,
    inActive: assets.profile,
  },
];

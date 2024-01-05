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
    label: 'REWARDS',
    name: 'rewards',
    active: assets.reward,
    inActive: assets.reward,
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

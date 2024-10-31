import { RouteRecordRaw } from 'vue-router';
import { Layout, MobileLayout, } from '@/router/constant';
import { ProfileOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/mobile',
    name: 'MobileFrame',
    redirect: '/mobile/home',
    component: MobileLayout,
    meta: {
      title: '设材超市',
      icon: renderIcon(ProfileOutlined),
      sort: 3,
    },
    children: [
      {
        path: 'home',
        name: 'MobileHome',
        meta: {
          title: '主页',
        },
        component: () => import('@/views/mobile/index.vue'),
      },
    ],
  },
];

export default routes;

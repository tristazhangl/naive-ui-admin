import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { CheckCircleOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/product',
    name: 'product',
    redirect: '/product/productList',
    component: Layout,
    meta: {
      title: '在库设材',
      icon: renderIcon(CheckCircleOutlined),
      sort: 4,
      // permissions: ['设材管理'],
    },
    children: [
      {
        path: 'productList',
        name: 'productList',
        meta: {
          title: '设材管理',
          // permissions: ['设材管理'],
          keepAlive: true,
        },
        component: () => import('@/views/product/productList.vue'),
      },
      {
        path: 'productView',
        name: 'productView',
        meta: {
          title: '设材详情',
          hidden: true,
          // permissions: ['设材管理'],
        },
        component: () => import('@/views/product/productView.vue'),
      },
    ],
  },
];

export default routes;

import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../Layouts/LayoutMain.vue'),
    meta: {
      title: 'Supabase Chat App',
    },
    children: [
      {
        path: '/welcome',
        alias: '/',
        name: 'PageWelcome',
        component: () => import('../pages/PageWelcome.vue'),
      },
      {
        path: '/chat',
        name: 'PageChat',
        component: () => import('../pages/PageChat.vue'),
      },
    ],
  },
]

export default routes

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/game/:level',
      props: (route) => ({
        level: parseInt(route.params.level as string, 10),
      }),
      name: 'game',
      component: () => import('../views/GameView.vue'),
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('../views/SettingView.vue'),
    },
  ],
})

router.afterEach((route) => {
  if (route.name === 'game') {
    document.title = `Level ${String(route.params.level)} - Queener`
    return
  }

  document.title = route.name === 'setting' ? 'Settings - Queener' : 'Queener'
})

export default router

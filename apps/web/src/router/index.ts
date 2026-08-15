import { createRouter, createWebHistory } from 'vue-router'
import { useGameSessionStore } from '@/modules/stores/gameSession'
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

const getRouteLevel = (value: unknown): number | null => {
  const rawLevel = Array.isArray(value) ? value[0] : value
  if (typeof rawLevel !== 'string') return null

  const level = Number(rawLevel)
  return Number.isInteger(level) && level > 0 ? level : null
}

router.beforeEach((route) => {
  if (route.name !== 'game') return true

  const gameSessionStore = useGameSessionStore()
  const level = getRouteLevel(route.params.level)
  if (level !== null && gameSessionStore.canEnterLevel(level)) return true

  gameSessionStore.endSession()
  return { name: 'home' }
})

router.afterEach((route, previousRoute, failure) => {
  if (!failure && previousRoute.name === 'game' && route.name !== 'game') {
    useGameSessionStore().endSession()
  }

  if (route.name === 'game') {
    document.title = `Level ${String(route.params.level)} - Queener`
    return
  }

  document.title = route.name === 'setting' ? 'Settings - Queener' : 'Queener'
})

export default router

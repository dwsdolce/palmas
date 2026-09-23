import type { RouteRecordRaw } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { usePatternStore } from 'src/stores/patterns'

const selectedContextName = useStorage('selected-context-name', 'flamenco')
const selectedPatternName = useStorage('selected-pattern-name', 'alegria')


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: () => import('layouts/MainLayout.vue'),
    children: [
       {
        path: ':context',
        name: 'context',
        // Returns a value rather than calling next(). The callback form is
        // deprecated in vue-router 5 (VUE_ROUTER_R0025) and warns on every
        // navigation: returning nothing or true lets the navigation through,
        // and returning a location redirects to it.
        beforeEnter: async (to) => {
          const patternStore = usePatternStore()

          const { data } = storeToRefs(patternStore)
          const { initStore } = patternStore

          if (data.value.length === 0) {
            await initStore()
          }

          const pattern = data.value.find(p => to.params.pattern === p.name)

          return pattern ? true : { name: 'not-found' }
        },
        children: [
          {
            path: ':pattern',
            name: 'pattern',
            component: () => import('pages/MainPage.vue')
          }
        ]
      },
      {
        path: '',
        name: 'home',
        redirect: `/${selectedContextName.value}/${selectedPatternName.value}`
      },
      {
        path: 'privacy-policy',
        name: 'privacy-policy',
        component: () => import('pages/PrivacyPolicy.vue')
      },
      {
        path: 'tuning-fork',
        name: 'tuning-fork',
        component: () => import('pages/TuningFork.vue')
      },
      {
        path: 'changelog',
        name: 'changelog',
        component: () => import('pages/ChangelogPage.vue')
      },
      {
        path: 'not-found',
        name: 'not-found',
        component: () => import('pages/NotFound.vue')
      },
      {
        path: ':pathMatch(.*)*',
        redirect: '/not-found'
      }
    ]
  }
]

export default routes

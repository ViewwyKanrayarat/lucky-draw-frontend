import { createRouter, createWebHistory } from 'vue-router'
import User from '../views/user/userPage.vue'
import Admin from '../views/admin/adminPage.vue'


const routes = [
  {
    path: '/',
    name: 'User',
    component: User
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
]


const router = createRouter({
  history:createWebHistory(),
  routes
})

export default router
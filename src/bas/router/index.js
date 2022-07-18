const basRoutes = [
  {
    path: '/login',
    component: () => import('@/bas/views/login')
  },
  {
    path: '/demo',
    component: () => import('@/bas/views/demo')
  }
]
export default basRoutes

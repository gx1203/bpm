const prefix = process.env.VUE_APP_PROJECT_PREFIX
const routerPath = routers => routers.map(route => {
  route.path = `${prefix}${route.path}`
  if (route.redirect) {
    route.redirect = `${prefix}${route.redirect}`
  }
  return route
})

export { routerPath }

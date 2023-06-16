import 'lib/boot/routes'
import router from 'lib/site/boot/router'
import AcercaDe from './pages/acerca-de'
import TyC from './pages/terminos-y-condiciones'
import ForoPresencial from './pages/agenda'

router.childRoutes.unshift({
  path: 's/acerca-de',
  component: AcercaDe
})

router.childRoutes.unshift({
  path: 's/terminos-y-condiciones',
  component: TyC
})

router.childRoutes.unshift({
  path: 's/agenda',
  component: ForoPresencial
})

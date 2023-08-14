import BaseLayout from './base'
import { ILayout } from './common/types'
import HomeLayout from './home'

const layoutContainers = {
  base: BaseLayout,
  home: HomeLayout
  // if needed - add more layout containers here
}

interface ILayoutFactory extends ILayout {
  type: keyof typeof layoutContainers
}

function Layout({
  children,
  pageTitle,
  type,
  showMeta,
  className
}: ILayoutFactory) {
  const Container = layoutContainers[type]

  return (
    <Container
      pageTitle={pageTitle}
      showMeta={showMeta}
      className={className}
    >
      {children}
    </Container>
  )
}

export default Layout

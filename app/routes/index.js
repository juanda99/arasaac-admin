// @material-ui/icons
import React from 'react'
import { compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import PictogramUploadIcon from '@material-ui/icons/AddPhotoAlternate'
import PictogramsIcon from '@material-ui/icons/Collections'
import CatalogsIcon from '@material-ui/icons/PhotoLibrary'
import TagsIcon from '@material-ui/icons/Style'
import UsersIcon from '@material-ui/icons/People'
import NewsIcon from '@material-ui/icons/Chat'
import CreateIcon from '@material-ui/icons/Create'
import SearchIcon from '@material-ui/icons/Search'
import UserView from 'containers/UserView/Loadable'
import UsersView from 'containers/UsersView/Loadable'
import News from 'containers/News/Loadable'
import AddNews from 'containers/AddNews/Loadable'
import PictogramsView from 'containers/PictogramsView/Loadable'
import SigninView from 'containers/SigninView/Loadable'
import CatalogsView from 'containers/CatalogsView/Loadable'
import AddPictograms from 'containers/AddPictograms/Loadable'

import {
  userIsAuthenticatedRedir,
  userIsNotAuthenticatedRedir,
  userIsAdminRedir,
  userIsAuthenticated,
  userIsNotAuthenticated,
} from 'utils/auth'

import messages from './messages'
// import ErrorBoundary from 'components/ErrorBoundary'

// userIsAuthenticated and userIsAdmin from above
// const userIsAdminChain = compose(
//   userIsAuthenticated,
//   userIsAdmin,
// )

const AuthUsersView = userIsAuthenticatedRedir(UsersView)
const AuthSigninView = userIsNotAuthenticatedRedir(SigninView)

const sidebarRoutes = [
  {
    title: <FormattedMessage {...messages.pictograms} />,
    icon: PictogramsIcon,
    isSidebar: true,
    children: [
      {
        path: '/pictograms/add',
        title: <FormattedMessage {...messages.uploadPictograms} />,
        icon: PictogramUploadIcon,
        component: AddPictograms,
      },
      {
        path: '/pictograms/',
        title: <FormattedMessage {...messages.tagPictograms} />,
        icon: TagsIcon,
        component: PictogramsView,
      },
      {
        path: '/catalogs/',
        title: <FormattedMessage {...messages.catalogs} />,
        icon: CatalogsIcon,
        component: CatalogsView,
      },
    ],
  },
  {
    title: <FormattedMessage {...messages.news} />,
    icon: NewsIcon,
    isSidebar: true,
    children: [
      {
        path: '/news/add',
        title: <FormattedMessage {...messages.createNew} />,
        icon: CreateIcon,
        component: AddNews,
      },
      {
        path: '/news',
        title: <FormattedMessage {...messages.searchNews} />,
        icon: SearchIcon,
        component: News,
      },
    ],
  },
  // before /users ?
  {
    path: '/users/:idUser',
    component: UserView,
  },
  {
    path: '/users',
    title: <FormattedMessage {...messages.users} />,
    icon: UsersIcon,
    isSidebar: true,
    component: AuthUsersView,
    // component: ErrorBoundary,
  },
  {
    path: '/pictograms/search/:searchText',
    component: PictogramsView,
  },
  {
    path: '/signin',
    icon: UsersIcon,
    component: SigninView,
  },
]

export default sidebarRoutes

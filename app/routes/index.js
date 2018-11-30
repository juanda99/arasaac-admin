// @material-ui/icons
import React from 'react'
import { FormattedMessage } from 'react-intl'
import PictogramUploadIcon from '@material-ui/icons/AddPhotoAlternate'
import PictogramsIcon from '@material-ui/icons/Collections'
import TagsIcon from '@material-ui/icons/Style'
import UsersIcon from '@material-ui/icons/People'
import NewsIcon from '@material-ui/icons/Chat'
import CreateIcon from '@material-ui/icons/Create'
import SearchIcon from '@material-ui/icons/Search'
import UsersView from 'containers/UsersView/Loadable'
import News from 'containers/News/Loadable'
import AddNews from 'containers/AddNews/Loadable'
import PictogramsView from 'containers/PictogramsView/Loadable'
import AddPictograms from 'containers/AddPictograms/Loadable'
// import ErrorBoundary from 'components/ErrorBoundary'
import messages from './messages'

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
  {
    path: '/users',
    title: <FormattedMessage {...messages.users} />,
    icon: UsersIcon,
    isSidebar: true,
    component: UsersView,
    // component: ErrorBoundary,
  },
  {
    path: '/pictograms/search/:searchText?',
    component: PictogramsView,
  },
]

export default sidebarRoutes

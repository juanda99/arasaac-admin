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
import Users from 'containers/Users/Loadable'
import News from 'containers/News/Loadable'
import AddNews from 'containers/AddNews/Loadable'
import Pictograms from 'containers/Pictograms/Loadable'
import AddPictograms from 'containers/AddPictograms/Loadable'
import messages from './messages'

const sidebarRoutes = [
  {
    title: <FormattedMessage {...messages.pictograms} />,
    icon: PictogramsIcon,
    children: [
      {
        path: '/pictograms/add',
        title: <FormattedMessage {...messages.uploadPictograms} />,
        icon: PictogramUploadIcon,
        component: AddPictograms,
      },
      {
        path: '/pictograms',
        title: <FormattedMessage {...messages.tagPictograms} />,
        icon: TagsIcon,
        component: Pictograms,
      },
    ],
  },
  {
    title: <FormattedMessage {...messages.news} />,
    icon: NewsIcon,
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
    component: Users,
  },
]

export default sidebarRoutes

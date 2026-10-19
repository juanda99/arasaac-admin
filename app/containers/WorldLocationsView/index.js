import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'

import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import Badge from '@material-ui/core/Badge'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import InputAdornment from '@material-ui/core/InputAdornment'

import SearchIcon from '@material-ui/icons/Search'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import AddIcon from '@material-ui/icons/Add'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'

import View from 'components/View'
import api from 'services'
import { makeSelectHasUser } from 'containers/App/selectors'
import messages from './messages'

export const MAX_IMAGES = 15
export const MAX_DESCRIPTION_LENGTH = 1800
export const MAX_DESCRIPTION_WORDS = 300

export const formatDate = (val, intl) => {
  if (!val) return '-'
  try {
    const d = new Date(val)
    if (isNaN(d.getTime())) return '-'
    if (intl && typeof intl.formatDate === 'function') {
      return intl.formatDate(d, { year: 'numeric', month: '2-digit', day: '2-digit' })
    }
    return d.toISOString().slice(0, 10)
  } catch (e) {
    return '-'
  }
}

export const getFilePreviewUrl = file => {
  if (!file) return ''
  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    try {
      return URL.createObjectURL(file)
    } catch (e) {
      return ''
    }
  }
  return ''
}

export const getComparator = (order, orderBy) => (a, b) => {
  let aVal
  let bVal

  if (orderBy === 'date') {
    aVal = a.created ? new Date(a.created).getTime() : (a.id || 0)
    bVal = b.created ? new Date(b.created).getTime() : (b.id || 0)
  } else if (orderBy === 'name') {
    aVal = (a.name || '').toLowerCase()
    bVal = (b.name || '').toLowerCase()
  } else if (orderBy === 'tipo') {
    aVal = (a.tipo || '').toLowerCase()
    bVal = (b.tipo || '').toLowerCase()
  } else if (orderBy === 'location') {
    aVal = [a.address && a.address.city, a.address && a.address.country].filter(Boolean).join(', ').toLowerCase()
    bVal = [b.address && b.address.city, b.address && b.address.country].filter(Boolean).join(', ').toLowerCase()
  } else if (orderBy === 'author') {
    aVal = (a.email || '').toLowerCase()
    bVal = (b.email || '').toLowerCase()
  } else if (orderBy === 'status') {
    aVal = a.status || 0
    bVal = b.status || 0
  } else {
    aVal = a[orderBy] || ''
    bVal = b[orderBy] || ''
  }

  if (bVal < aVal) {
    return order === 'desc' ? -1 : 1
  }
  if (bVal > aVal) {
    return order === 'desc' ? 1 : -1
  }
  return 0
}

export const countWords = text => {
  if (!text || typeof text !== 'string') return 0
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

export const CATEGORY_OPTIONS = [
  { value: 'Educación', messageKey: 'categoryEducacion' },
  { value: 'Localidades', messageKey: 'categoryLocalidades' },
  { value: 'Salud', messageKey: 'categorySalud' },
  { value: 'Asociaciones y fundaciones', messageKey: 'categoryAsociaciones' },
  { value: 'Cultura', messageKey: 'categoryCultura' },
  { value: 'Ocio y Turismo', messageKey: 'categoryOcioTurismo' },
  { value: 'Comercios', messageKey: 'categoryComercios' },
  { value: 'Web y software', messageKey: 'categorySoftware' },
  { value: 'Deporte', messageKey: 'categoryDeporte' },
  { value: 'Transportes', messageKey: 'categoryTransportes' },
  { value: 'Administración pública', messageKey: 'categoryOrganismos' },
  { value: 'Accesibilidad vial y espacio urbano', messageKey: 'categoryAccesibilidadVial' },
  { value: 'Residencias y centros atención', messageKey: 'categoryResidencias' },
  { value: 'Seguridad y emergencias', messageKey: 'categorySeguridad' },
  { value: 'Justicia', messageKey: 'categoryJusticia' },
  { value: 'Otro', messageKey: 'categoryOtro' },
]

export const getCategoryLabel = (tipo, formatMessage) => {
  if (!tipo) return ''
  const cat = CATEGORY_OPTIONS.find(c => c.value.toLowerCase() === tipo.toLowerCase())
  if (cat && messages[cat.messageKey]) {
    return formatMessage(messages[cat.messageKey])
  }
  return tipo
}

const LINK_TYPES = [
  { value: 'web', messageKey: 'mainWeb' },
  { value: 'project', messageKey: 'proyectWeb' },
  { value: 'news', messageKey: 'urlNews' },
  { value: 'award', messageKey: 'award' },
  { value: 'other', messageKey: 'other' },
]

const styles = {
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  searchField: {
    minWidth: '280px',
  },
  tableWrapper: {
    marginTop: '16px',
    overflowX: 'auto',
  },
  chipPending: {
    backgroundColor: '#fff3e0',
    color: '#e65100',
    fontWeight: 'bold',
  },
  chipPublished: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  actionBtns: {
    display: 'flex',
    gap: '4px',
  },
  detailSection: {
    marginBottom: '16px',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: '0.85rem',
  },
  detailText: {
    fontSize: '0.95rem',
    color: '#222',
    marginBottom: '8px',
  },
  thumbnailsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  thumbnail: {
    width: '90px',
    height: '90px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
  linkBtn: {
    marginRight: '8px',
    marginBottom: '8px',
  },
}

export class WorldLocationsView extends PureComponent {
  static propTypes = {
    token: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
  }

  state = {
    locations: [],
    loading: true,
    tabValue: 0, // 0: Pending, 1: Published, 2: All
    searchQuery: '',
    selectedCategory: '',
    orderBy: 'date',
    order: 'desc',
    page: 0,
    rowsPerPage: 25,
    selectedLocation: null,
    detailDialogOpen: false,
    editDialogOpen: false,
    deleteDialogOpen: false,
    newDialogOpen: false,
    editFormData: {},
    newFormData: {},
    snackbarOpen: false,
    snackbarMessage: '',
    actionLoading: false,
  }

  componentDidMount() {
    this.fetchLocations()
  }

  fetchLocations = async () => {
    this.setState({ loading: true })
    try {
      const { token } = this.props
      // Admin request without status returns published, status=2 returns pending
      // Fetch both published and pending to have full admin visibility
      const [published, pending] = await Promise.all([
        api.WORLD_LOCATIONS_REQUEST({ token, status: 1 }),
        api.WORLD_LOCATIONS_REQUEST({ token, status: 2 }),
      ])
      const combined = [...(Array.isArray(pending) ? pending : []), ...(Array.isArray(published) ? published : [])]
      this.setState({ locations: combined, loading: false })
    } catch (err) {
      this.setState({ loading: false })
      this.showSnackbar(err.message || 'Error fetching locations')
    }
  }

  showSnackbar = message => {
    this.setState({ snackbarOpen: true, snackbarMessage: message })
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false })
  }

  handleTabChange = (event, tabValue) => {
    if (tabValue === 2) {
      this.setState({ tabValue, page: 0, orderBy: 'date', order: 'desc' })
    } else {
      this.setState({ tabValue, page: 0 })
    }
  }

  handleCategoryFilterChange = event => {
    this.setState({ selectedCategory: event.target.value, page: 0 })
  }

  handleRequestSort = property => {
    const isAsc = this.state.orderBy === property && this.state.order === 'asc'
    this.setState({
      order: isAsc ? 'desc' : 'asc',
      orderBy: property,
      page: 0,
    })
  }

  handleSearchChange = event => {
    this.setState({ searchQuery: event.target.value, page: 0 })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 })
  }

  handleOpenDetail = location => {
    this.setState({ selectedLocation: location, detailDialogOpen: true })
  }

  handleCloseDetail = () => {
    this.setState({ detailDialogOpen: false })
  }

  renderDetailLinks = () => {
    const { selectedLocation } = this.state
    if (!selectedLocation) return null

    const buttons = []
    if (Array.isArray(selectedLocation.links)) {
      selectedLocation.links.forEach((link, idx) => {
        const typeObj = LINK_TYPES.find(t => t.value === link.type) || { messageKey: 'mainWeb' }
        buttons.push(
          <Button
            key={link.url || `detail-link-${link.type || 'web'}-${idx}`}
            size="small"
            variant="outlined"
            href={link.url || link.enlace}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.linkBtn}
            endIcon={<OpenInNewIcon />}
          >
            <FormattedMessage {...messages[typeObj.messageKey] || messages.mainWeb} />
          </Button>,
        )
      })
    } else if (selectedLocation.links) {
      if (selectedLocation.links.mainWeb) {
        buttons.push(
          <Button
            key="legacy-mainWeb"
            size="small"
            variant="outlined"
            href={selectedLocation.links.mainWeb}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.linkBtn}
            endIcon={<OpenInNewIcon />}
          >
            <FormattedMessage {...messages.mainWeb} />
          </Button>,
        )
      }
      if (selectedLocation.links.proyectWeb) {
        buttons.push(
          <Button
            key="legacy-proyectWeb"
            size="small"
            variant="outlined"
            href={selectedLocation.links.proyectWeb}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.linkBtn}
            endIcon={<OpenInNewIcon />}
          >
            <FormattedMessage {...messages.proyectWeb} />
          </Button>,
        )
      }
      if (selectedLocation.links.urlNews) {
        buttons.push(
          <Button
            key="legacy-urlNews"
            size="small"
            variant="outlined"
            href={selectedLocation.links.urlNews}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.linkBtn}
            endIcon={<OpenInNewIcon />}
          >
            <FormattedMessage {...messages.urlNews} />
          </Button>,
        )
      }
    }

    if (selectedLocation.video) {
      buttons.push(
        <Button
          key="detail-video"
          size="small"
          variant="outlined"
          href={selectedLocation.video}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.linkBtn}
          endIcon={<OpenInNewIcon />}
        >
          <FormattedMessage {...messages.video} />
        </Button>,
      )
    }

    return buttons
  }

  handleOpenEdit = location => {
    let initialLinks = []
    if (Array.isArray(location.links)) {
      initialLinks = location.links.map((l, idx) => ({
        id: `link-${idx}-${Date.now()}`,
        url: l.url || l.enlace || '',
        type: l.type || l.tipo || 'web',
      }))
    } else if (location.links && typeof location.links === 'object') {
      if (location.links.mainWeb) {
        initialLinks.push({ id: `link-main-${Date.now()}`, url: location.links.mainWeb, type: 'web' })
      }
      if (location.links.proyectWeb) {
        initialLinks.push({ id: `link-project-${Date.now()}`, url: location.links.proyectWeb, type: 'project' })
      }
      if (location.links.urlNews) {
        initialLinks.push({ id: `link-news-${Date.now()}`, url: location.links.urlNews, type: 'news' })
      }
    }

    this.setState({
      selectedLocation: location,
      editFormData: {
        name: location.name || '',
        tipo: location.tipo || 'Educación',
        status: location.status !== undefined ? location.status : 1,
        description: location.description || '',
        latitude: location.latitude !== undefined ? String(location.latitude) : '',
        longitude: location.longitude !== undefined ? String(location.longitude) : '',
        address: (location.address && location.address.address) || '',
        city: (location.address && location.address.city) || '',
        postalCode: (location.address && location.address.postalCode) || '',
        province: (location.address && location.address.province) || '',
        country: (location.address && location.address.country) || '',
        links: initialLinks,
        pictures: Array.isArray(location.pictures) ? [...location.pictures] : [],
        newFiles: [],
        video: location.video || '',
        email: location.email || '',
      },
      editDialogOpen: true,
    })
  }

  handleCloseEdit = () => {
    this.setState({ editDialogOpen: false })
  }

  handleEditInputChange = field => event => {
    const { value } = event.target
    this.setState(prevState => ({
      editFormData: {
        ...prevState.editFormData,
        [field]: value,
      },
    }))
  }

  handleRemovePhoto = index => () => {
    this.setState(prevState => ({
      editFormData: {
        ...prevState.editFormData,
        pictures: (prevState.editFormData.pictures || []).filter((_, i) => i !== index),
      },
    }))
  }

  handleEditFilesChange = event => {
    const { formatMessage } = this.props.intl
    const selectedFiles = Array.from(event.target.files || [])
    const { editFormData } = this.state
    const currentCount = (editFormData.pictures || []).length + (editFormData.newFiles || []).length
    if (currentCount + selectedFiles.length > MAX_IMAGES) {
      this.showSnackbar(formatMessage(messages.maxPhotosReached))
      return
    }
    this.setState(prevState => ({
      editFormData: {
        ...prevState.editFormData,
        newFiles: [...(prevState.editFormData.newFiles || []), ...selectedFiles],
      },
    }))
    event.target.value = ''
  }

  handleRemoveNewFile = index => () => {
    this.setState(prevState => ({
      editFormData: {
        ...prevState.editFormData,
        newFiles: (prevState.editFormData.newFiles || []).filter((_, i) => i !== index),
      },
    }))
  }

  handleAddLink = () => {
    this.setState(prevState => ({
      editFormData: {
        ...prevState.editFormData,
        links: [
          ...(prevState.editFormData.links || []),
          { id: `link-new-${Date.now()}-${Math.random()}`, url: '', type: 'web' },
        ],
      },
    }))
  }

  handleRemoveLink = index => () => {
    this.setState(prevState => ({
      editFormData: {
        ...prevState.editFormData,
        links: (prevState.editFormData.links || []).filter((_, i) => i !== index),
      },
    }))
  }

  handleLinkChange = (index, field) => event => {
    const { value } = event.target
    this.setState(prevState => {
      const links = [...(prevState.editFormData.links || [])]
      links[index] = { ...links[index], [field]: value }
      return {
        editFormData: {
          ...prevState.editFormData,
          links,
        },
      }
    })
  }

  handleSaveEdit = async () => {
    const { token, intl } = this.props
    const { formatMessage } = intl
    const { selectedLocation, editFormData } = this.state

    if (!editFormData.name || !editFormData.name.trim()) {
      this.showSnackbar(formatMessage(messages.nameRequired))
      return
    }

    if (!editFormData.tipo || !editFormData.tipo.trim()) {
      this.showSnackbar(formatMessage(messages.categoryRequired))
      return
    }

    if (!editFormData.description || !editFormData.description.trim()) {
      this.showSnackbar(formatMessage(messages.descriptionRequired))
      return
    }

    if (
      editFormData.description.length > MAX_DESCRIPTION_LENGTH ||
      countWords(editFormData.description) > MAX_DESCRIPTION_WORDS
    ) {
      this.showSnackbar(formatMessage(messages.descriptionTooLong))
      return
    }

    const totalPics = (editFormData.pictures || []).length + (editFormData.newFiles || []).length
    if (totalPics > MAX_IMAGES) {
      this.showSnackbar(formatMessage(messages.maxPhotosReached))
      return
    }

    this.setState({ actionLoading: true })

    try {
      const payload = {
        name: editFormData.name.trim(),
        tipo: editFormData.tipo.trim(),
        status: parseInt(editFormData.status !== undefined ? editFormData.status : 1, 10),
        description: editFormData.description.trim(),
        latitude: parseFloat(editFormData.latitude),
        longitude: parseFloat(editFormData.longitude),
        address: {
          address: editFormData.address,
          city: editFormData.city,
          postalCode: editFormData.postalCode,
          province: editFormData.province,
          country: editFormData.country,
        },
        links: (editFormData.links || [])
          .map(l => ({ url: (l.url || '').trim(), type: l.type || 'web' }))
          .filter(l => l.url.length > 0),
        pictures: editFormData.pictures || [],
        picture: (editFormData.pictures && editFormData.pictures[0]) || '',
        video: editFormData.video,
        email: editFormData.email,
      }

      let requestData = payload
      if (editFormData.newFiles && editFormData.newFiles.length > 0) {
        const formData = new FormData()
        formData.append('formData', JSON.stringify(payload))
        editFormData.newFiles.forEach(file => {
          formData.append('images', file)
        })
        requestData = formData
      }

      await api.WORLD_LOCATION_UPDATE_REQUEST({
        id: selectedLocation.id || selectedLocation._id,
        data: requestData,
        token,
      })

      this.setState({ editDialogOpen: false, actionLoading: false })
      this.showSnackbar(formatMessage(messages.updatedSuccess))
      this.fetchLocations()
    } catch (err) {
      this.setState({ actionLoading: false })
      this.showSnackbar(err.message || 'Error updating location')
    }
  }

  handleApprove = async location => {
    const { token, intl } = this.props
    const { formatMessage } = intl
    this.setState({ actionLoading: true })

    try {
      await api.WORLD_LOCATION_UPDATE_REQUEST({
        id: location.id || location._id,
        data: { status: 1 },
        token,
      })

      this.setState({
        detailDialogOpen: false,
        actionLoading: false,
      })
      this.showSnackbar(formatMessage(messages.approvedSuccess))
      this.fetchLocations()
    } catch (err) {
      this.setState({ actionLoading: false })
      this.showSnackbar(err.message || 'Error approving location')
    }
  }

  handleUnpublish = async location => {
    const { token, intl } = this.props
    const { formatMessage } = intl
    this.setState({ actionLoading: true })

    try {
      await api.WORLD_LOCATION_UPDATE_REQUEST({
        id: location.id || location._id,
        data: { status: 2 },
        token,
      })

      this.setState({
        detailDialogOpen: false,
        actionLoading: false,
      })
      this.showSnackbar(formatMessage(messages.unpublishedSuccess))
      this.fetchLocations()
    } catch (err) {
      this.setState({ actionLoading: false })
      this.showSnackbar(err.message || 'Error unpublishing location')
    }
  }

  handleOpenNewDialog = () => {
    this.setState({
      newDialogOpen: true,
      newFormData: {
        name: '',
        tipo: 'Educación',
        status: 1,
        description: '',
        latitude: '',
        longitude: '',
        address: '',
        city: '',
        postalCode: '',
        province: '',
        country: '',
        links: [],
        files: [],
        video: '',
        email: '',
      },
    })
  }

  handleCloseNewDialog = () => {
    this.setState({ newDialogOpen: false })
  }

  handleNewInputChange = field => event => {
    const { value } = event.target
    this.setState(prevState => ({
      newFormData: {
        ...prevState.newFormData,
        [field]: value,
      },
    }))
  }

  handleAddNewLink = () => {
    this.setState(prevState => ({
      newFormData: {
        ...prevState.newFormData,
        links: [
          ...(prevState.newFormData.links || []),
          { id: `link-new-${Date.now()}-${Math.random()}`, url: '', type: 'web' },
        ],
      },
    }))
  }

  handleRemoveNewLink = index => () => {
    this.setState(prevState => ({
      newFormData: {
        ...prevState.newFormData,
        links: (prevState.newFormData.links || []).filter((_, i) => i !== index),
      },
    }))
  }

  handleNewLinkChange = (index, field) => event => {
    const { value } = event.target
    this.setState(prevState => {
      const links = [...(prevState.newFormData.links || [])]
      links[index] = { ...links[index], [field]: value }
      return {
        newFormData: {
          ...prevState.newFormData,
          links,
        },
      }
    })
  }

  handleNewFilesChange = event => {
    const { formatMessage } = this.props.intl
    const selectedFiles = Array.from(event.target.files || [])
    const { newFormData } = this.state
    const currentCount = (newFormData.files || []).length
    if (currentCount + selectedFiles.length > MAX_IMAGES) {
      this.showSnackbar(formatMessage(messages.maxPhotosReached))
      return
    }
    this.setState(prevState => ({
      newFormData: {
        ...prevState.newFormData,
        files: [...(prevState.newFormData.files || []), ...selectedFiles],
      },
    }))
    event.target.value = ''
  }

  handleRemoveNewUploadFile = index => () => {
    this.setState(prevState => ({
      newFormData: {
        ...prevState.newFormData,
        files: (prevState.newFormData.files || []).filter((_, i) => i !== index),
      },
    }))
  }

  handleSaveNew = async () => {
    const { token, intl } = this.props
    const { formatMessage } = intl
    const { newFormData } = this.state

    if (!newFormData.name || !newFormData.name.trim()) {
      this.showSnackbar(formatMessage(messages.nameRequired))
      return
    }

    if (!newFormData.tipo || !newFormData.tipo.trim()) {
      this.showSnackbar(formatMessage(messages.categoryRequired))
      return
    }

    if (!newFormData.description || !newFormData.description.trim()) {
      this.showSnackbar(formatMessage(messages.descriptionRequired))
      return
    }

    if (
      newFormData.description.length > MAX_DESCRIPTION_LENGTH ||
      countWords(newFormData.description) > MAX_DESCRIPTION_WORDS
    ) {
      this.showSnackbar(formatMessage(messages.descriptionTooLong))
      return
    }

    const lat = parseFloat(newFormData.latitude)
    const lng = parseFloat(newFormData.longitude)
    if (isNaN(lat) || isNaN(lng)) {
      this.showSnackbar(formatMessage(messages.coordsRequired))
      return
    }

    if (newFormData.files && newFormData.files.length > MAX_IMAGES) {
      this.showSnackbar(formatMessage(messages.maxPhotosReached))
      return
    }

    this.setState({ actionLoading: true })

    try {
      const payload = {
        name: newFormData.name.trim(),
        tipo: newFormData.tipo.trim(),
        status: parseInt(newFormData.status !== undefined ? newFormData.status : 1, 10),
        description: newFormData.description.trim(),
        latitude: lat,
        longitude: lng,
        address: {
          address: (newFormData.address || '').trim(),
          city: (newFormData.city || '').trim(),
          postalCode: (newFormData.postalCode || '').trim(),
          province: (newFormData.province || '').trim(),
          country: (newFormData.country || '').trim(),
        },
        links: (newFormData.links || [])
          .map(l => ({ url: (l.url || '').trim(), type: l.type || 'web' }))
          .filter(l => l.url.length > 0),
        video: (newFormData.video || '').trim(),
        email: (newFormData.email || '').trim(),
      }

      const formData = new FormData()
      formData.append('formData', JSON.stringify(payload))
      ;(newFormData.files || []).forEach(f => {
        formData.append('images', f)
      })

      await api.WORLD_LOCATION_CREATE_REQUEST({
        data: formData,
        token,
      })

      this.setState({ newDialogOpen: false, actionLoading: false })
      this.showSnackbar(formatMessage(messages.createdSuccess))
      this.fetchLocations()
    } catch (err) {
      this.setState({ actionLoading: false })
      this.showSnackbar(err.message || 'Error creating location')
    }
  }

  handleOpenDelete = location => {
    this.setState({ selectedLocation: location, deleteDialogOpen: true })
  }

  handleCloseDelete = () => {
    this.setState({ deleteDialogOpen: false })
  }

  handleConfirmDelete = async () => {
    const { token, intl } = this.props
    const { formatMessage } = intl
    const { selectedLocation } = this.state
    this.setState({ actionLoading: true })

    try {
      await api.WORLD_LOCATION_DELETE_REQUEST({
        id: selectedLocation.id || selectedLocation._id,
        token,
      })
      this.setState({
        deleteDialogOpen: false,
        detailDialogOpen: false,
        actionLoading: false,
      })
      this.showSnackbar(formatMessage(messages.deletedSuccess))
      this.fetchLocations()
    } catch (err) {
      this.setState({ actionLoading: false })
      this.showSnackbar(err.message || 'Error deleting location')
    }
  }

  getFilteredLocations = () => {
    const { locations, tabValue, searchQuery, selectedCategory, order, orderBy } = this.state
    const filtered = locations.filter(loc => {
      // Tab filter: 0 -> status === 2 (pending), 1 -> status === 1 (published), 2 -> all
      if (tabValue === 0 && loc.status !== 2) return false
      if (tabValue === 1 && loc.status !== 1) return false

      // Category filter
      if (selectedCategory && loc.tipo && loc.tipo.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = loc.name && loc.name.toLowerCase().includes(q)
        const tipoMatch = loc.tipo && loc.tipo.toLowerCase().includes(q)
        const cityMatch = loc.address && loc.address.city && loc.address.city.toLowerCase().includes(q)
        const countryMatch = loc.address && loc.address.country && loc.address.country.toLowerCase().includes(q)
        return nameMatch || tipoMatch || cityMatch || countryMatch
      }
      return true
    })

    return filtered.sort(getComparator(order, orderBy))
  }

  render() {
    const { intl } = this.props
    const { formatMessage } = intl
    const {
      locations,
      loading,
      tabValue,
      searchQuery,
      selectedCategory,
      orderBy,
      order,
      page,
      rowsPerPage,
      selectedLocation,
      detailDialogOpen,
      editDialogOpen,
      deleteDialogOpen,
      newDialogOpen,
      editFormData,
      newFormData,
      snackbarOpen,
      snackbarMessage,
      actionLoading,
    } = this.state

    const pendingCount = locations.filter(l => l.status === 2).length
    const publishedCount = locations.filter(l => l.status === 1).length
    const filteredLocations = this.getFilteredLocations()
    const pagedLocations = filteredLocations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
      <View left right>
        <div style={styles.headerWrapper}>
          <Typography variant="h5" component="h1">
            <FormattedMessage {...messages.header} />
          </Typography>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={this.handleOpenNewDialog}
            >
              <FormattedMessage {...messages.newInitiative} />
            </Button>

            <TextField
              select
              value={selectedCategory}
              onChange={this.handleCategoryFilterChange}
              variant="outlined"
              size="small"
              style={{ minWidth: '190px' }}
            >
              <MenuItem value="">
                <em>{formatMessage(messages.allCategories)}</em>
              </MenuItem>
              {CATEGORY_OPTIONS.map(cat => (
                <MenuItem key={cat.value} value={cat.value}>
                  {formatMessage(messages[cat.messageKey] || messages.other)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              placeholder={formatMessage(messages.searchPlaceholder)}
              value={searchQuery}
              onChange={this.handleSearchChange}
              variant="outlined"
              size="small"
              style={styles.searchField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>

        <Paper elevation={1}>
          <Tabs value={tabValue} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary">
            <Tab
              label={
                <Badge
                  color="secondary"
                  badgeContent={pendingCount}
                  invisible={pendingCount === 0}
                  style={{ paddingRight: '12px' }}
                >
                  <FormattedMessage {...messages.pendingTab} />
                </Badge>
              }
            />
            <Tab
              label={
                <Badge color="default" badgeContent={publishedCount} style={{ paddingRight: '12px' }}>
                  <FormattedMessage {...messages.publishedTab} />
                </Badge>
              }
            />
            <Tab label={<FormattedMessage {...messages.allTab} />} />
          </Tabs>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <CircularProgress />
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'name'}
                        direction={orderBy === 'name' ? order : 'asc'}
                        onClick={() => this.handleRequestSort('name')}
                      >
                        <FormattedMessage {...messages.name} />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'tipo'}
                        direction={orderBy === 'tipo' ? order : 'asc'}
                        onClick={() => this.handleRequestSort('tipo')}
                      >
                        <FormattedMessage {...messages.tipo} />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'location'}
                        direction={orderBy === 'location' ? order : 'asc'}
                        onClick={() => this.handleRequestSort('location')}
                      >
                        <FormattedMessage {...messages.location} />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'author'}
                        direction={orderBy === 'author' ? order : 'asc'}
                        onClick={() => this.handleRequestSort('author')}
                      >
                        <FormattedMessage {...messages.author} />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'date'}
                        direction={orderBy === 'date' ? order : 'desc'}
                        onClick={() => this.handleRequestSort('date')}
                      >
                        <FormattedMessage {...messages.date} />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'status'}
                        direction={orderBy === 'status' ? order : 'asc'}
                        onClick={() => this.handleRequestSort('status')}
                      >
                        <FormattedMessage {...messages.status} />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <FormattedMessage {...messages.actions} />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedLocations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" style={{ padding: '24px' }}>
                        <FormattedMessage {...messages.noData} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagedLocations.map(loc => {
                      const isPending = loc.status === 2
                      return (
                        <TableRow key={loc.id || loc._id} hover>
                          <TableCell style={{ fontWeight: 'bold' }}>{loc.name}</TableCell>
                          <TableCell>{getCategoryLabel(loc.tipo, formatMessage)}</TableCell>
                          <TableCell>
                            {[loc.address && loc.address.city, loc.address && loc.address.country]
                              .filter(Boolean)
                              .join(', ') || '-'}
                          </TableCell>
                          <TableCell>{loc.email || '-'}</TableCell>
                          <TableCell>{formatDate(loc.created || loc.lastUpdated, intl)}</TableCell>
                          <TableCell>
                            <Chip
                              label={isPending ? formatMessage(messages.pending) : formatMessage(messages.published)}
                              size="small"
                              style={isPending ? styles.chipPending : styles.chipPublished}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <div style={styles.actionBtns}>
                              <Tooltip title={formatMessage(messages.viewDetails)}>
                                <IconButton size="small" onClick={() => this.handleOpenDetail(loc)}>
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              {isPending ? (
                                <Tooltip title={formatMessage(messages.approve)}>
                                  <IconButton
                                    size="small"
                                    style={{ color: '#2e7d32' }}
                                    onClick={() => this.handleApprove(loc)}
                                    disabled={actionLoading}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title={formatMessage(messages.unpublish)}>
                                  <IconButton
                                    size="small"
                                    style={{ color: '#e65100' }}
                                    onClick={() => this.handleUnpublish(loc)}
                                    disabled={actionLoading}
                                  >
                                    <VisibilityOffIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              <Tooltip title={formatMessage(messages.edit)}>
                                <IconButton size="small" color="primary" onClick={() => this.handleOpenEdit(loc)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title={formatMessage(messages.delete)}>
                                <IconButton
                                  size="small"
                                  style={{ color: '#d32f2f' }}
                                  onClick={() => this.handleOpenDelete(loc)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={filteredLocations.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </div>
          )}
        </Paper>

        {/* Dialog: Detail Review */}
        {selectedLocation && (
          <Dialog open={detailDialogOpen} onClose={this.handleCloseDetail} maxWidth="md" fullWidth>
            <DialogTitle>
              {selectedLocation.name}
              <Chip
                label={
                  selectedLocation.status === 2 ? formatMessage(messages.pending) : formatMessage(messages.published)
                }
                size="small"
                style={{
                  marginLeft: '12px',
                  ...(selectedLocation.status === 2 ? styles.chipPending : styles.chipPublished),
                }}
              />
            </DialogTitle>
            <DialogContent dividers>
              <div style={styles.detailSection}>
                <Typography style={styles.detailLabel}>
                  <FormattedMessage {...messages.tipo} />
                </Typography>
                <Typography style={styles.detailText}>
                  {getCategoryLabel(selectedLocation.tipo, formatMessage)}
                </Typography>
              </div>

              {selectedLocation.description && (
                <div style={styles.detailSection}>
                  <Typography style={styles.detailLabel}>
                    <FormattedMessage {...messages.description} />
                  </Typography>
                  <Typography style={styles.detailText}>{selectedLocation.description}</Typography>
                </div>
              )}

              <div style={styles.detailSection}>
                <Typography style={styles.detailLabel}>
                  <FormattedMessage {...messages.address} />
                </Typography>
                <Typography style={styles.detailText}>
                  {[
                    selectedLocation.address && selectedLocation.address.address,
                    selectedLocation.address && selectedLocation.address.postalCode,
                    selectedLocation.address && selectedLocation.address.city,
                    selectedLocation.address && selectedLocation.address.province,
                    selectedLocation.address && selectedLocation.address.country,
                  ]
                    .filter(Boolean)
                    .join(', ') || '-'}
                </Typography>
              </div>

              <div style={styles.detailSection}>
                <Typography style={styles.detailLabel}>
                  <FormattedMessage {...messages.coordinates} />
                </Typography>
                <Typography style={styles.detailText}>
                  {selectedLocation.latitude !== undefined && selectedLocation.longitude !== undefined
                    ? `${selectedLocation.latitude}, ${selectedLocation.longitude}`
                    : '-'}
                </Typography>
              </div>

              {/* Links */}
              <div style={styles.detailSection}>
                <Typography style={styles.detailLabel}>
                  <FormattedMessage {...messages.links} />
                </Typography>
                <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {this.renderDetailLinks()}
                </div>
              </div>

              {/* Photos */}
              {selectedLocation.pictures && selectedLocation.pictures.length > 0 ? (
                <div style={styles.detailSection}>
                  <Typography style={styles.detailLabel}>
                    <FormattedMessage {...messages.photos} /> ({selectedLocation.pictures.length})
                  </Typography>
                  <div style={styles.thumbnailsGrid}>
                    {selectedLocation.pictures.map(pic => (
                      <a key={pic} href={pic} target="_blank" rel="noopener noreferrer">
                        <img src={pic} alt="" style={styles.thumbnail} />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedLocation.email && (
                <div style={styles.detailSection}>
                  <Typography style={styles.detailLabel}>
                    <FormattedMessage {...messages.author} />
                  </Typography>
                  <Typography style={styles.detailText}>{selectedLocation.email}</Typography>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              {selectedLocation.status === 2 && (
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#2e7d32', color: '#fff' }}
                  onClick={() => this.handleApprove(selectedLocation)}
                  disabled={actionLoading}
                  startIcon={<CheckCircleIcon />}
                >
                  <FormattedMessage {...messages.approve} />
                </Button>
              )}
              {selectedLocation.status === 1 && (
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#e65100', color: '#fff' }}
                  onClick={() => this.handleUnpublish(selectedLocation)}
                  disabled={actionLoading}
                  startIcon={<VisibilityOffIcon />}
                >
                  <FormattedMessage {...messages.unpublish} />
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  this.handleCloseDetail()
                  this.handleOpenEdit(selectedLocation)
                }}
              >
                <FormattedMessage {...messages.edit} />
              </Button>
              <Button onClick={this.handleCloseDetail}>
                <FormattedMessage {...messages.close} />
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Dialog: Edit Form */}
        <Dialog open={editDialogOpen} onClose={this.handleCloseEdit} maxWidth="md" fullWidth>
          <DialogTitle>
            <FormattedMessage {...messages.edit} />
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label={`${formatMessage(messages.name)} *`}
              value={editFormData.name || ''}
              onChange={this.handleEditInputChange('name')}
              fullWidth
              margin="normal"
            />
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField
                select
                label={`${formatMessage(messages.tipo)} *`}
                value={editFormData.tipo || 'Educación'}
                onChange={this.handleEditInputChange('tipo')}
                fullWidth
                margin="normal"
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {formatMessage(messages[cat.messageKey] || messages.other)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label={formatMessage(messages.status)}
                value={editFormData.status !== undefined ? editFormData.status : 1}
                onChange={this.handleEditInputChange('status')}
                fullWidth
                margin="normal"
              >
                <MenuItem value={1}>{formatMessage(messages.published)}</MenuItem>
                <MenuItem value={2}>{formatMessage(messages.pending)}</MenuItem>
              </TextField>
            </div>
            <TextField
              label={`${formatMessage(messages.description)} *`}
              value={editFormData.description || ''}
              onChange={this.handleEditInputChange('description')}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }}
              error={
                Boolean(
                  editFormData.description &&
                    (editFormData.description.length > MAX_DESCRIPTION_LENGTH ||
                      countWords(editFormData.description) > MAX_DESCRIPTION_WORDS),
                )
              }
              helperText={
                <span
                  style={{
                    color:
                      editFormData.description &&
                      (editFormData.description.length > MAX_DESCRIPTION_LENGTH ||
                        countWords(editFormData.description) > MAX_DESCRIPTION_WORDS)
                        ? '#d32f2f'
                        : '#757575',
                  }}
                >
                  {formatMessage(messages.descriptionCounter, {
                    currentChars: (editFormData.description || '').length,
                    maxChars: MAX_DESCRIPTION_LENGTH,
                    currentWords: countWords(editFormData.description || ''),
                    maxWords: MAX_DESCRIPTION_WORDS,
                  })}
                </span>
              }
            />
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField
                label="Latitud"
                value={editFormData.latitude || ''}
                onChange={this.handleEditInputChange('latitude')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Longitud"
                value={editFormData.longitude || ''}
                onChange={this.handleEditInputChange('longitude')}
                fullWidth
                margin="normal"
              />
            </div>
            <TextField
              label="Dirección"
              value={editFormData.address || ''}
              onChange={this.handleEditInputChange('address')}
              fullWidth
              margin="normal"
            />
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField
                label="Ciudad"
                value={editFormData.city || ''}
                onChange={this.handleEditInputChange('city')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Provincia"
                value={editFormData.province || ''}
                onChange={this.handleEditInputChange('province')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="País"
                value={editFormData.country || ''}
                onChange={this.handleEditInputChange('country')}
                fullWidth
                margin="normal"
              />
            </div>
            {/* Dynamic Links Editor */}
            <div style={{ marginTop: '16px', marginBottom: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <Typography style={styles.detailLabel}>
                  <FormattedMessage {...messages.links} />
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={this.handleAddLink}
                  startIcon={<AddIcon />}
                >
                  <FormattedMessage {...messages.addLink} />
                </Button>
              </div>
              {(editFormData.links || []).map((link, index) => (
                <div
                  key={link.id || `edit-link-${index}`}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <TextField
                    select
                    label={formatMessage(messages.linkType)}
                    value={link.type || 'web'}
                    onChange={this.handleLinkChange(index, 'type')}
                    style={{ minWidth: '140px' }}
                  >
                    {LINK_TYPES.map(lt => (
                      <MenuItem key={lt.value} value={lt.value}>
                        {formatMessage(messages[lt.messageKey] || messages.mainWeb)}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label={formatMessage(messages.url)}
                    value={link.url || ''}
                    onChange={this.handleLinkChange(index, 'url')}
                    fullWidth
                    placeholder="https://..."
                  />
                  <IconButton size="small" onClick={this.handleRemoveLink(index)} color="secondary">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            {/* Photos Editor */}
            <div style={{ marginTop: '16px', marginBottom: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <Typography style={styles.detailLabel}>
                  <FormattedMessage {...messages.photos} /> (
                  {(editFormData.pictures || []).length + (editFormData.newFiles || []).length} / {MAX_IMAGES})
                </Typography>
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="edit-photos-upload"
                    onChange={this.handleEditFilesChange}
                  />
                  <label htmlFor="edit-photos-upload">
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      component="span"
                      startIcon={<AddPhotoAlternateIcon />}
                      disabled={
                        (editFormData.pictures || []).length + (editFormData.newFiles || []).length >= MAX_IMAGES
                      }
                    >
                      <FormattedMessage {...messages.addPhotos} />
                    </Button>
                  </label>
                </div>
              </div>
              <div style={styles.thumbnailsGrid}>
                {(editFormData.pictures || []).map((pic, idx) => (
                  <div
                    key={`edit-pic-${idx}`}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    <img src={pic} alt="" style={styles.thumbnail} />
                    <IconButton
                      size="small"
                      onClick={this.handleRemovePhoto(idx)}
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        backgroundColor: '#d32f2f',
                        color: '#fff',
                        padding: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                      title={formatMessage(messages.deletePhoto)}
                    >
                      <DeleteIcon style={{ fontSize: '14px' }} />
                    </IconButton>
                  </div>
                ))}
                {(editFormData.newFiles || []).map((file, idx) => (
                  <div
                    key={`edit-newfile-${idx}`}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    <img src={getFilePreviewUrl(file)} alt="" style={styles.thumbnail} />
                    <IconButton
                      size="small"
                      onClick={this.handleRemoveNewFile(idx)}
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        backgroundColor: '#d32f2f',
                        color: '#fff',
                        padding: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                      title={formatMessage(messages.deletePhoto)}
                    >
                      <DeleteIcon style={{ fontSize: '14px' }} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
            <TextField
              label={formatMessage(messages.video)}
              value={editFormData.video || ''}
              onChange={this.handleEditInputChange('video')}
              fullWidth
              margin="normal"
            />
            <TextField
              label={formatMessage(messages.author)}
              value={editFormData.email || ''}
              onChange={this.handleEditInputChange('email')}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={this.handleSaveEdit} disabled={actionLoading}>
              <FormattedMessage {...messages.save} />
            </Button>
            <Button onClick={this.handleCloseEdit}>
              <FormattedMessage {...messages.close} />
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog: Create New Initiative */}
        <Dialog open={newDialogOpen} onClose={this.handleCloseNewDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            <FormattedMessage {...messages.createInitiativeTitle} />
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label={`${formatMessage(messages.name)} *`}
              value={newFormData.name || ''}
              onChange={this.handleNewInputChange('name')}
              fullWidth
              margin="normal"
            />
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField
                select
                label={`${formatMessage(messages.tipo)} *`}
                value={newFormData.tipo || 'Educación'}
                onChange={this.handleNewInputChange('tipo')}
                fullWidth
                margin="normal"
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {formatMessage(messages[cat.messageKey] || messages.other)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label={`${formatMessage(messages.status)} *`}
                value={newFormData.status !== undefined ? newFormData.status : 1}
                onChange={this.handleNewInputChange('status')}
                fullWidth
                margin="normal"
              >
                <MenuItem value={1}>{formatMessage(messages.published)}</MenuItem>
                <MenuItem value={2}>{formatMessage(messages.pending)}</MenuItem>
              </TextField>
            </div>
            <TextField
              label={`${formatMessage(messages.description)} *`}
              value={newFormData.description || ''}
              onChange={this.handleNewInputChange('description')}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }}
              error={
                Boolean(
                  newFormData.description &&
                    (newFormData.description.length > MAX_DESCRIPTION_LENGTH ||
                      countWords(newFormData.description) > MAX_DESCRIPTION_WORDS),
                )
              }
              helperText={
                <span
                  style={{
                    color:
                      newFormData.description &&
                      (newFormData.description.length > MAX_DESCRIPTION_LENGTH ||
                        countWords(newFormData.description) > MAX_DESCRIPTION_WORDS)
                        ? '#d32f2f'
                        : '#757575',
                  }}
                >
                  {formatMessage(messages.descriptionCounter, {
                    currentChars: (newFormData.description || '').length,
                    maxChars: MAX_DESCRIPTION_LENGTH,
                    currentWords: countWords(newFormData.description || ''),
                    maxWords: MAX_DESCRIPTION_WORDS,
                  })}
                </span>
              }
            />
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField
                label="Latitud *"
                value={newFormData.latitude || ''}
                onChange={this.handleNewInputChange('latitude')}
                fullWidth
                margin="normal"
                placeholder="ej. 41.3851"
              />
              <TextField
                label="Longitud *"
                value={newFormData.longitude || ''}
                onChange={this.handleNewInputChange('longitude')}
                fullWidth
                margin="normal"
                placeholder="ej. 2.1734"
              />
            </div>
            <TextField
              label="Dirección"
              value={newFormData.address || ''}
              onChange={this.handleNewInputChange('address')}
              fullWidth
              margin="normal"
            />
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField
                label="Ciudad"
                value={newFormData.city || ''}
                onChange={this.handleNewInputChange('city')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Provincia"
                value={newFormData.province || ''}
                onChange={this.handleNewInputChange('province')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Código Postal"
                value={newFormData.postalCode || ''}
                onChange={this.handleNewInputChange('postalCode')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="País"
                value={newFormData.country || ''}
                onChange={this.handleNewInputChange('country')}
                fullWidth
                margin="normal"
              />
            </div>
            {/* Dynamic Links Editor */}
            <div style={{ marginTop: '16px', marginBottom: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <Typography style={styles.detailLabel}>
                  <FormattedMessage {...messages.links} />
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={this.handleAddNewLink}
                  startIcon={<AddIcon />}
                >
                  <FormattedMessage {...messages.addLink} />
                </Button>
              </div>
              {(newFormData.links || []).map((link, index) => (
                <div
                  key={link.id || `new-link-${index}`}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <TextField
                    select
                    label={formatMessage(messages.linkType)}
                    value={link.type || 'web'}
                    onChange={this.handleNewLinkChange(index, 'type')}
                    style={{ minWidth: '140px' }}
                  >
                    {LINK_TYPES.map(lt => (
                      <MenuItem key={lt.value} value={lt.value}>
                        {formatMessage(messages[lt.messageKey] || messages.mainWeb)}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label={formatMessage(messages.url)}
                    value={link.url || ''}
                    onChange={this.handleNewLinkChange(index, 'url')}
                    fullWidth
                    placeholder="https://..."
                  />
                  <IconButton size="small" onClick={this.handleRemoveNewLink(index)} color="secondary">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            {/* Photos Upload */}
            <div style={{ marginTop: '16px', marginBottom: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <Typography style={styles.detailLabel}>
                  <FormattedMessage {...messages.photos} /> ({(newFormData.files || []).length} / {MAX_IMAGES})
                </Typography>
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="new-photos-upload"
                    onChange={this.handleNewFilesChange}
                  />
                  <label htmlFor="new-photos-upload">
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      component="span"
                      startIcon={<AddPhotoAlternateIcon />}
                      disabled={(newFormData.files || []).length >= MAX_IMAGES}
                    >
                      <FormattedMessage {...messages.addPhotos} />
                    </Button>
                  </label>
                </div>
              </div>
              <div style={styles.thumbnailsGrid}>
                {(newFormData.files || []).map((file, idx) => (
                  <div
                    key={`new-upload-pic-${idx}`}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    <img src={getFilePreviewUrl(file)} alt="" style={styles.thumbnail} />
                    <IconButton
                      size="small"
                      onClick={this.handleRemoveNewUploadFile(idx)}
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        backgroundColor: '#d32f2f',
                        color: '#fff',
                        padding: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                      title={formatMessage(messages.deletePhoto)}
                    >
                      <DeleteIcon style={{ fontSize: '14px' }} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
            <TextField
              label={formatMessage(messages.video)}
              value={newFormData.video || ''}
              onChange={this.handleNewInputChange('video')}
              fullWidth
              margin="normal"
            />
            <TextField
              label={formatMessage(messages.author)}
              value={newFormData.email || ''}
              onChange={this.handleNewInputChange('email')}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={this.handleSaveNew} disabled={actionLoading}>
              <FormattedMessage {...messages.save} />
            </Button>
            <Button onClick={this.handleCloseNewDialog}>
              <FormattedMessage {...messages.close} />
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog: Confirm Delete */}
        <Dialog open={deleteDialogOpen} onClose={this.handleCloseDelete}>
          <DialogTitle>
            <FormattedMessage {...messages.delete} />
          </DialogTitle>
          <DialogContent>
            <Typography>
              <FormattedMessage {...messages.confirmDelete} />
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ backgroundColor: '#d32f2f', color: '#fff' }}
              onClick={this.handleConfirmDelete}
              disabled={actionLoading}
            >
              <FormattedMessage {...messages.delete} />
            </Button>
            <Button onClick={this.handleCloseDelete}>
              <FormattedMessage {...messages.close} />
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={this.handleSnackbarClose}
          message={snackbarMessage}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  token: makeSelectHasUser()(state),
})

export default connect(mapStateToProps)(injectIntl(WorldLocationsView))

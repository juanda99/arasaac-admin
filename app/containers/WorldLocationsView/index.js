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
import OpenInNewIcon from '@material-ui/icons/OpenInNew'

import View from 'components/View'
import api from 'services'
import { makeSelectHasUser } from 'containers/App/selectors'
import messages from './messages'

const CATEGORY_OPTIONS = [
  'Educación',
  'Salud',
  'Localidades',
  'Cultura',
  'Asociaciones',
  'Organismos',
  'Software',
  'Residencias',
  'Deporte',
  'Empresas',
  'Otro',
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
    page: 0,
    rowsPerPage: 25,
    selectedLocation: null,
    detailDialogOpen: false,
    editDialogOpen: false,
    deleteDialogOpen: false,
    editFormData: {},
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
      const combined = [
        ...(Array.isArray(pending) ? pending : []),
        ...(Array.isArray(published) ? published : []),
      ]
      this.setState({ locations: combined, loading: false })
    } catch (err) {
      this.setState({ loading: false })
      this.showSnackbar(err.message || 'Error fetching locations')
    }
  }

  showSnackbar = (message) => {
    this.setState({ snackbarOpen: true, snackbarMessage: message })
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false })
  }

  handleTabChange = (event, tabValue) => {
    this.setState({ tabValue, page: 0 })
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value, page: 0 })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 })
  }

  handleOpenDetail = (location) => {
    this.setState({ selectedLocation: location, detailDialogOpen: true })
  }

  handleCloseDetail = () => {
    this.setState({ detailDialogOpen: false })
  }

  handleOpenEdit = (location) => {
    this.setState({
      selectedLocation: location,
      editFormData: {
        name: location.name || '',
        tipo: location.tipo || 'Educación',
        description: location.description || '',
        latitude: location.latitude !== undefined ? String(location.latitude) : '',
        longitude: location.longitude !== undefined ? String(location.longitude) : '',
        address: (location.address && location.address.address) || '',
        city: (location.address && location.address.city) || '',
        postalCode: (location.address && location.address.postalCode) || '',
        province: (location.address && location.address.province) || '',
        country: (location.address && location.address.country) || '',
        mainWeb: (location.links && location.links.mainWeb) || '',
        proyectWeb: (location.links && location.links.proyectWeb) || '',
        urlNews: (location.links && location.links.urlNews) || '',
        video: location.video || '',
        email: location.email || '',
      },
      editDialogOpen: true,
    })
  }

  handleCloseEdit = () => {
    this.setState({ editDialogOpen: false })
  }

  handleEditInputChange = (field) => (event) => {
    const value = event.target.value
    this.setState((prevState) => ({
      editFormData: {
        ...prevState.editFormData,
        [field]: value,
      },
    }))
  }

  handleSaveEdit = async () => {
    const { token, intl } = this.props
    const { formatMessage } = intl
    const { selectedLocation, editFormData } = this.state
    this.setState({ actionLoading: true })

    try {
      const payload = {
        name: editFormData.name,
        tipo: editFormData.tipo,
        description: editFormData.description,
        latitude: parseFloat(editFormData.latitude),
        longitude: parseFloat(editFormData.longitude),
        address: {
          address: editFormData.address,
          city: editFormData.city,
          postalCode: editFormData.postalCode,
          province: editFormData.province,
          country: editFormData.country,
        },
        links: {
          mainWeb: editFormData.mainWeb,
          proyectWeb: editFormData.proyectWeb,
          urlNews: editFormData.urlNews,
        },
        video: editFormData.video,
        email: editFormData.email,
      }

      await api.WORLD_LOCATION_UPDATE_REQUEST({
        id: selectedLocation.id || selectedLocation._id,
        data: payload,
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

  handleApprove = async (location) => {
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

  handleOpenDelete = (location) => {
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
    const { locations, tabValue, searchQuery } = this.state
    return locations.filter((loc) => {
      // Tab filter: 0 -> status === 2 (pending), 1 -> status === 1 (published), 2 -> all
      if (tabValue === 0 && loc.status !== 2) return false
      if (tabValue === 1 && loc.status !== 1) return false

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = loc.name && loc.name.toLowerCase().includes(q)
        const tipoMatch = loc.tipo && loc.tipo.toLowerCase().includes(q)
        const cityMatch =
          loc.address && loc.address.city && loc.address.city.toLowerCase().includes(q)
        const countryMatch =
          loc.address &&
          loc.address.country &&
          loc.address.country.toLowerCase().includes(q)
        return nameMatch || tipoMatch || cityMatch || countryMatch
      }
      return true
    })
  }

  render() {
    const { intl } = this.props
    const { formatMessage } = intl
    const {
      locations,
      loading,
      tabValue,
      searchQuery,
      page,
      rowsPerPage,
      selectedLocation,
      detailDialogOpen,
      editDialogOpen,
      deleteDialogOpen,
      editFormData,
      snackbarOpen,
      snackbarMessage,
      actionLoading,
    } = this.state

    const pendingCount = locations.filter((l) => l.status === 2).length
    const publishedCount = locations.filter((l) => l.status === 1).length
    const filteredLocations = this.getFilteredLocations()
    const pagedLocations = filteredLocations.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    )

    return (
      <View left={true} right={true}>
        <div style={styles.headerWrapper}>
          <Typography variant="h5" component="h1">
            <FormattedMessage {...messages.header} />
          </Typography>

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

        <Paper elevation={1}>
          <Tabs
            value={tabValue}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
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
                <Badge
                  color="default"
                  badgeContent={publishedCount}
                  style={{ paddingRight: '12px' }}
                >
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
                    <TableCell><FormattedMessage {...messages.name} /></TableCell>
                    <TableCell><FormattedMessage {...messages.tipo} /></TableCell>
                    <TableCell><FormattedMessage {...messages.location} /></TableCell>
                    <TableCell><FormattedMessage {...messages.author} /></TableCell>
                    <TableCell><FormattedMessage {...messages.status} /></TableCell>
                    <TableCell align="right"><FormattedMessage {...messages.actions} /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedLocations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" style={{ padding: '24px' }}>
                        <FormattedMessage {...messages.noData} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagedLocations.map((loc) => {
                      const isPending = loc.status === 2
                      return (
                        <TableRow key={loc.id || loc._id} hover>
                          <TableCell style={{ fontWeight: 'bold' }}>{loc.name}</TableCell>
                          <TableCell>{loc.tipo}</TableCell>
                          <TableCell>
                            {[
                              loc.address && loc.address.city,
                              loc.address && loc.address.country,
                            ]
                              .filter(Boolean)
                              .join(', ') || '-'}
                          </TableCell>
                          <TableCell>{loc.email || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={
                                isPending
                                  ? formatMessage(messages.pending)
                                  : formatMessage(messages.published)
                              }
                              size="small"
                              style={isPending ? styles.chipPending : styles.chipPublished}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <div style={styles.actionBtns}>
                              <Tooltip title={formatMessage(messages.viewDetails)}>
                                <IconButton
                                  size="small"
                                  onClick={() => this.handleOpenDetail(loc)}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              {isPending && (
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
                              )}

                              <Tooltip title={formatMessage(messages.edit)}>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => this.handleOpenEdit(loc)}
                                >
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
          <Dialog
            open={detailDialogOpen}
            onClose={this.handleCloseDetail}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {selectedLocation.name}
              <Chip
                label={
                  selectedLocation.status === 2
                    ? formatMessage(messages.pending)
                    : formatMessage(messages.published)
                }
                size="small"
                style={{
                  marginLeft: '12px',
                  ...(selectedLocation.status === 2
                    ? styles.chipPending
                    : styles.chipPublished),
                }}
              />
            </DialogTitle>
            <DialogContent dividers>
              <div style={styles.detailSection}>
                <Typography style={styles.detailLabel}><FormattedMessage {...messages.tipo} /></Typography>
                <Typography style={styles.detailText}>{selectedLocation.tipo}</Typography>
              </div>

              {selectedLocation.description && (
                <div style={styles.detailSection}>
                  <Typography style={styles.detailLabel}><FormattedMessage {...messages.description} /></Typography>
                  <Typography style={styles.detailText}>{selectedLocation.description}</Typography>
                </div>
              )}

              <div style={styles.detailSection}>
                <Typography style={styles.detailLabel}><FormattedMessage {...messages.address} /></Typography>
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
                <Typography style={styles.detailLabel}><FormattedMessage {...messages.coordinates} /></Typography>
                <Typography style={styles.detailText}>
                  {selectedLocation.latitude !== undefined && selectedLocation.longitude !== undefined
                    ? `${selectedLocation.latitude}, ${selectedLocation.longitude}`
                    : '-'}
                </Typography>
              </div>

              {/* Links */}
              <div style={styles.detailSection}>
                <Typography style={styles.detailLabel}><FormattedMessage {...messages.links} /></Typography>
                <div style={{ marginTop: '4px' }}>
                  {selectedLocation.links && selectedLocation.links.mainWeb && (
                    <Button
                      size="small"
                      variant="outlined"
                      href={selectedLocation.links.mainWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.linkBtn}
                      endIcon={<OpenInNewIcon />}
                    >
                      <FormattedMessage {...messages.mainWeb} />
                    </Button>
                  )}
                  {selectedLocation.links && selectedLocation.links.proyectWeb && (
                    <Button
                      size="small"
                      variant="outlined"
                      href={selectedLocation.links.proyectWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.linkBtn}
                      endIcon={<OpenInNewIcon />}
                    >
                      <FormattedMessage {...messages.proyectWeb} />
                    </Button>
                  )}
                  {selectedLocation.links && selectedLocation.links.urlNews && (
                    <Button
                      size="small"
                      variant="outlined"
                      href={selectedLocation.links.urlNews}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.linkBtn}
                      endIcon={<OpenInNewIcon />}
                    >
                      <FormattedMessage {...messages.urlNews} />
                    </Button>
                  )}
                  {selectedLocation.video && (
                    <Button
                      size="small"
                      variant="outlined"
                      href={selectedLocation.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.linkBtn}
                      endIcon={<OpenInNewIcon />}
                    >
                      <FormattedMessage {...messages.video} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Photos */}
              {selectedLocation.pictures && selectedLocation.pictures.length > 0 && (
                <div style={styles.detailSection}>
                  <Typography style={styles.detailLabel}>
                    <FormattedMessage {...messages.photos} /> ({selectedLocation.pictures.length})
                  </Typography>
                  <div style={styles.thumbnailsGrid}>
                    {selectedLocation.pictures.map((pic, idx) => (
                      <a key={idx} href={pic} target="_blank" rel="noopener noreferrer">
                        <img src={pic} alt="" style={styles.thumbnail} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedLocation.email && (
                <div style={styles.detailSection}>
                  <Typography style={styles.detailLabel}><FormattedMessage {...messages.author} /></Typography>
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
        <Dialog
          open={editDialogOpen}
          onClose={this.handleCloseEdit}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle><FormattedMessage {...messages.edit} /></DialogTitle>
          <DialogContent dividers>
            <TextField
              label={formatMessage(messages.name)}
              value={editFormData.name || ''}
              onChange={this.handleEditInputChange('name')}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label={formatMessage(messages.tipo)}
              value={editFormData.tipo || 'Educación'}
              onChange={this.handleEditInputChange('tipo')}
              fullWidth
              margin="normal"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={formatMessage(messages.description)}
              value={editFormData.description || ''}
              onChange={this.handleEditInputChange('description')}
              fullWidth
              multiline
              rows={3}
              margin="normal"
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
            <TextField
              label={formatMessage(messages.mainWeb)}
              value={editFormData.mainWeb || ''}
              onChange={this.handleEditInputChange('mainWeb')}
              fullWidth
              margin="normal"
            />
            <TextField
              label={formatMessage(messages.proyectWeb)}
              value={editFormData.proyectWeb || ''}
              onChange={this.handleEditInputChange('proyectWeb')}
              fullWidth
              margin="normal"
            />
            <TextField
              label={formatMessage(messages.urlNews)}
              value={editFormData.urlNews || ''}
              onChange={this.handleEditInputChange('urlNews')}
              fullWidth
              margin="normal"
            />
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
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSaveEdit}
              disabled={actionLoading}
            >
              <FormattedMessage {...messages.save} />
            </Button>
            <Button onClick={this.handleCloseEdit}>
              <FormattedMessage {...messages.close} />
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog: Confirm Delete */}
        <Dialog open={deleteDialogOpen} onClose={this.handleCloseDelete}>
          <DialogTitle><FormattedMessage {...messages.delete} /></DialogTitle>
          <DialogContent>
            <Typography><FormattedMessage {...messages.confirmDelete} /></Typography>
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

const mapStateToProps = (state) => ({
  token: makeSelectHasUser()(state),
})

export default connect(mapStateToProps)(injectIntl(WorldLocationsView))

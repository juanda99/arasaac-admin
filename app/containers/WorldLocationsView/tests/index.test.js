import React from 'react'
import { shallow } from 'enzyme'
import api from 'services'
import {
  WorldLocationsView,
  getCategoryLabel,
  formatDate,
  MAX_IMAGES,
  MAX_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_WORDS,
  countWords,
} from '../index'

jest.mock('services', () => ({
  WORLD_LOCATIONS_REQUEST: jest.fn(),
  WORLD_LOCATION_REQUEST: jest.fn(),
  WORLD_LOCATION_CREATE_REQUEST: jest.fn(),
  WORLD_LOCATION_UPDATE_REQUEST: jest.fn(),
  WORLD_LOCATION_DELETE_REQUEST: jest.fn(),
}))

describe('<WorldLocationsView />', () => {
  const mockLocationsPending = [
    {
      _id: 'loc1',
      name: 'Colegio Esperanza',
      tipo: 'Educación',
      status: 2,
      description: 'Proyecto educativo en Zaragoza',
      latitude: 41.65,
      longitude: -0.88,
      address: {
        address: 'Calle Mayor 1',
        city: 'Zaragoza',
        postalCode: '50001',
        province: 'Zaragoza',
        country: 'España',
      },
      links: {
        mainWeb: 'https://colegio.es',
        proyectWeb: '',
        urlNews: '',
      },
      images: ['img1.jpg'],
      video: '',
      email: 'contacto@colegio.es',
    },
  ]

  const mockLocationsPublished = [
    {
      _id: 'loc2',
      name: 'Hospital San Juan',
      tipo: 'Salud',
      status: 1,
      description: 'Señalización accesible en hospital',
      latitude: 40.41,
      longitude: -3.7,
      address: {
        address: 'Avenida Salud 10',
        city: 'Madrid',
        postalCode: '28001',
        province: 'Madrid',
        country: 'España',
      },
      links: {
        mainWeb: 'https://hospital.es',
        proyectWeb: '',
        urlNews: '',
      },
      images: ['img2.jpg'],
      video: 'https://youtube.com/watch?v=123',
      email: 'info@hospital.es',
    },
  ]

  const mockProps = {
    token: 'test_token',
    intl: { formatMessage: msg => (msg && msg.defaultMessage) || '' },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    api.WORLD_LOCATIONS_REQUEST.mockImplementation(({ status }) => {
      if (status === 2) return Promise.resolve(mockLocationsPending)
      if (status === 1) return Promise.resolve(mockLocationsPublished)
      return Promise.resolve([])
    })
  })

  it('renders correctly and loads locations on mount', async () => {
    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    expect(wrapper.find('WithStyles(ForwardRef(Tabs))').length || wrapper.find('Tabs').length).toBeGreaterThanOrEqual(1)
    expect(api.WORLD_LOCATIONS_REQUEST).toHaveBeenCalledWith({ token: 'test_token', status: 1 })
    expect(api.WORLD_LOCATIONS_REQUEST).toHaveBeenCalledWith({ token: 'test_token', status: 2 })

    await wrapper.instance().fetchLocations()
    wrapper.update()

    expect(wrapper.state('loading')).toBe(false)
    expect(wrapper.state('locations').length).toBe(2)
  })

  it('handles tab changes to filter pending, published, and all locations', async () => {
    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    // Default tabValue is 0 (Pending)
    let filtered = wrapper.instance().getFilteredLocations()
    expect(filtered.length).toBe(1)
    expect(filtered[0]._id).toBe('loc1')

    // Change tab to Published (tabValue 1)
    wrapper.instance().handleTabChange(null, 1)
    expect(wrapper.state('tabValue')).toBe(1)
    filtered = wrapper.instance().getFilteredLocations()
    expect(filtered.length).toBe(1)
    expect(filtered[0]._id).toBe('loc2')

    // Change tab to All (tabValue 2)
    wrapper.instance().handleTabChange(null, 2)
    expect(wrapper.state('tabValue')).toBe(2)
    filtered = wrapper.instance().getFilteredLocations()
    expect(filtered.length).toBe(2)
  })

  it('filters locations by search query', async () => {
    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    wrapper.instance().handleTabChange(null, 2) // All tab
    wrapper.instance().handleSearchChange({ target: { value: 'Zaragoza' } })
    expect(wrapper.state('searchQuery')).toBe('Zaragoza')

    const filtered = wrapper.instance().getFilteredLocations()
    expect(filtered.length).toBe(1)
    expect(filtered[0].name).toBe('Colegio Esperanza')
  })

  it('opens and closes the detail dialog', async () => {
    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    wrapper.instance().handleOpenDetail(mockLocationsPending[0])
    expect(wrapper.state('detailDialogOpen')).toBe(true)
    expect(wrapper.state('selectedLocation')).toBe(mockLocationsPending[0])

    wrapper.instance().handleCloseDetail()
    expect(wrapper.state('detailDialogOpen')).toBe(false)
  })

  it('approves a pending location successfully and updates status to 1', async () => {
    api.WORLD_LOCATION_UPDATE_REQUEST.mockResolvedValue({
      ...mockLocationsPending[0],
      status: 1,
    })

    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    await wrapper.instance().handleApprove(mockLocationsPending[0])

    expect(api.WORLD_LOCATION_UPDATE_REQUEST).toHaveBeenCalledWith({
      id: 'loc1',
      data: { status: 1 },
      token: 'test_token',
    })
    expect(wrapper.state('snackbarOpen')).toBe(true)
  })

  it('opens edit dialog, edits fields, and saves modifications', async () => {
    const updatedLocation = {
      ...mockLocationsPending[0],
      name: 'Colegio Esperanza Renovado',
      description: 'Nueva descripción',
    }
    api.WORLD_LOCATION_UPDATE_REQUEST.mockResolvedValue(updatedLocation)

    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    wrapper.instance().handleOpenEdit(mockLocationsPending[0])
    expect(wrapper.state('editDialogOpen')).toBe(true)
    expect(wrapper.state('editFormData').name).toBe('Colegio Esperanza')

    wrapper.instance().handleEditInputChange('name')({ target: { value: 'Colegio Esperanza Renovado' } })
    wrapper.instance().handleEditInputChange('description')({ target: { value: 'Nueva descripción' } })
    expect(wrapper.state('editFormData').name).toBe('Colegio Esperanza Renovado')

    await wrapper.instance().handleSaveEdit()

    expect(api.WORLD_LOCATION_UPDATE_REQUEST).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'loc1',
        token: 'test_token',
        data: expect.objectContaining({
          name: 'Colegio Esperanza Renovado',
          description: 'Nueva descripción',
        }),
      }),
    )
    expect(wrapper.state('editDialogOpen')).toBe(false)
  })

  it('validates required fields (name, tipo, description) when saving edit', async () => {
    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    wrapper.instance().handleOpenEdit(mockLocationsPending[0])

    // Empty name
    wrapper.setState({
      editFormData: {
        ...wrapper.state('editFormData'),
        name: '   ',
      },
    })
    await wrapper.instance().handleSaveEdit()
    expect(wrapper.state('snackbarOpen')).toBe(true)
    expect(api.WORLD_LOCATION_UPDATE_REQUEST).not.toHaveBeenCalled()

    // Empty tipo
    wrapper.setState({
      editFormData: {
        ...wrapper.state('editFormData'),
        name: 'Nombre Válido',
        tipo: '',
      },
    })
    await wrapper.instance().handleSaveEdit()
    expect(api.WORLD_LOCATION_UPDATE_REQUEST).not.toHaveBeenCalled()

    // Empty description
    wrapper.setState({
      editFormData: {
        ...wrapper.state('editFormData'),
        tipo: 'Educación',
        description: '   ',
      },
    })
    await wrapper.instance().handleSaveEdit()
    expect(api.WORLD_LOCATION_UPDATE_REQUEST).not.toHaveBeenCalled()
  })

  it('validates description limit (1800 characters or 300 words) when saving edit', async () => {
    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    wrapper.instance().handleOpenEdit(mockLocationsPending[0])

    // Exceeding 1800 characters
    wrapper.setState({
      editFormData: {
        ...wrapper.state('editFormData'),
        description: 'a'.repeat(MAX_DESCRIPTION_LENGTH + 1),
      },
    })
    await wrapper.instance().handleSaveEdit()
    expect(api.WORLD_LOCATION_UPDATE_REQUEST).not.toHaveBeenCalled()

    // Exceeding 300 words
    wrapper.setState({
      editFormData: {
        ...wrapper.state('editFormData'),
        description: Array(MAX_DESCRIPTION_WORDS + 1).fill('palabra').join(' '),
      },
    })
    await wrapper.instance().handleSaveEdit()
    expect(api.WORLD_LOCATION_UPDATE_REQUEST).not.toHaveBeenCalled()
  })

  it('validates photo limit of 15 maximum and removes photos with handleRemovePhoto', async () => {
    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    wrapper.instance().handleOpenEdit(mockLocationsPending[0])

    // Set 16 pictures
    wrapper.setState({
      editFormData: {
        ...wrapper.state('editFormData'),
        pictures: Array(16).fill('http://example.com/pic.jpg'),
      },
    })
    await wrapper.instance().handleSaveEdit()
    expect(api.WORLD_LOCATION_UPDATE_REQUEST).not.toHaveBeenCalled()

    // Removing a photo via handleRemovePhoto
    wrapper.instance().handleRemovePhoto(0)()
    expect(wrapper.state('editFormData').pictures.length).toBe(15)
  })

  it('counts words correctly with countWords helper', () => {
    expect(countWords('')).toBe(0)
    expect(countWords('   ')).toBe(0)
    expect(countWords(null)).toBe(0)
    expect(countWords('hola')).toBe(1)
    expect(countWords('hola mundo desde ARASAAC')).toBe(4)
    expect(countWords('  palabra1   palabra2\npalabra3\tpalabra4  ')).toBe(4)
  })

  it('opens delete dialog, confirms delete, and removes the location', async () => {
    api.WORLD_LOCATION_DELETE_REQUEST.mockResolvedValue({ success: true })

    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    wrapper.instance().handleOpenDelete(mockLocationsPending[0])
    expect(wrapper.state('deleteDialogOpen')).toBe(true)
    expect(wrapper.state('selectedLocation')).toBe(mockLocationsPending[0])

    await wrapper.instance().handleConfirmDelete()

    expect(api.WORLD_LOCATION_DELETE_REQUEST).toHaveBeenCalledWith({
      id: 'loc1',
      token: 'test_token',
    })
    expect(wrapper.state('deleteDialogOpen')).toBe(false)
    expect(wrapper.state('snackbarOpen')).toBe(true)
  })

  it('handles errors when fetching locations', async () => {
    api.WORLD_LOCATIONS_REQUEST.mockRejectedValue(new Error('Network failure'))

    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    expect(wrapper.state('loading')).toBe(false)
    expect(wrapper.state('snackbarOpen')).toBe(true)
    expect(wrapper.state('snackbarMessage')).toBe('Network failure')
  })

  it('correctly translates category labels with getCategoryLabel', () => {
    const formatMessage = msg => msg.defaultMessage || msg.id
    expect(getCategoryLabel('Educación', formatMessage)).toBe('Education')
    expect(getCategoryLabel('Salud', formatMessage)).toBe('Health')
    expect(getCategoryLabel('Ocio y Turismo', formatMessage)).toBe('Leisure & Tourism')
    expect(getCategoryLabel('Unknown', formatMessage)).toBe('Unknown')
    expect(getCategoryLabel('', formatMessage)).toBe('')
  })

  it('formats dates safely with formatDate', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate('invalid-date')).toBe('-')
    const date = new Date('2026-10-15T12:00:00Z')
    const formatted = formatDate(date, { formatDate: d => d.toISOString().slice(0, 10) })
    expect(formatted).toBe('2026-10-15')
  })

  it('defaults to reverse order (orderBy: date, order: desc) on tab 2 (all initiatives)', () => {
    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    wrapper.instance().handleTabChange(null, 2)
    expect(wrapper.state('tabValue')).toBe(2)
    expect(wrapper.state('orderBy')).toBe('date')
    expect(wrapper.state('order')).toBe('desc')
  })

  it('handles request sort to toggle order and change columns', () => {
    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    expect(wrapper.state('orderBy')).toBe('date')
    expect(wrapper.state('order')).toBe('desc')

    // Clicking 'date' again toggles to asc
    wrapper.instance().handleRequestSort('date')
    expect(wrapper.state('order')).toBe('asc')

    // Clicking 'name' changes orderBy to name and order to asc
    wrapper.instance().handleRequestSort('name')
    expect(wrapper.state('orderBy')).toBe('name')
    expect(wrapper.state('order')).toBe('asc')
  })

  it('filters locations by category dropdown', async () => {
    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    // View all tab
    wrapper.setState({ tabValue: 2 })
    expect(wrapper.instance().getFilteredLocations().length).toBe(2)

    // Filter by Educación
    wrapper.instance().handleCategoryFilterChange({ target: { value: 'Educación' } })
    expect(wrapper.state('selectedCategory')).toBe('Educación')
    const filtered = wrapper.instance().getFilteredLocations()
    expect(filtered.length).toBe(1)
    expect(filtered[0].tipo).toBe('Educación')
  })

  it('unpublishes a published initiative (setting status to 2)', async () => {
    const api = require('services').default || require('services')
    api.WORLD_LOCATION_UPDATE_REQUEST.mockResolvedValue({ success: true })

    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    await wrapper.instance().fetchLocations()
    wrapper.update()

    await wrapper.instance().handleUnpublish(mockLocationsPublished[0])

    expect(api.WORLD_LOCATION_UPDATE_REQUEST).toHaveBeenCalledWith({
      id: 'loc2',
      data: { status: 2 },
      token: 'test_token',
    })
    expect(wrapper.state('snackbarOpen')).toBe(true)
  })

  it('handles adding and removing new photo files in edit form', () => {
    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    wrapper.instance().handleOpenEdit(mockLocationsPublished[0])

    const fakeFile1 = new File([''], 'new1.jpg', { type: 'image/jpeg' })
    const fakeFile2 = new File([''], 'new2.jpg', { type: 'image/jpeg' })

    wrapper.instance().handleEditFilesChange({ target: { files: [fakeFile1, fakeFile2] } })
    expect(wrapper.state('editFormData').newFiles.length).toBe(2)

    // Remove first new file
    wrapper.instance().handleRemoveNewFile(0)()
    expect(wrapper.state('editFormData').newFiles.length).toBe(1)
    expect(wrapper.state('editFormData').newFiles[0].name).toBe('new2.jpg')
  })

  it('opens and closes new initiative dialog and creates a new initiative', async () => {
    const api = require('services').default || require('services')
    api.WORLD_LOCATION_CREATE_REQUEST.mockResolvedValue({ id: 539, name: 'Nueva Iniciativa' })

    const wrapper = shallow(<WorldLocationsView {...mockProps} />)
    wrapper.instance().handleOpenNewDialog()
    expect(wrapper.state('newDialogOpen')).toBe(true)

    wrapper.instance().handleNewInputChange('name')({ target: { value: 'Nueva Iniciativa' } })
    wrapper.instance().handleNewInputChange('tipo')({ target: { value: 'Salud' } })
    wrapper.instance().handleNewInputChange('description')({ target: { value: 'Descripción del proyecto' } })
    wrapper.instance().handleNewInputChange('latitude')({ target: { value: '41.65' } })
    wrapper.instance().handleNewInputChange('longitude')({ target: { value: '-0.88' } })

    await wrapper.instance().handleSaveNew()

    expect(api.WORLD_LOCATION_CREATE_REQUEST).toHaveBeenCalled()
    expect(wrapper.state('newDialogOpen')).toBe(false)
    expect(wrapper.state('snackbarOpen')).toBe(true)
  })
})

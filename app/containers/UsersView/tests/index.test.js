import React from 'react'
import { shallow } from 'enzyme'
import { UsersView } from '../index'

describe('<UsersView />', () => {
  const mockProps = {
    requestUsers: jest.fn(),
    intl: { formatMessage: msg => msg.defaultMessage },
    token: 'test_token',
    total: 2,
    users: [{ _id: '1', name: 'User 1', email: 'u1@test.com' }, { _id: '2', name: 'User 2', email: 'u2@test.com' }],
    loading: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the Grid with users and calls requestUsers on mount', () => {
    const wrapper = shallow(<UsersView {...mockProps} />)
    expect(wrapper.find('Grid').length).toBe(1)
    expect(mockProps.requestUsers).toHaveBeenCalled()
  })

  it('handles page change and requests the new page', () => {
    const wrapper = shallow(<UsersView {...mockProps} />)
    wrapper.instance().changeCurrentPage(1)
    expect(mockProps.requestUsers).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }), 'test_token')
  })

  it('handles page size change and resets page to 1', () => {
    const wrapper = shallow(<UsersView {...mockProps} />)
    wrapper.instance().changePageSize(100)
    expect(mockProps.requestUsers).toHaveBeenCalledWith(
      expect.objectContaining({ pageSize: 100, page: 1 }),
      'test_token',
    )
  })

  it('handles sorting change', () => {
    const wrapper = shallow(<UsersView {...mockProps} />)
    wrapper.instance().changeSorting([{ columnName: 'email', direction: 'desc' }])
    expect(mockProps.requestUsers).toHaveBeenCalledWith(
      expect.objectContaining({ sort: 'email', direction: 'desc' }),
      'test_token',
    )
  })
})

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import jp from 'jsonpath'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Badge from '@material-ui/core/Badge'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CategoryForm from 'components/CategoryForm'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DeleteIcon from '@material-ui/icons/Delete'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import ListItemText from '@material-ui/core/ListItemText'

// From: https://codepen.io/mochiron/pen/jrymLG

// eslint-disable-next-line react/prefer-stateless-function
class Item extends Component {
  render() {
    return (
      <li>
        {this.props.name}
        {this.props.children}
      </li>
    )
  }
}

// eslint-disable-next-line react/no-multi-comp
class ListTree extends Component {
  state = {
    open: {},
    openForm: '',
    visibilityIcons: '',
    editItem: null, // so we can open same form for adding or editing items
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    category: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }

  handleClick = (event, item) => {
    const { onSelect } = this.props
    // if was selected, then deselect:
    onSelect(item)
    const { open } = this.state
    open[item] = !open[item]
    // if hide item, then hide also form
    this.setState({ open, openForm: '' })
  }

  handleIconsVisibility = (event, item) => this.setState({ visibilityIcons: item })

  handleEdit = (event, item) => {
    event.stopPropagation()
    this.setState({ openForm: item, editItem: item })
  }

  handleAdd = (event, item) => {
    event.stopPropagation()
    this.setState({ openForm: item, editItem: null })
    // this.props.onAdd(item)
  }

  handleDelete = item => {
    this.props.onDelete(item)
  }

  renderActionIcons = item =>
    this.state.visibilityIcons === item ? (
      <>
        <IconButton aria-label="Edit" onClick={event => this.handleEdit(event, item)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="Add" onClick={event => this.handleAdd(event, item)}>
          <AddIcon />
        </IconButton>
        <IconButton aria-label="Delete" onClick={() => this.handleDelete(item)}>
          <DeleteIcon />
        </IconButton>
      </>
    ) : (
      ''
    )

  renderForm = item => {
    if (item) {
      const { data, onUpdate } = this.props
      // calculate its path and its content for CategoryForm:
      const path = jp.paths(data, `$..${item}`)[0]
      path.shift()
      let subData = data
      path.forEach(key => {
        subData = subData[key]
      })
      return <CategoryForm data={subData} item={item} onSubmit={onUpdate} />
    }
    return <CategoryForm />
  }

  renderTreeNodes = data =>
    Object.keys(data).map(item => {
      // calculate how deep is it
      const depth = jp.paths(this.props.data, `$..${item}`)[0].length / 2 - 1
      if (data[item].children) {
        return (
          <React.Fragment key={item}>
            <ListItem
              button
              selected={this.props.category === item}
              style={{ paddingLeft: depth * 30 }}
              onClick={() => this.handleClick(event, item)}
              onMouseEnter={event => this.handleIconsVisibility(event, item)}
              onMouseLeave={event => this.handleIconsVisibility(event, item)}
            >
              <ListItemText
                primary={
                  <Badge
                    color="secondary"
                    style={{ paddingRight: 10 }}
                    badgeContent={Object.keys(data[item].children).length}
                  >
                    {data[item].tag}
                  </Badge>
                }
              />
              {this.renderActionIcons(item)}

              {this.state.open[item] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {this.state.openForm === item && this.renderForm(this.state.editItem)}

            <Collapse in={!!this.state.open[item]} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                onMouseEnter={event => this.handleIconsVisibility(event, item)}
                onMouseLeave={event => this.handleIconsVisibility(event, item)}
              >
                {this.renderTreeNodes(data[item].children)}
              </List>
            </Collapse>
          </React.Fragment>
        )
      }
      return (
        <React.Fragment key={item}>
          <ListItem
            button
            selected={this.props.category === item}
            onClick={() => this.handleClick(event, item)}
            style={{ paddingLeft: depth * 30 }}
            onMouseEnter={event => this.handleIconsVisibility(event, item)}
            onMouseLeave={event => this.handleIconsVisibility(event, item)}
          >
            <ListItemText primary={data[item].tag} />
            {this.renderActionIcons(item)}
          </ListItem>
          {this.state.openForm === item && this.renderForm(this.state.editItem)}
        </React.Fragment>
      )
    })

  render() {
    return <List component="nav">{this.renderTreeNodes(this.props.data)}</List>
  }
}

export default ListTree

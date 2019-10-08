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
import ConfirmationDialog from './ConfirmationDialog'

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
    visibilityIcons: '',
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    category: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onBeforeDelete: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    open: PropTypes.object.isRequired, // which categories keys are open by default
    onClick: PropTypes.func.isRequired,
    openForm: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    action: PropTypes.string.isRequired,
    targetItem: PropTypes.string.isRequired,
    confirmationBoxOpen: PropTypes.bool.isRequired,
  }

  handleClick = (event, item) => this.props.onClick(item)

  handleIconsVisibility = (event, item) => this.setState({ visibilityIcons: item })

  clickEditButton = (event, item) => {
    event.stopPropagation()
    this.setState({ openForm: item, targetItem: item, action: 'edit' })
  }

  clickAddButton = (event, item) => {
    event.stopPropagation()
    this.setState({ openForm: item, targetItem: item, action: 'add' })
    // this.props.onAdd(item)
  }

  clickDeleteButton = item => {
    this.props.onBeforeDelete(item)
  }

  handleDelete = accept => this.props.onDelete(this.props.targetItem, accept)

  handleUpdate = (event, item) => this.props.onUpdate(event, item)

  handleClose = () => this.props.onClose()

  handleAdd = (event, item) => this.props.onAdd(event, item)

  renderActionIcons = item =>
    this.state.visibilityIcons === item ? (
      <>
        <IconButton aria-label="Edit" onClick={event => this.clickEditButton(event, item)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="Add" onClick={event => this.clickAddButton(event, item)}>
          <AddIcon />
        </IconButton>
        <IconButton aria-label="Delete" onClick={() => this.clickDeleteButton(item)}>
          <DeleteIcon />
        </IconButton>
      </>
    ) : (
      ''
    )

  renderForm = (item, depth) => {
    const { data, action } = this.props
    // calculate its path and its content for CategoryForm:

    // const subData = jp.value(data, `$..${item}`)
    // get keys with spaces

    const subData = jp.value(data, `$..["${item}"]`)

    const menuItems = []

    // get all keys and values from Category
    const categoryValues = categories => {
      Object.keys(categories).forEach(key => {
        menuItems.push({
          key,
          text: categories[key].text,
          tags: categories[key].tags,
          keywords: categories[key].keywords,
        })
        if (categories[key].children) categoryValues(categories[key].children)
      })
      menuItems.sort((a, b) => a.text < b.text)
    }
    menuItems.sort((a, b) => a.text < b.text)
    // load data to menuItems, we will sort them inside CategoryForm when c
    categoryValues(data)

    return (
      <div style={{ paddingLeft: depth * 30 }}>
        <CategoryForm
          data={action === 'edit' ? subData : {}}
          item={item}
          menuItems={menuItems}
          onSubmit={action === 'edit' ? this.handleUpdate : this.handleAdd}
          onClose={this.handleClose}
        />
      </div>
    )
  }

  renderTreeNodes = data =>
    Object.keys(data).map(item => {
      // calculate how deep it is
      const depth = jp.paths(this.props.data, `$..["${item}"]`)[0].length / 2 - 1
      // add this.props.open[item] to improve performance!!!
      if (data[item].children && this.props.open[item]) {
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
                    {data[item].text}
                  </Badge>
                }
              />
              {this.renderActionIcons(item)}

              {this.props.open[item] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {this.props.openForm === item && this.renderForm(item, depth)}

            <Collapse in={!!this.props.open[item]} timeout="auto" unmountOnExit>
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
            {data[item].children && (
              <ListItemText
                primary={
                  <Badge
                    color="secondary"
                    style={{ paddingRight: 10 }}
                    badgeContent={Object.keys(data[item].children).length}
                  >
                    {data[item].text}
                  </Badge>
                }
              />
            )}
            {!data[item].children && <ListItemText primary={data[item].text} />}
            {this.renderActionIcons(item)}
          </ListItem>
          {this.props.openForm === item && this.renderForm(item, depth)}
        </React.Fragment>
      )
    })

  render() {
    return (
      <React.Fragment>
        <List component="nav">{this.renderTreeNodes(this.props.data)}</List>
        <ConfirmationDialog onClose={this.handleDelete} open={this.props.confirmationBoxOpen} />
      </React.Fragment>
    )
  }
}

export default ListTree

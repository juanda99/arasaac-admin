import React from 'react';
import Sidebar from 'components/Sidebar';
import AppBar from 'components/AppBar';

class Header extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    return (
      <div style={{ minHeight: '100vh' }}>
        <AppBar onClick={this.handleDrawerToggle} />
        <Sidebar
          mobileOpen={this.state.mobileOpen}
          onClose={this.handleDrawerToggle}
        />
      </div>
    );
  }
}

export default Header;

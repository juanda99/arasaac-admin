const drawerWidth = 260;

const transition = {
  transition: "all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
};

const appStyle = theme => ({
  wrapper: {
    position: "relative",
    top: "0",
    height: "100vh"
  },
  mainPanel: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    overflow: "auto",
    position: "relative",
    float: "right",
    ...transition,
    maxHeight: "100%",
    width: "100%",
    overflowScrolling: "touch"
  },
  content: {
    marginTop: "70px",
    padding: "30px 15px",
    minHeight: "calc(100vh - 123px)"
  },
  container: {
    marginTop: "70px",
    paddingRight: "15px",
    paddingLeft: "15px",
    marginRight: "auto",
    marginLeft: "auto"
  }
});

export default appStyle;

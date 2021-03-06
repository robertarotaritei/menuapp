import React from "react";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import currentFoodList from "../Current Order/CurrentFoodList";
import currentDrinkList from "../Current Order/CurrentDrinkList";
import { Redirect } from "react-router-dom";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import QRScanner from "../QRScanner";
import CameraIcon from "@material-ui/icons/CameraAlt";
import { withStyles } from "@material-ui/styles";

const styles = {
  buttonPressed: {
    background: "white",
    color: "#b71c1c",
  },
};

class NavBar extends React.Component {
  constructor() {
    super();
    this.state = {
      totalProductsInOrder: 0,
      redirect: false,
      redirectMenu: false,
      setOpen: false,
      tableId: sessionStorage.getItem("tableId"),
      restaurantNameData: { title: "Restaurant" },
    };
  }

  handleOpenModal = () => {
    this.setState({ setOpen: true });
  };

  componentDidMount() {
    let mounted = true;

    if (mounted) {
      let items = sessionStorage.getItem("currentFoodList")
        ? JSON.parse(sessionStorage.getItem("currentFoodList") || [])
        : [];
      currentFoodList.splice(0, currentFoodList.length);
      items.map((item) => {
        currentFoodList.push(item);
        return true;
      });

      items = sessionStorage.getItem("currentDrinkList")
        ? JSON.parse(sessionStorage.getItem("currentDrinkList") || [])
        : [];
      currentDrinkList.splice(0, currentDrinkList.length);
      items.map((item) => {
        currentDrinkList.push(item);
        return true;
      });
    }

    setInterval(() => {
      this.totalProductsInOrder();
    }, 10);
  }

  handleOpenModal = () => {
    this.setState({ setOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ setOpen: false });
  };

  setRedirect = () => {
    this.setState({
      redirect: true,
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/order" />;
    }
  };

  setRedirectMenu = () => {
    this.setState({
      redirectMenu: true,
    });
  };

  renderRedirectMenu = () => {
    if (this.state.redirectMenu) {
      return <Redirect to="/menu" />;
    }
  };

  getTotalItemsInOrder() {
    let sum = 0;
    currentFoodList.forEach((element) => {
      sum = sum + element.count;
    });

    currentDrinkList.forEach((element) => {
      sum = sum + element.count;
    });
    return sum;
  }

  totalProductsInOrder() {
    let totalItems = this.getTotalItemsInOrder();
    if (totalItems !== this.state.totalProductsInOrder) {
      this.setState({ totalProductsInOrder: totalItems });
    }
  }

  getRestaurantName = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/RestaurantName`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ restaurantNameData: data });
      });
  };

  callStaff = () => {
    var tableInfo = {
      Id: this.state.tableId,
      RequiresAssistance: true,
    };
    fetch(`${process.env.REACT_APP_API_URL}/api/table/tableAssistance`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tableInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static">
          <ToolBar>
          {!sessionStorage.getItem("tableId") ? (
            <Typography variant="h6" color="inherit" text-align="center">
              Restaurant
            </Typography>
          ) : null}
            {this.renderRedirect()}
            {this.renderRedirectMenu()}
            <Container disableGutters>
              <div style={{ float: "right" }}>
                <ButtonGroup
                  variant="text"
                  size="large"
                  color="inherit"
                  aria-label="text primary button group"
                >
                  <Button
                    onClick={this.setRedirectMenu}
                    className={
                      this.props.pageName === "menu"
                        ? classes.buttonPressed
                        : ""
                    }
                    color="inherit"
                  >
                    Menu
                  </Button>
                  {sessionStorage.getItem("tableId") ? (
                    <div>
                      <Button
                        onClick={this.setRedirect}
                        size="large"
                        color="inherit"
                        className={
                          this.props.pageName === "order"
                            ? classes.buttonPressed
                            : ""
                        }
                        startIcon={<FastfoodIcon />}
                      >
                        My orders{" "}
                        {this.state.totalProductsInOrder
                          ? ` (${this.state.totalProductsInOrder})`
                          : ""}
                      </Button>
                      <Button
                        onClick={this.callStaff}
                        size="large"
                        color="inherit"
                      >
                        Call Waiter
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={this.handleOpenModal}
                      size="large"
                      color="inherit"
                      startIcon={<CameraIcon />}
                    >
                      Scan QR
                    </Button>
                  )}
                </ButtonGroup>
              </div>
            </Container>

            {this.state.setOpen ? (
              <Dialog
                open={this.handleOpenModal}
                onClose={this.handleCloseModal}
                aria-labelledby="product-title"
                aria-describedby="product-description"
              >
                <DialogTitle id="product-title">QR-scanner</DialogTitle>
                <DialogContent>
                  <DialogContentText id="product-description">
                    Scan the QR-code which is on the table!
                  </DialogContentText>
                  <DialogContentText id="product-description">
                    <QRScanner />
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseModal} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            ) : null}
          </ToolBar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);

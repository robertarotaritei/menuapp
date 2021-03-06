import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import currentFoodList from '../Current Order/CurrentFoodList';
import currentDrinkList from '../Current Order/CurrentDrinkList';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

const Product = (props) => {
    const [open, setOpen] = React.useState(false);
    const [successMessage, showSuccessMessage] = React.useState(false);
    const [foodLike, setFoodLike] = React.useState(localStorage.getItem('foodLikes') ? localStorage.getItem('foodLikes').indexOf(props.product.id) > -1 ? true : false : false)
    const [drinkLike, setDrinkLike] = React.useState(localStorage.getItem('drinkLikes') ? localStorage.getItem('drinkLikes').indexOf(props.product.id) > -1 ? true : false : false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSuccessOpen = () => {
        showSuccessMessage(true);
    };

    const handleSuccessClose = () => {
        showSuccessMessage(false);
    };

    const addFoodLikes = (e) => {
        e.preventDefault();
        let foodLikeNew = {
            food: props.product,
            likes: props.product.likes
        }
        let likes = localStorage.getItem('foodLikes') ? localStorage.getItem('foodLikes').split(',') : [];
        if (foodLike) {
            let index = likes.indexOf(props.product.id);
            likes.splice(index, 1);
            foodLikeNew.likes--;
            setFoodLike(false);
        }
        else {
            likes.push(props.product.id);
            foodLikeNew.likes++;
            foodLikeNew.timeStamp = new Date();
            setFoodLike(true);
        }

        fetch(`${process.env.REACT_APP_API_URL}/api/FoodLikes`, {
            method: "PUT",
            mode: "cors",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(foodLikeNew),
        }).catch(console.log);

        localStorage.setItem('foodLikes', likes);
    }

    const addDrinkLikes = (e) => {
        e.preventDefault();
        let drinkLikeNew = {
            drink: props.product,
            likes: props.product.likes
        }
        let likes = localStorage.getItem('drinkLikes') ? localStorage.getItem('drinkLikes').split(',') : [];
        if (drinkLike) {
            let index = likes.indexOf(props.product.id);
            likes.splice(index, 1);
            drinkLikeNew.likes--;
            setDrinkLike(false);
        }
        else {
            likes.push(props.product.id);
            drinkLikeNew.likes++;
            drinkLikeNew.timeStamp = new Date();
            setDrinkLike(true);
        }

        fetch(`${process.env.REACT_APP_API_URL}/api/DrinkLikes`, {
            method: "POST",
            mode: "cors",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(drinkLikeNew),
        }).catch(console.log);

        localStorage.setItem('drinkLikes', likes);
    }

    function addToOrder(e) {
        e.preventDefault();
        if (props.productType === "Food") {
            let index = currentFoodList.indexOf(props.product);
            if(index !== -1){
                currentFoodList[index].count++;
            }
            else{
                let food = props.product;
                food.count = 1;
                currentFoodList.push(food);
            }
            sessionStorage.setItem("currentFoodList", JSON.stringify(currentFoodList));
        }
        else {
            let index = currentDrinkList.indexOf(props.product);
            if(index !== -1){
                currentDrinkList[index].count++;
            }
            else{
                let drink = props.product;
                drink.count = 1;
                currentDrinkList.push(drink);
            }
            sessionStorage.setItem("currentDrinkList", JSON.stringify(currentDrinkList));
        }
        handleSuccessOpen();
    };

    function renderIngredients() {
        let ingredients = [];
        props.product.ingredients.map(currentIngredient => (
            ingredients.push(currentIngredient.ingredient.ingredientTitle)
        ));

        return ingredients.toString();
    }

    return (
        <div>
            { props.product ? (
                <div>
                    <Card className="flex-column-mobile" style={{display: 'flex'}}>
                        <CardMedia
                            className="product-card-image"
                            style={{ height: 200}}
                            component="img"
                            height="250"
                            src={props.product.image}
                            alt={`Image for ${props.product.title} Not Found`}
                            title={props.product.title}
                        />
                        <CardContent style={{display: 'flex', flexDirection: 'column'}}>
                            <Typography gutterBottom variant="inherit" component="h2">
                                {props.product.title} 
                            </Typography>
                            <span style={{ float: "right", color: "green", display: "block", fontWeight: 'bold', fontSize: 20, marginBottom: 15 }}>{props.product.price}€</span>
                            <Typography variant="subtitle2">
                                {renderIngredients()}
                            </Typography>
                        </CardContent>
                        <CardActions style={{ marginLeft: 'auto'}}>
                            <Grid
                                container
                                alignItems="flex-start"
                                justify="flex-end"
                                direction="row"
                            >
                                <div style={{ display: 'flex', alignItems: 'right' }}>
                                    <Button size="large" color="primary" target="_blank" onClick={handleClickOpen}>
                                        <span style={{ fontWeight: "bold" }}>View Details</span>
                                    </Button>
                                    <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="product-title"
                                        aria-describedby="product-description"
                                    >
                                        <DialogTitle id="product-title">{props.product.title}</DialogTitle>
                                        <DialogContent style={{minWidth: 200}}>
                                            <DialogContentText id="product-description">
                                                {props.product.description}
                                            </DialogContentText>
                                            {renderIngredients() !== "" ?
                                            <DialogContentText id="product-ingredients">
                                                <h4>Ingredients</h4>
                                                {renderIngredients()}
                                            </DialogContentText>
                                             : null}
                                            <DialogContentText id="product-price">
                                                <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                                                <h4>Price</h4>
                                                <span style={{ marginLeft: 15, color: "green", fontWeight: "bold" }}>{props.product.price}€</span>
                                                </div>
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <IconButton aria-label="close" color="primary" onClick={handleClose}>
                                                <CloseIcon />
                                            </IconButton>
                                        </DialogActions>
                                    </Dialog>
                                    {sessionStorage.getItem("tableId") ? (
                                        <div>
                                            {props.productType === 'Food' ? (
                                                <IconButton aria-label="add to favorites" color="primary" onClick={addFoodLikes}>
                                                <FavoriteIcon style={{ color: foodLike ? 'inherit' : 'gray' }} />
                                            </IconButton>
                                            ) : (
                                                <IconButton aria-label="add to favorites" color="primary" onClick={addDrinkLikes}>
                                                <FavoriteIcon style={{ color: drinkLike ? 'inherit' : 'gray' }} />
                                            </IconButton>
                                            )}
                                            <IconButton aria-label="add to order" color="primary" onClick={addToOrder}>
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                    ) : (
                                            null
                                        )}
                                </div>
                            </Grid>
                        </CardActions>
                    </Card>
                    <Snackbar open={successMessage} autoHideDuration={3000} onClose={handleSuccessClose}>
                        <Alert variant="filled" severity="success">
                            Product successfully added!
                        </Alert>
                    </Snackbar>
                </div>
            ) : null}
        </div>
    )
}
export default Product
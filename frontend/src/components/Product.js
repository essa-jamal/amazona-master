import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import translator from '../translator';
import { castNumber } from '../utils';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    lang,defLang
  } = state;
const frontEnd=translator.product.frontEnd
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert(frontEnd.SorryProductisoutofstock[lang] || 
        frontEnd.SorryProductisoutofstock[defLang] || 'Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name.split('@@')[lang]||product.name.split('@@')[defLang]||product.name.split('@@')[0]} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title >{product.name.split('@@')[lang]||product.name.split('@@')[defLang]||product.name.split('@@')[0]}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        
        <Card.Text>{
        
        castNumber( product.price,lang,product.priceUnit)}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            {frontEnd.Outofstock[lang] || frontEnd.Outofstock[defLang] || 'Out of stock'}
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>{frontEnd.AddtoCart[lang] || frontEnd.AddtoCart[defLang]|| 'Add to cart'}</Button>
        )}      </Card.Body>
    </Card>
  );
}
export default Product;
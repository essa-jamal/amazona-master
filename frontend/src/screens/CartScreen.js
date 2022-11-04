import { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageBox from "../components/MessageBox";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import translator from "../translator";
import { castNumber } from "../utils";

export default function CartScreen() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },lang,defLang
  } = state;
  const frontEnd = translator.cart.frontEnd
  
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert(`${frontEnd.SorryProductisoutofstock[lang] || frontEnd.SorryProductisoutofstock[defLang] || 'error'}`);
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>{frontEnd.ShoppingCart[lang] || frontEnd.ShoppingCart[defLang] || 'Shopping Cart'}</title>
      </Helmet>
      <h1>{frontEnd.ShoppingCart[lang] || frontEnd.ShoppingCart[defLang] || 'Shopping Cart'}</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
             {frontEnd.Cartisempty[lang] || frontEnd.Cartisempty[defLang] || 'Cart is empty.' }<Link to="/">{frontEnd.GoShopping[lang] || frontEnd.GoShopping[defLang] || 'Go Shopping'}</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{" "}
                      <Link to={`/product/${item.slug}`}>{item.name.split('@@')[lang]}</Link>
                    </Col>
                    <Col md={3}>
                    <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant="light"
                        disabled={item.quantity === 1}
                      >                        <i className="fas fa-minus-circle"></i>
                      </Button>{" "}
                      <span>{castNumber( item.quantity,lang)}</span>{" "}
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>{castNumber( item.price,lang,'$')}</Col>
                    <Col md={2}>
                    <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                      >
                          <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                   {frontEnd.Subtotal[lang] || frontEnd.Subtotal[defLang] || 'Subtotal'} ({castNumber( cartItems.reduce((a, c) => a + c.quantity, 0),lang)}{" "}
                   {frontEnd.items[lang] || frontEnd.items[defLang] || 'items' }) : 
                    {castNumber( cartItems.reduce((a, c) => a + c.price * c.quantity, 0),lang,'$')}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      {frontEnd.ProceedtoCheckout[lang] || frontEnd.ProceedtoCheckout[defLang] || 'Proceed to Checkout'}
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

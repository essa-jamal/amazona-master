import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { castNumber, getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import translator from '../translator';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo,lang,defLang } = state;
const frontEnd=translator.Shipping.frontEnd;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>{frontEnd.PreviewOrder[lang]||frontEnd.PreviewOrder[defLang]||'Preview Order'}</title>
      </Helmet>
      <h1 className="my-3">{frontEnd.PreviewOrder[lang]||frontEnd.PreviewOrder[defLang]||'Preview Order'}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{frontEnd.Shipping[lang]||frontEnd.Shipping[defLang]||'Shipping'}</Card.Title>
              <Card.Text>
                <strong>{frontEnd.FullName[lang]||frontEnd.FullName[defLang]||'Name'}:</strong> {cart.shippingAddress.fullName} <br />
                <strong>{frontEnd.Address[lang]||frontEnd.Address[defLang]||'Address'}: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">{frontEnd.Edit[lang]||frontEnd.Edit[defLang]||'Edit'}</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{frontEnd.Payment[lang]||frontEnd.Payment[defLang]||'Payment'}</Card.Title>
              <Card.Text>
                <strong>{frontEnd.PaymentMethod[lang]||frontEnd.PaymentMethod[defLang]||'Method'}:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">{frontEnd.Edit[lang]||frontEnd.Edit[defLang]||'Edit'}</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{frontEnd.Items[lang]||frontEnd.Items[defLang]||'Items'}</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name.split('@@')[lang]}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{castNumber( item.quantity,lang)}</span>
                      </Col>
                      <Col md={3}>{castNumber( item.price,lang,'$')}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">{frontEnd.Edit[lang]||frontEnd.Edit[defLang]||'Edit'}</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>{frontEnd.OrderSummary[lang]||frontEnd.OrderSummary[defLang]||'Order Summary'}</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>{frontEnd.Items[lang]||frontEnd.Items[defLang]||'Items'}</Col>
                    <Col>{castNumber(Number(cart.itemsPrice.toFixed(2)),lang,'$')}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>{frontEnd.Shipping[lang]||frontEnd.Shipping[defLang]||'Shipping'}</Col>
                    <Col>{castNumber(Number(cart.shippingPrice.toFixed(2)),lang,'$')}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>{frontEnd.Tax[lang]||frontEnd.Tax[defLang]||'Tax'}</Col>
                    <Col>{castNumber(Number(cart.taxPrice.toFixed(2)),lang,'$')}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> {frontEnd.OrderTotal[lang]||frontEnd.OrderTotal[defLang]||'Order Total'}</strong>
                    </Col>
                    <Col>
                      <strong>{castNumber(Number(cart.totalPrice.toFixed(2)),lang,'$')}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      {frontEnd.PlaceOrder[lang]||frontEnd.PlaceOrder[defLang]||'Place Order'}
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
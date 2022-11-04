import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { castNumber, getError } from '../utils';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import translator from '../translator';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
      case 'DELIVER_REQUEST':
        return { ...state, loadingDeliver: true };
      case 'DELIVER_SUCCESS':
        return { ...state, loadingDeliver: false, successDeliver: true };
      case 'DELIVER_FAIL':
        return { ...state, loadingDeliver: false };
      case 'DELIVER_RESET':
        return {
          ...state,
          loadingDeliver: false,
          successDeliver: false,
        };
    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo,lang,defLang } = state;
  const frontEnd=translator.Shipping.frontEnd;
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order,
    loadingDeliver,
      successDeliver
  }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/signin');
    }
    
    if (
      !order._id ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
    fetchOrder();
    if (successDeliver) {
      dispatch({ type: 'DELIVER_RESET' });
    }
    }
    
  }, [order, userInfo, orderId, navigate,successDeliver]);
  
  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>{frontEnd.Order[lang]||frontEnd.Order[defLang]||'Order'} {orderId}</title>
      </Helmet>
      <h1 className="my-3">{frontEnd.Order[lang]||frontEnd.Order[defLang]||'Order'} {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{frontEnd.Shipping[lang]||frontEnd.Shipping[defLang]||'Shipping'}</Card.Title>
              <Card.Text>
                <strong>{frontEnd.FullName[lang]||frontEnd.FullName[defLang]||'Name'}:</strong> {order.shippingAddress.fullName} <br />
                <strong>{frontEnd.Address[lang]||frontEnd.Address[defLang]||'Address'}: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  {frontEnd.Deliveredat[lang]||frontEnd.Deliveredat[defLang]||'Delivered at'} {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">{frontEnd.NotDelivered[lang]||frontEnd.NotDelivered[defLang]||'Not Delivered'}</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{frontEnd.Payment[lang]||frontEnd.Payment[defLang]||'Payment'}</Card.Title>
              <Card.Text>
                <strong>{frontEnd.PaymentMethod[lang]||frontEnd.PaymentMethod[defLang]||'Method'}:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  {frontEnd.Paidat[lang]||frontEnd.Paidat[defLang]||'Paid at'} {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">{frontEnd.NotPaid[lang]||frontEnd.NotPaid[defLang]||'Not Paid'}</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{frontEnd.ItemsList[lang]||frontEnd.ItemsList[defLang]||'Items'}</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
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
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{frontEnd.OrderSummary[lang]||frontEnd.OrderSummary[defLang]||'Order Summary'}</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>{frontEnd.ItemsList[lang]||frontEnd.ItemsList[defLang]||"Items"}</Col>
                    <Col>{castNumber(Number(order.itemsPrice.toFixed(2)),lang,'$')}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>{frontEnd.Shipping[lang]||frontEnd.Shipping[defLang]||'Shipping'}</Col>
                    <Col>{castNumber(Number(order.shippingPrice.toFixed(2)),lang,'$')}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>{frontEnd.Tax[lang]||frontEnd.Tax[defLang]||'Tax'}</Col>
                    <Col>{castNumber(Number(order.taxPrice.toFixed(2)),lang,'$')}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> {frontEnd.OrderTotal[lang]||frontEnd.OrderTotal[defLang]||'Order Total'}</strong>
                    </Col>
                    <Col>
                      <strong>{castNumber(Number(order.totalPrice.toFixed(2)),lang,'$')}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            {userInfo.isAdmin && !order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className="d-grid">
                      <Button type="button" onClick={deliverOrderHandler}>
                        {frontEnd.DeliverOrder[lang]||frontEnd.DeliverOrder[defLang]||'Deliver Order'}
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
      
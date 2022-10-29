import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { castNumber, getError } from '../utils';
import Button from 'react-bootstrap/esm/Button';
import translator from '../translator';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo,lang,defLang } = state;
  const frontEnd=translator.admin.frontEnd;
  
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <Helmet>
        <title>{frontEnd.OrderHistory[lang]||frontEnd.OrderHistory[defLang]||'Order History'}</title>
      </Helmet>

      <h1>{frontEnd.OrderHistory[lang]||frontEnd.OrderHistory[defLang]||'Order History'}</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>{frontEnd.ID[lang]||frontEnd.ID[defLang]||'ID'}</th>
              <th>{frontEnd.DATE[lang]||frontEnd.DATE[defLang]||'DATE'}</th>
              <th>{frontEnd.TOTAL[lang]||frontEnd.TOTAL[defLang]||'TOTAL'}</th>
              <th>{frontEnd.PAID[lang]||frontEnd.PAID[defLang]||'PAID'}</th>
              <th>{frontEnd.DELIVERED[lang]||frontEnd.DELIVERED[defLang]||'DELIVERED'}</th>
              <th>{frontEnd.ACTIONS[lang]||frontEnd.ACTIONS[defLang]||'ACTIONS'}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{castNumber(order.createdAt.substring(0, 10),lang)}</td>
                <td>{castNumber(Number( order.totalPrice.toFixed(2)),lang,'$')}</td>
                <td>{order.isPaid ? castNumber( order.paidAt.substring(0, 10)+' '+order.paidAt.substring(11, 16),lang) : frontEnd.No[lang]||frontEnd.No[defLang]||'No'}</td>
                <td>
                  {order.isDelivered
                    ? castNumber( order.deliveredAt.substring(0, 10)+' '+order.deliveredAt.substring(11, 16),lang)
                    :frontEnd.No[lang]||frontEnd.No[defLang]||'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    {frontEnd.Details[lang]||frontEnd.Details[defLang]||'Details'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
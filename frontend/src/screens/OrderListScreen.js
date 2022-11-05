import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { castNumber, getError } from "../utils";
import { toast } from "react-toastify";
import translator from "../translator";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo,lang,defLang } = state;
  const frontEnd=translator.admin.frontEnd
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
  useReducer(reducer, {
    loading: true,
    error: '',
  });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm(frontEnd.Areyousuretodelete[lang]||frontEnd.Areyousuretodelete[defLang]||'Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success(frontEnd.orderdeletedsuccessfully[lang]||frontEnd.orderdeletedsuccessfully[defLang]||'order deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };
  return (
    <div>
      <Helmet>
        <title>{frontEnd.Orders[lang]||frontEnd.Orders[defLang]||'Orders'}</title>
      </Helmet>
      <h1>{frontEnd.Orders[lang]||frontEnd.Orders[defLang]||'Orders'}</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>{frontEnd.ID[lang]||frontEnd.ID[defLang]||'ID'}</th>
              <th>{frontEnd.USER[lang]||frontEnd.USER[defLang]||'USER'}</th>
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
                <td>{order.user ? order.user.name :frontEnd.DELETEDUSER[lang]||frontEnd.DELETEDUSER[defLang]|| "DELETED USER"}</td>
                <td>{castNumber( order.createdAt.substring(0, 10),lang)}</td>
                <td>{castNumber( order.totalPrice.toFixed(2),lang)}</td>
                <td>{order.isPaid ?castNumber( order.paidAt.substring(0, 10),lang) :frontEnd.No[lang]||frontEnd.No[defLang]|| "No"}</td>
                
                <td>
                  {order.isDelivered
                    ?castNumber( order.deliveredAt.substring(0, 10),lang)
                    : frontEnd.No[lang]||frontEnd.No[defLang]||"No"}
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
                  &nbsp;
                  {userInfo.isSuperAdmin && (<Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(order)}
                  >
                    {frontEnd.Delete[lang]||frontEnd.Delete[defLang]||'Delete'}
                  </Button>)}
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

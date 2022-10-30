import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { castNumber, getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import translator from '../translator';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  
  const { state } = useContext(Store);
  const { userInfo,lang,defLang } = state;
const frontEnd=translator.admin.dashboard;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
  console.log('data -> ',data)
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        console.log('erro data -> ',err)
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <h1>{frontEnd.Dashboard[lang]||frontEnd.Dashboard[defLang]||'Dashboard'}</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {castNumber( summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0,lang)}
                  </Card.Title>
                  <Card.Text> {frontEnd.Users[lang]||frontEnd.Users[defLang]||'Users'}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {castNumber( summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0,lang)}
                  </Card.Title>
                  <Card.Text> {frontEnd.Orders[lang]||frontEnd.Orders[defLang]||'Orders'}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    
                    {castNumber( summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0,lang,'$')}
                  </Card.Title>
                  <Card.Text> {frontEnd.Orders[lang]||frontEnd.Orders[defLang]||'Orders'}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="my-3">
            <h2>{frontEnd.Sales[lang]||frontEnd[defLang]||'Sales'}</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>{frontEnd.NoSale[lang]||frontEnd.NoSale[defLang]||'No Sale'}</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>{frontEnd.LoadingChart[lang]||frontEnd.LoadingChart[defLang]||'Loading Chart...'}</div>}
                data={[
                  ['Date'  , frontEnd.Sales[lang]||'Sales'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </div>
          <div className="my-3">
            <h2>{frontEnd.Categories[lang]||frontEnd.Categories[defLang]||'Categories'}</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>{frontEnd.NoSale[lang]||frontEnd.NoSale[defLang]||'No Category'}</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>{frontEnd.LoadingChart[lang]||frontEnd.LoadingChart[defLang]||'Loading Chart...'}</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}
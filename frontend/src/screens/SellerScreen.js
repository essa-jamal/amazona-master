import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import { Store } from '../Store';
import translator from '../translator';
import Rating from '../components/Rating';
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


function SellerScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const { id} = params;
  //console.log(id)
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  
  let sellerData=products[0] && products[0].userOwner
  console.log(sellerData)
  const { state } = useContext(Store);
  const { lang,defLang } = state;
  
const frontEnd=translator.home.frontEnd;
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products?seller=${id}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data.filter(x=>x.isAvailable) });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }

      // setProducts(result.data);
    };
    
    fetchData();
  }, [lang,id]);

  return (
    <div>
      <Helmet>
        <title>
          Seller: {sellerData? sellerData.seller.name.split('&&')[lang]||sellerData.seller.name.split('&&')[0]:''}

        
        </title>
      </Helmet>
      <Row>
      <Col md={3} >
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                   <Col>
                   <img
                    className="small logo"
                    src={sellerData?sellerData.seller.logo:''}
                    alt={sellerData?sellerData.seller.name.split('&&')[lang]||sellerData.seller.name.split('&&')[0]:''}
                  ></img>
                   </Col> 
                   <Col><h5> {sellerData?sellerData.seller.name.split('&&')[lang]||sellerData.seller.name.split('&&')[0]:''}</h5></Col>
                     </Row>
                     <Row>
                      <Col>
                      <Rating rating={sellerData?sellerData.seller.rating:4} numReviews={sellerData?sellerData.seller.numReviews:5} />
        </Col>
                      
                       </Row>
                  <Row>
        
            <a href={`mailto:${sellerData&&sellerData.email}`}>Contact Seller</a>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
        <p>
          {(sellerData&&sellerData.seller.description.split('&&')[lang])||(sellerData && sellerData.seller.description.split('&&')[0])}
        </p>
            
                  </Row>
                </ListGroup.Item>
        </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      <Col md={9} >
      <div className="products">
        {loading ? (
           <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            { products.length ? products.map((product) => (
              <Col key={product.slug} sm={6} md={5} lg={6} className="mb-3">
                <Product product={product}></Product>
              </Col>
            )):(
              
              products.filter(x=>x.isAvailable).length === 0 && (
                <MessageBox>{frontEnd.NoProductAvailable[lang]||frontEnd.NoProductAvailable[defLang]||'No Product Avalable'}</MessageBox>
              
              
              ))}
            
          </Row>
        )}
      </div>
      </Col>
      </Row>



    </div>
    
  )
}

export default SellerScreen
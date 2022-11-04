import axios from "axios";
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { castNumber, getError } from "../utils";
import { Store } from "../Store";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';
import translator from "../translator";

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
function ProductScreen() {
  let reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const params = useParams();
  const navigate = useNavigate();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
  useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo,lang,defLang } = state;
  const frontEnd=translator.product.frontEnd;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert(frontEnd.SorryProductisoutofstock[lang] || frontEnd.SorryProductisoutofstock[defLang]|| "Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate('/cart');

  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error(frontEnd.Pleaseentercommentandrating[lang]|| frontEnd.Pleaseentercommentandrating[defLang]|| 'Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success(frontEnd.Reviewsubmittedsuccessfully[lang]||frontEnd.Reviewsubmittedsuccessfully[defLang]|| 'Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={selectedImage || product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name.split('@@')[lang]||product.name.split('@@')[defLang]||product.name.split('@@')[0]}</title>
              </Helmet>
              <h1>{product.name.split('@@')[lang]||product.name.split('@@')[defLang]||product.name.split('@@')[0]}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>{frontEnd.Price[lang]||frontEnd.price[defLang]|| 'Pirce'} : {castNumber( product.price,lang,product.priceUnit)}</ListGroup.Item>
            <ListGroup.Item>
              <Row xs={1} md={2} className="g-2">
                {[product.image, ...product.images].map((x) => (
                  <Col key={x}>
                    <Card>
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
            {frontEnd.Description[lang] ||frontEnd.Description[defLang] ||'Description'}:
              <p>{product.description.split('@@')[lang]||product.description.split('@@')[defLang]||product.description.split('@@')[0]}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>{frontEnd.Price[lang]||frontEnd.Price[defLang]|| 'Price'}:</Col>
                    <Col>{castNumber( product.price,lang,product.priceUnit)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>{frontEnd.Status[lang]||frontEnd.Status[defLang]|| 'Status'}:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">{frontEnd.InStock[lang]||frontEnd.InStock[defLang]|| 'In Stock'}</Badge>
                      ) : (
                        <Badge bg="danger">{frontEnd.Unavailable[lang]||frontEnd.Unavailable[defLang]|| 'Unavailable'}</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        {frontEnd.AddtoCart[lang]|| frontEnd.AddtoCart[defLang]|| 'Add to Cart'}
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="my-3">
        <h2 ref={reviewsRef}>{frontEnd.Reviews[lang]||frontEnd.Reviews[defLang]|| 'Reviews'}</h2>
        <div className="mb-3">
          {product.reviews.length === 0 && (
            <MessageBox>{frontEnd.Thereisnoreview[lang]||frontEnd.Thereisnoreview[defLang]|| 'There is no review'}</MessageBox>
          )}
        </div>
        <ListGroup>
          {product.reviews.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>{frontEnd.Writeacustomerreview[lang]||frontEnd.Writeacustomerreview[defLang]|| 'Write a customer review'}</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label> {frontEnd.Rating[lang]||frontEnd.Rating[defLang]|| 'Rating'}</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">{frontEnd.Select[lang] || frontEnd.Select[defLang]|| 'Select'}...</option>
                  <option value="1">{castNumber('1- ',lang)+''+ frontEnd.Poor[lang]||frontEnd.poor[defLang]|| 'Poor'}</option>
                  <option value="2">{castNumber('2- ',lang)+''+frontEnd.Fair[lang]||frontEnd.Fair[defLang] ||'Fair'}</option>
                  <option value="3">{castNumber('3- ',lang)+''+frontEnd.Good[lang]||frontEnd.Good[defLang]|| 'Good'}</option>
                  <option value="4">{castNumber('4- ',lang)+''+frontEnd.Verygood[lang]||frontEnd.Verygood[defLang] ||'Very good'}</option>
                  <option value="5">{castNumber('5- ',lang)+''+frontEnd.Excellent[lang]||frontEnd.Excellent[defLang]||'Excelent'}</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label={frontEnd.Comments[lang]||frontEnd.Comments[defLang]||"Comments"}
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder={frontEnd.Leaveacommenthere[lang]||frontEnd.Leaveacommenthere[defLang]||"Leave a comment here"}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>

              <div className="mb-3">
                <Button disabled={loadingCreateReview} type="submit">
                  {frontEnd.Submit[lang] ||frontEnd.Submit[defLang] || 'Submit'}
                </Button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
            </form>
          ) : (
            <MessageBox>
              {frontEnd.Please[lang]||frontEnd.Please[defLang] ||'Please'}{' '}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                {frontEnd.SignIn[lang]||frontEnd.SignIn[defLang]||'Sign In'}
              </Link>{' '}
              {frontEnd.towriteareview[lang]||frontEnd.towriteareview[defLang] ||'to write a review'}
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductScreen;

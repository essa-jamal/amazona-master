import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { castNumber, getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Product from '../components/Product';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import { Store } from '../Store';
import translator from '../translator';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices =(lang,defLang)=> [
  {
    name: `${castNumber(1,lang,'$') +' '+ translator.search.frontEnd.to[lang] +' '+ castNumber(50,lang,'$')  }` ,
    value: '1-50',
  },
  {
    name: `${castNumber(51,lang,'$') + translator.search.frontEnd.to[lang] + castNumber(200,lang,'$')  }` ,
    value: '51-200',
  },
  {
    name: `${castNumber(1000,lang,'$') + translator.search.frontEnd.to[lang] + castNumber(201,lang,'$')  }` ,
    value: '201-1000',
  },
];

export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },

  {
    name: '3stars & up',
    rating: 3,
  },

  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1stars & up',
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
    const { state } = useContext(Store);
    const {  lang,defLang } = state;
    const frontEnd=translator.search.frontEnd
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
        
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div>
      <Helmet>
        <title>{frontEnd.searchproducts[lang]||frontEnd.searchproducts[defLang]||'Search Products'}</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>{frontEnd.Department[lang]||frontEnd.Department[defLang]||'Department'}</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  {frontEnd.Any[lang]||frontEnd.Any[defLang]||'Any'}
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c })}
                  >
                    {c.split('@@')[lang] && c.split('@@')[lang] }
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{frontEnd.Price[lang]||frontEnd.Price[defLang]||'Price'}</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={getFilterUrl({ price: 'all' })}
                >
                  {frontEnd.Any[lang]||frontEnd.Any[defLang]||'Any'}
                </Link>
              </li>
              {prices(lang,defLang).map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? 'text-bold' : ''}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{frontEnd.AvgCustomerReview[lang]||frontEnd.AvgCustomerReview[defLang]||'Avg. Customer Review'}</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                  >
                    <Rating caption={frontEnd.up[lang]||frontEnd.up[defLang]|| ' & up'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'text-bold' : ''}
                >
                  <Rating caption={frontEnd.up[lang]||frontEnd.up[defLang]|| ' & up'} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? ' ' :castNumber( countProducts,lang)} {frontEnd.Results[lang]||frontEnd.Results[defLang]||'Results'}
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category.split('@@')[lang] }
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  {frontEnd.Sortby[lang]||frontEnd.Sortby[defLang]||'Sort by'}{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">{frontEnd.NewestArrivals[lang]||frontEnd.NewestArrivals[defLang]||'Newest Arrivals'}</option>
                    <option value="lowest">{frontEnd.PriceLowtoHigh[lang]||frontEnd.PriceLowtoHigh[defLang]||'Price: Low to High'}</option>
                    <option value="highest">{frontEnd.PriceHightoLow[lang]||frontEnd.PriceHightoLow[defLang]||'Price: High to Low'}</option>
                    <option value="toprated">{frontEnd.AvgCustomerReviews[lang]||frontEnd.AvgCustomerReviews[defLang]||'Avg. Customer Reviews'}</option>
                  </select>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>{frontEnd.NoProductFound[lang]||frontEnd.NoProductFound[defLang]||'No Product Found'}</MessageBox>
              )}

              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>

              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
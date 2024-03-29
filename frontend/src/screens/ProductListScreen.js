import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { castNumber, getError } from '../utils';
import translator from '../translator';
import Badge from "react-bootstrap/Badge";

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
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
      case 'CREATE_REQUEST':
        return { ...state, loadingCreate: true };
      case 'CREATE_SUCCESS':
        return {
          ...state,
          loadingCreate: false,
        };
      case 'CREATE_FAIL':
        return { ...state, loadingCreate: false };

        case 'DELETE_REQUEST':
          return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
          return {
            ...state,
            loadingDelete: false,
            successDelete: true,
          };
        case 'DELETE_FAIL':
          return { ...state, loadingDelete: false, successDelete: false };
    
        case 'DELETE_RESET':
          return { ...state, loadingDelete: false, successDelete: false };
    
      default:
      return state;
  }
};

export default function ProductListScreen() {
const location=useLocation()
const sellerMode = location.pathname.indexOf('/seller') >= 0;

const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });    const navigate = useNavigate();
    const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo,lang,defLang } = state;
  const frontEnd=translator.admin.Products;
  useEffect(() => {
    const fetchData = async () => {
      try {
 
        const seller=sellerMode?userInfo._id:''
        //console.log('seller',seller)
        const { data } = await axios.get(`/api/products/admin?seller=${seller}?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete,sellerMode]);

  const createHandler = async () => {
    if (window.confirm(frontEnd.Areyousuretocreate[lang]||frontEnd.Areyousuretocreate[defLang]||'Are you sure to create?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success(frontEnd.productcreatedsuccessfully[lang]||frontEnd.productcreatedsuccessfully[defLang]||'product created successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };
  
  const deleteHandler = async (product) => {
    if (window.confirm(frontEnd.Areyousuretodelete[lang]||frontEnd.Areyousuretodelete[defLang]||'Are you sure to delete?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success(frontEnd.productdeletedsuccessfully[lang]||frontEnd.productdeletedsuccessfully[defLang]||'product deleted successfully');
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
       <Row>
        <Col>
          <h1>{frontEnd.Products[lang]||frontEnd.Products[defLang]||'Products'}</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              {frontEnd.CreateProduct[lang]||frontEnd.CreateProduct[defLang]||'Create Product'}
            </Button>
          </div>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>{frontEnd.ID[lang]||frontEnd.ID[defLang]||'ID'}</th>
                <th>{frontEnd.Name[lang]||frontEnd.Name[defLang]||'NAME'}</th>
                <th>{frontEnd.Price[lang]||frontEnd.Price[defLang]||'PRICE'}</th>
                <th>{frontEnd.Category[lang]||frontEnd.Category[defLang]||'CATEGORY'}</th>
                <th>{frontEnd.BRAND[lang]||frontEnd.BRAND[defLang]||'BRAND'}</th>
                <th>{frontEnd.userOwner[lang]||frontEnd.userOwner[defLang]||'userOwner'}</th>
                <th>{frontEnd.CreatedDate[lang]||frontEnd.CreatedDate[defLang]||'Created Date'}</th>
                <th>{frontEnd.UpdateDate[lang]||frontEnd.UpdateDate[defLang]||'Update Date'}</th>
                
                <th>{frontEnd.ACTIONS[lang]||frontEnd.ACTIONS[defLang]||'ACTIONS'}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  
                  <td  >
                  {product.isAvailable? (
                        <Badge bg="success">{product.name.split('@@')[lang]||product.name.split('@@')[defLang]||product.name.split('@@')[0]}</Badge>
                      ) : (
                        <Badge bg="danger">{product.name.split('@@')[lang]||product.name.split('@@')[defLang]||product.name.split('@@')[0]}</Badge>
                      )}
                    </td>
                  <td>{castNumber( product.price,lang,product.priceUnit)}</td>
                  <td>{product.category.split('@@')[lang]||product.category.split('@@')[defLang]||product.category.split('@@')[0]}</td>
                  <td>{product.brand}</td>
                  <td>{product.userOwner?product.userOwner.name:'deleted User'}</td>
                  <td>{castNumber( product.createdAt.substring(0, 10),lang)}</td>
                  <td>{ product && product.userUpdated &&product.userUpdated.name && product.userUpdated.name+' : '+ castNumber( product.updatedAt.substring(0, 10),lang)}</td>
                  
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      {frontEnd.Edit[lang]||frontEnd.Edit[defLang]||
                      'Edit'}
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(product)}
                    >
                      {frontEnd.Delete[lang]||frontEnd.Delete[defLang]||'Delete'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
                >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

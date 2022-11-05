import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import translator from '../translator'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function UserListScreen() {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
  useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo,lang,defLang } = state;
const frontEnd=translator.Customer.frontEnd;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
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

  const deleteHandler = async (user) => {
    if (window.confirm(translator.admin.frontEnd.Areyousuretodelete[lang]||translator.admin.frontEnd.Areyousuretodelete[defLang]||'Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success(frontEnd.userdeletedsuccessfully[lang]||frontEnd.userdeletedsuccessfully[defLang]||'user deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
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
        <title>{frontEnd.Users[lang]||frontEnd.Users[defLang]||'Users'}</title>
      </Helmet>
      <h1>{frontEnd.Users[lang]||frontEnd.Users[defLang]||'Users'}</h1>
    
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
              <th>{frontEnd.Name[lang]||frontEnd.Name[defLang]||'NAME'}</th>
              <th>{frontEnd.Email[lang]||frontEnd.Email[defLang]||'EMAIL'}</th>
              <th>{frontEnd.ISADMIN[lang]||frontEnd.ISADMIN[defLang]||'IS ADMIN'}</th>
              <th>{frontEnd.ISSUPERADMIN[lang]||frontEnd.ISADMIN[defLang]||'IS ADMIN'}</th>
              <th>{frontEnd.ACTIONS[lang]||frontEnd.ACTIONS[defLang]||'ACTIONS'}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? frontEnd.YES[lang]||frontEnd.YES[defLang]||'YES' :frontEnd.No[lang]||frontEnd.No[defLang]|| 'NO'}</td>
                <td>{user.isSuperAdmin ? frontEnd.YES[lang]||frontEnd.YES[defLang]||'YES' :frontEnd.No[lang]||frontEnd.No[defLang]|| 'NO'}</td>
                
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/admin/user/${user._id}`)}
                  >
                    {frontEnd.Edit[lang]||frontEnd.Edit[defLang]||'Edit'}
                  </Button>
                  &nbsp;
                  {userInfo.isSuperAdmin &&(<Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(user)}
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
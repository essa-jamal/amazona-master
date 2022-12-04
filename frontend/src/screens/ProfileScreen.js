import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import translator from '../translator';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo,lang,defLang } = state;
  const frontEnd=translator.Customer.frontEnd;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sellerName, setSellerName] = useState(userInfo.sellerName ||'');
  const [sellerLogo, setSellerLogo] = useState(userInfo.sellerLogo ||'');
  const [sellerDescription, setSellerDescription] = useState(userInfo.sellerDescription ||'');
  
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  console.log('userInfo =>',userInfo)
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log('name,email,password,sellerName,sellerLogo,sellerDescription,',name,
      email,      password,sellerName,sellerLogo,sellerDescription)
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
          sellerName:sellerName,
          sellerLogo:sellerLogo,
          sellerDescription:sellerDescription,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      console.log("data=>",data)
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>{frontEnd.UserProfile[lang]||frontEnd.UserProfile[defLang]||'User Profile'}</title>
      </Helmet>
      <h1 className="my-3">{frontEnd.UserProfile[lang]||frontEnd.UserProfile[defLang]||'User Profile'}</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>{frontEnd.Name[lang]||frontEnd.Name[defLang]||'Name'}</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>{frontEnd.Email[lang]||frontEnd.Email[defLang]||'Email'}</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>{frontEnd.Password[lang]||frontEnd.Password[defLang]||'Password'}</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>{frontEnd.ConfirmPassword[lang]||frontEnd.ConfirmPassword[defLang]||'Confirm Password'}</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        
{userInfo.isSeller && (
  <>
<h1>Seller</h1>
<Form.Group className="mb-3" controlId="name">
<Form.Label>{frontEnd.Name[lang]||frontEnd.Name[defLang]||'Name'}</Form.Label>
<Form.Control
  value={sellerName}
  onChange={(e) => setSellerName(e.target.value)}
  
/>
</Form.Group>
<Form.Group className="mb-3" controlId="sellerlogo">
<Form.Label>{'Seller Logo'}</Form.Label>
<Form.Control
  value={sellerLogo}
  onChange={(e) => setSellerLogo(e.target.value)}
  
/>
</Form.Group>

<Form.Group className="mb-3" controlId="sellerlogo">
<Form.Label>{'Seller Description'}</Form.Label>
<Form.Control
  value={sellerDescription}
  onChange={(e) => setSellerDescription(e.target.value)}
  
/>
</Form.Group>
</>
)
        }
        <div className="mb-3">
          <Button type="submit">{frontEnd.Update[lang]||frontEnd[defLang]||'Update'}</Button>
        </div>
      </form>
    </div>
  );
}
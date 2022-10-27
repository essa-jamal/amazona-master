import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Axios from 'axios';
import translator from '../translator';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo,lang,defLang } = state;
  const frontEnd=translator.Customer.frontEnd;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <Container className="small-container">
      <Helmet>
        <title>{frontEnd.SignIn[lang]||frontEnd.SignIn[defLang]||'Sign In'}</title>
      </Helmet>
      <h1 className="my-3">{frontEnd.SignIn[lang]||frontEnd.SignIn[defLang]||'Sign In'}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>{frontEnd.Email[lang]||frontEnd.Email[defLang]||'Email'}</Form.Label>
          <Form.Control type="email" required  onChange={(e) => setEmail(e.target.value) }/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password" onChange={(e) => setPassword(e.target.value)}>
          <Form.Label>{frontEnd.Password[lang]||frontEnd.Password[defLang]|| 'Password'}</Form.Label>
          <Form.Control type="password" required />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">{frontEnd.SignIn[lang]||frontEnd.SignIn[defLang]||'Sign In'}</Button>
        </div>
        <div className="mb-3">
          {frontEnd.Newcustomer[lang]||frontEnd.Newcustomer[defLang]|| 'New customer'}?{' '}
          <Link to={`/signup?redirect=${redirect}`}>{frontEnd.Createyouraccount[lang]||frontEnd.Createyouraccount[defLang] ||'Create your account'}</Link>
        </div>
      </Form>
    </Container>
  );
}
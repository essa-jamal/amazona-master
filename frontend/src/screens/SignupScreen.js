import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import translator from '../translator';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo,lang,defLang } = state;
  const frontEnd=translator.Customer.frontEnd;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(frontEnd.Passwordsdonotmatch[lang]||frontEnd.Passwordsdonotmatch[defLang]|| 'Passwords do not match');
      return;
    }
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
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
        <title>{frontEnd.SignUp[lang]||frontEnd.SignUp[defLang]|| 'Sign Up'}</title>
      </Helmet>
      <h1 className="my-3">{frontEnd.SignUp[lang]||frontEnd.SignUp[defLang]|| 'Sign Up'}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>{frontEnd.Name[lang]||frontEnd.Name[defLang]||'Name'}</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>{frontEnd.Email[lang]||frontEnd.Email[defLang]||'Email'}</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>{frontEnd.Password[lang]||frontEnd.Password[defLang]|| 'Password'}</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>{frontEnd.ConfirmPassword[lang]||frontEnd.ConfirmPassword[defLang]||'Confirm Password'}</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">{frontEnd.SignUp[lang]||frontEnd.SignUp[defLang]|| 'Sign Up'}</Button>
        </div>
        <div className="mb-3">
          {frontEnd.Alreadyhaveanaccount[lang]||frontEnd.Alreadyhaveanaccount[defLang]||'Already have an account'}{' '}
          <Link to={`/signin?redirect=${redirect}`}>{frontEnd.SignIn[lang]||frontEnd.SignIn[defLang]||'Sign In'}</Link>
        </div>
      </Form>
    </Container>
  );
}
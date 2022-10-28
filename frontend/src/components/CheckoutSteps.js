import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import translator from '../translator';
import { Store } from '../Store';

export default function CheckoutSteps(props) {
  const { state } = useContext(Store);
  const {
    
    lang,defLang
  } = state;
  
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>{translator.home.frontEnd.SignIn[lang]||translator.home.frontEnd.SignIn[defLang]|| 'Sign-In'}</Col>
      <Col className={props.step2 ? 'active' : ''}>{translator.Shipping.frontEnd.Shipping[lang]||translator.Shipping.frontEnd.Shipping[defLang]||'Shipping'}</Col>
      <Col className={props.step3 ? 'active' : ''}>{translator.Shipping.frontEnd.Payment[lang]||translator.Shipping.frontEnd.Payment[defLang]||'Payment'}</Col>
      <Col className={props.step4 ? 'active' : ''}>{translator.Shipping.frontEnd.PlaceOrder[lang]||translator.Shipping.frontEnd.PlaceOrder[defLang]||'Place Order'}</Col>
    </Row>
  );
}
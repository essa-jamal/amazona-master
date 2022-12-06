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
  const [sellerNameK, setSellerNameK] = useState((userInfo.sellerName && userInfo.sellerName.split('&&')[0] ) ||'');
  const [sellerNameA, setSellerNameA] = useState((userInfo.sellerName && userInfo.sellerName.split('&&')[1] )||'');
  const [sellerNameE, setSellerNameE] = useState((userInfo.sellerName && userInfo.sellerName.split('&&')[2] )||'');
  const [sellerNameT, setSellerNameT] = useState((userInfo.sellerName && userInfo.sellerName.split('&&')[3] )||'');
  const [sellerNameP, setSellerNameP] = useState((userInfo.sellerName && userInfo.sellerName.split('&&')[4] )||'');
  const [sellerNameF, setSellerNameF] = useState((userInfo.sellerName && userInfo.sellerName.split('&&')[5] )||'');
  const [sellerNameG, setSellerNameG] = useState((userInfo.sellerName && userInfo.sellerName.split('&&')[6] )||'');
  const [sellerLogo, setSellerLogo] = useState(userInfo.sellerLogo ||'');
  const [sellerDescriptionK, setSellerDescriptionK] = useState((userInfo.sellerDescription && userInfo.sellerDescription.split('&&')[0]) ||'');
  const [sellerDescriptionA, setSellerDescriptionA] = useState((userInfo.sellerDescription && userInfo.sellerDescription.split('&&')[1]) ||'');
  const [sellerDescriptionE, setSellerDescriptionE] = useState((userInfo.sellerDescription && userInfo.sellerDescription.split('&&')[2]) ||'');
  const [sellerDescriptionT, setSellerDescriptionT] = useState((userInfo.sellerDescription && userInfo.sellerDescription.split('&&')[3]) ||'');
  const [sellerDescriptionP, setSellerDescriptionP] = useState((userInfo.sellerDescription && userInfo.sellerDescription.split('&&')[4]) ||'');
  const [sellerDescriptionF, setSellerDescriptionF] = useState((userInfo.sellerDescription && userInfo.sellerDescription.split('&&')[5]) ||'');
  const [sellerDescriptionG, setSellerDescriptionG] = useState((userInfo.sellerDescription && userInfo.sellerDescription.split('&&')[6]) ||'');
  
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
  
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
          sellerName:''+sellerNameK+'&&'+sellerNameA+'&&'+sellerNameE+'&&'+sellerNameT+'&&'+sellerNameP+'&&'+sellerNameF+'&&'+sellerNameG+'',
          sellerLogo:sellerLogo,
          sellerDescription:''+sellerDescriptionK+'&&'+sellerDescriptionA+'&&'+sellerDescriptionE+'&&'+sellerDescriptionT+'&&'+sellerDescriptionP+'&&'+sellerDescriptionF+'&&'+sellerDescriptionG+'',
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
<h1>{frontEnd.Seller[lang]||frontEnd.Seller[defLang]||'Seller'}</h1>
<Form.Group className="mb-3" controlId="name">
<Form.Label>{frontEnd.Name[lang]||frontEnd.Name[defLang]||'Name'}</Form.Label>
<Form.Control
  value={sellerNameK}
  onChange={(e) => setSellerNameK(e.target.value)}
  placeholder="ناوی فرۆشگا"
  
/>
<Form.Control
  value={sellerNameA}
  onChange={(e) => setSellerNameA(e.target.value)}
  placeholder="أدخل اسم المبيعات"
/>
<Form.Control
  value={sellerNameE}
  onChange={(e) => setSellerNameE(e.target.value)}
  placeholder="Enter Sales Name"
/>
<Form.Control
  value={sellerNameT}
  onChange={(e) => setSellerNameT(e.target.value)}
  placeholder="Satış Adını Girin"
/>
<Form.Control
  value={sellerNameP}
  onChange={(e) => setSellerNameP(e.target.value)}
  placeholder="نام فروش را وارد کنید"
/>
<Form.Control
  value={sellerNameF}
  onChange={(e) => setSellerNameF(e.target.value)}
  placeholder="Entrez le nom du client"
/>
<Form.Control
  value={sellerNameG}
  onChange={(e) => setSellerNameG(e.target.value)}
  placeholder="Geben Sie den Verkaufsnamen ein"
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
<Form.Label>{frontEnd.SellerDescription[lang]||'Seller Description'}</Form.Label>
<Form.Control
  value={sellerDescriptionK}
  onChange={(e) => setSellerDescriptionK(e.target.value)}
  placeholder="باسکردن بنوسە"
/>
<Form.Control
  value={sellerDescriptionA}
  onChange={(e) => setSellerDescriptionA(e.target.value)}
  placeholder="أدخل الوصف"
/>
<Form.Control
  value={sellerDescriptionE}
  onChange={(e) => setSellerDescriptionE(e.target.value)}
  placeholder="Enter Descripton"
/>
<Form.Control
  value={sellerDescriptionT}
  onChange={(e) => setSellerDescriptionT(e.target.value)}
  placeholder="Açıklama Girin"
/>
<Form.Control
  value={sellerDescriptionP}
  onChange={(e) => setSellerDescriptionP(e.target.value)}
  placeholder="توضیحات را وارد کنید"
/>
<Form.Control
  value={sellerDescriptionF}
  onChange={(e) => setSellerDescriptionF(e.target.value)}
  placeholder="Entrez la description"
/>
<Form.Control
  value={sellerDescriptionG}
  onChange={(e) => setSellerDescriptionG(e.target.value)}
  placeholder="Beschreibung eingeben"
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
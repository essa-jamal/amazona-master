import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { useContext, useEffect, useState } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavDropdown from "react-bootstrap/NavDropdown";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Button from "react-bootstrap/Button";
import { getError, toArabicNumber } from "./utils";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import Form from "react-bootstrap/Form";
import translator from "./translator";
import data from "./data";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, lang,defLang } = state;
  const languages = data.languages.filter(x=>x.available);
  
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    //localStorage.removeItem("cartItems");

    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const frontEnd = translator.home.frontEnd;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    //console.log('language =>',lang)
    fetchCategories();
  }, [lang]);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />

        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>

              <LinkContainer to="/">
                <Navbar.Brand>{frontEnd.BazarShow[lang] || frontEnd.BazarShow[defLang]}</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />

                <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/cart" className="nav-link">
                    {frontEnd.Cart[lang] || frontEnd.Cart[defLang]}
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {languages[lang].number === "English"
                          ? cart.cartItems.reduce((a, c) => a + c.quantity, 0)
                          : toArabicNumber(
                              cart.cartItems.reduce((a, c) => a + c.quantity, 0)
                            )}
                      </Badge>
                    )}
                  </Link>

                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>
                          {frontEnd.UserProfile[lang] || frontEnd.UserProfile[defLang]}
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>
                          {frontEnd.OrderHistory[lang] || frontEnd.OrderHistory[defLang]}
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        {frontEnd.SignOut[lang] || frontEnd.SignOut[defLang]}
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      {frontEnd.SignIn[lang] || frontEnd.SignIn[defLang]}
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown
                      title={frontEnd.Admin[lang] || frontEnd.Admin[defLang]}
                      id="admin-nav-dropdown"
                    >
                    {  userInfo.isSuperAdmin  &&  (<LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>
                          {frontEnd.Dashboard[lang]  || frontEnd.Dashboard[defLang]}
                        </NavDropdown.Item>
                      </LinkContainer>
                      )}
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>
                          {frontEnd.Products[lang]  || frontEnd.Products[defLang]}
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>
                          {frontEnd.Orders[lang]  || frontEnd.Orders[defLang]}
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>
                          {frontEnd.Users[lang]  || frontEnd.Users[defLang]}
                        </NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>

            <Form.Select
              value={lang}
              className="lang"
              onChange={(e) =>{
                ctxDispatch({ type: "ADD_LANG", payload: e.target.value })
                ctxDispatch({ type: "ADD_DEFAULT_LANG", payload: languages.find(x=> x.default).location })
                

              }}
            >
              {languages.map((langData) => (
                <option disabled={langData.disabled} key={langData.location} value={langData.location}>
                  {langData.name}
                </option>
              ))}
            </Form.Select>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? `active-nav side-navbar d-flex justify-content-between flex-wrap flex-column ${
                  " " + languages[lang].direction + " "
                }`
              : `side-navbar d-flex justify-content-between flex-wrap flex-column ${
                  " " + languages[lang].direction + " "
                }`
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>{frontEnd.Categories[lang]  || frontEnd.Categories[defLang]}</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category.split('@@')[lang]||category.split('@@')[defLang]||category.split('@@')[0]}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main className={" " + languages[lang].direction + " "}>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">{frontEnd.Allrightsreserved[lang]||frontEnd.Allrightsreserved[defLang]||'All rights reserved'}</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

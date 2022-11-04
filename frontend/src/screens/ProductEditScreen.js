import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import data from "../data";
import translator from "../translator";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo, lang, defLang } = state;
  const [isAvailable, setIsAvailable] = useState(false);
  console.log('userInfo =>',userInfo)

  const frontEnd = translator.admin.Products;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  const [name, setName] = useState("");
  const [nameE, setNameE] = useState("");
  const [nameK, setNameK] = useState("");
  const [nameA, setNameA] = useState("");
  const [nameT, setNameT] = useState("");
  const [nameP, setNameP] = useState("");
  const [nameF, setNameF] = useState("");
  const [nameG, setNameG] = useState("");

  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("");
  const priceUnits = data.priceUnits.filter((x) => x.available);

  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionK, setDescriptionK] = useState("");
  const [descriptionA, setDescriptionA] = useState("");
  const [descriptionE, setDescriptionE] = useState("");
  const [descriptionT, setDescriptionT] = useState("");
  const [descriptionP, setDescriptionP] = useState("");
  const [descriptionF, setDescriptionF] = useState("");
  const [descriptionG, setDescriptionG] = useState("");
const categories=data.categories.filter(x=>x.available)
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setNameK(data.name.split('@@')[0] || "");
        setNameA(data.name.split('@@')[1] || "");
        setNameE(data.name.split('@@')[2] || "");
        setNameT(data.name.split('@@')[3] || "");
        setNameP(data.name.split('@@')[4]||"");
        setNameF(data.name.split('@@')[5] || "");
        setNameG(data.name.split('@@')[6] || "");
        setSlug(data.slug);
        setIsAvailable(data.isAvailable)
        setPrice(data.price);
        setPriceUnit(data.priceUnit);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        setDescriptionK(data.description.split('@@')[0]||'');
        setDescriptionA(data.description.split('@@')[1]||'');
        setDescriptionE(data.description.split('@@')[2]||'');
        setDescriptionT(data.description.split('@@')[3]||'');
        setDescriptionP(data.description.split('@@')[4]||'');
        setDescriptionF(data.description.split('@@')[5]||'');
        setDescriptionG(data.description.split('@@')[6]||'');
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setName(nameK+'@@'+nameA+'@@'+nameE+'@@'+nameT+'@@'+nameP+'@@'+nameF+'@@'+nameG)
    setDescription(descriptionK+'@@'+descriptionA+'@@'+descriptionE+'@@'+descriptionT+'@@'+descriptionP+'@@'+descriptionF+'@@'+descriptionG)
    console.log('name =>',name)
    console.log('Set Names =>',nameK+'@@'+nameA+'@@'+nameE+'@@'+nameT+'@@'+nameP+'@@'+nameF+'@@'+nameG)
    try {
      dispatch({ type: "UPDATE_REQUEST" });
console.log('category =>',category)
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name:''+nameK+'@@'+nameA+'@@'+nameE+'@@'+nameT+'@@'+nameP+'@@'+nameF+'@@'+nameG+'',
          slug,
          isAvailable,
          price,
          priceUnit,
          image,
          images,
          category:category,
          brand,
          countInStock,
          description:descriptionK+'@@'+descriptionA+'@@'+descriptionE+'@@'+descriptionT+'@@'+descriptionP+'@@'+descriptionF+'@@'+descriptionG,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success(
        frontEnd.Productupdatedsuccessfully[lang] ||
          frontEnd.Productupdatedsuccessfully[defLang] ||
          "Product updated successfully"
      );
      navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success(
        frontEnd.ImageuploadedsuccessfullyclickUpdatetoapplyit[lang] ||
          frontEnd.ImageuploadedsuccessfullyclickUpdatetoapplyit[defLang] ||
          "Image uploaded successfully. click Update to apply it"
      );
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };
  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success(
      frontEnd.ImageremovedsuccessfullyclickUpdatetoapplyit[lang] ||
        frontEnd.ImageremovedsuccessfullyclickUpdatetoapplyit[defLang] ||
        "Image removed successfully. click Update to apply it"
    );
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>
          {frontEnd.EditProduct[lang] ||
            frontEnd.EditProduct[defLang] ||
            "Edit Product"}{" "}
          {productId}
        </title>
      </Helmet>
      <h1>
        {frontEnd.EditProduct[lang] ||
          frontEnd.EditProduct[defLang] ||
          "Edit Product"}{" "}
        {productId}
      </h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>
              {frontEnd.Name[lang] || frontEnd.Name[defLang] || "Name"}
            </Form.Label>
            {lang === "0" && (
              <Form.Control
                value={nameK}
                onChange={(e) => setNameK(e.target.value)}
                required
                placeholder="ناوی بەرهەم بنووسە"
              />
            )}
            {lang === "1" && (
              <Form.Control
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
                required
                placeholder="أدخل اسم المنتج"
              />
            )}
            {lang === "2" && (
              <Form.Control
                value={nameE}
                onChange={(e) => setNameE(e.target.value)}
                required
                placeholder="Enter Product Name"
              />
            )}
            {lang === "3" && (
              <Form.Control
                value={nameT}
                onChange={(e) => setNameT(e.target.value)}
                
                placeholder="Ürün Adı Girin"
              />
            )}
            {lang === "4" && (
              <Form.Control
                value={nameP}
                onChange={(e) => setNameP(e.target.value)}
                
                placeholder="نام محصول را وارد کنید"
              />
            )}

            {lang === "5" && (
              <Form.Control
                value={nameF}
                onChange={(e) => setNameF(e.target.value)}
                
                placeholder="Entrez le nom du produit"
              />
            )}
            {lang === "6" && (
              <Form.Control
                value={nameG}
                onChange={(e) => setNameG(e.target.value)}
                
                placeholder="Geben Sie den Produktnamen ein"
              />
            )}

            {lang !== "0" && (
              <Form.Control
                value={nameK}
                onChange={(e) => setNameK(e.target.value)}
                required
                placeholder="ناوی بەرهەم بنووسە"
              />
            )}
            {lang !== "1" && (
              <Form.Control
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
                required
                placeholder="أدخل اسم المنتج"
              />
            )}
            {lang !== "2" && (
              <Form.Control
                value={nameE}
                onChange={(e) => setNameE(e.target.value)}
                required
                placeholder="Enter Product Name"
              />
            )}
            {lang !== "3" && (
              <Form.Control
                value={nameT}
                onChange={(e) => setNameT(e.target.value)}
                
                placeholder="Ürün Adı Girin"
              />
            )}
            {lang !== "4" && (
              <Form.Control
                value={nameP}
                onChange={(e) => setNameP(e.target.value)}
                
                placeholder="نام محصول را وارد کنید"
              />
            )}

            {lang !== "5" && (
              <Form.Control
                value={nameF}
                onChange={(e) => setNameF(e.target.value)}
                
                placeholder="Entrez le nom du produit"
              />
            )}
            {lang !== "6" && (
              <Form.Control
                value={nameG}
                onChange={(e) => setNameG(e.target.value)}
                
                placeholder="Geben Sie den Produktnamen ein"
              />
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>
              {frontEnd.Slug[lang] || frontEnd.Slug[defLang] || "Slug"}
            </Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Label>
            {frontEnd.PriceUnit[lang] ||
              frontEnd.PriceUnit[defLang] ||
              "Price Unit"}
          </Form.Label>
          <Form.Group className="mb-3" controlId="name">
            <Form.Select
              value={priceUnit}
              onChange={(e) => {
                setPriceUnit(e.target.value);
              }}
            >
              {priceUnits.map((unit) => (
                <option
                  disabled={unit.disabled}
                  key={unit.sign}
                  value={unit.sign}
                >
                  {unit.sign +
                    " : " +
                    unit.name +
                    " " +
                    (unit.default ? "" : unit.unit + " to 1$")}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="name">
            <Form.Label>
              {frontEnd.Price[lang] || frontEnd.Price[defLang] || "Price"}
            </Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>
              {frontEnd.ImageFile[lang] ||
                frontEnd.ImageFile[defLang] ||
                "Image File"}
            </Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>
              {frontEnd.UploadImage[lang] ||
                frontEnd.UploadImage[defLang] ||
                "Upload Image"}
            </Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="additionalImage">
            <Form.Label>
              {frontEnd.AdditionalImages[lang] ||
                frontEnd.AdditionalImages[defLang] ||
                "Additional Images"}
            </Form.Label>
            {images.length === 0 && (
              <MessageBox>
                {frontEnd.Noimage[lang] ||
                  frontEnd.Noimage[defLang] ||
                  "No image"}
              </MessageBox>
            )}
            <ListGroup variant="flush">
              {images.map((x) => (
                <ListGroup.Item key={x}>
                  {x}
                  <Button variant="light" onClick={() => deleteFileHandler(x)}>
                    <i className="fa fa-times-circle"></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImageFile">
            <Form.Label>
              {frontEnd.UploadAditionalImage[lang] ||
                frontEnd.UploadAditionalImage[defLang] ||
                "Upload Aditional Image"}
            </Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => uploadFileHandler(e, true)}
            />
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>
              {frontEnd.Category[lang] ||
                frontEnd.Category[defLang] ||
                "Category"}
            </Form.Label>
            
            <Form.Group className="mb-3" controlId="name">
            <Form.Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              {categories.map((c) => (
                <option
                  disabled={c.disabled}
                  key={c.name}
                  value={c.value}
                >
                  {c.value.split('@@')[lang]||c.value[defLang].split('@@')||c.value[0]}
                  </option>
              ))}
            </Form.Select>
          </Form.Group>

          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>
              {frontEnd.BRAND[lang] || frontEnd.BRAND[defLang] || "Brand"}
            </Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>
              {frontEnd.CountInStock[lang] ||
                frontEnd.CountInStock[defLang] ||
                "Count In Stock"}
            </Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>
              {frontEnd.Description[lang] || frontEnd[defLang] || "Description"}
            </Form.Label>
            {lang==='0' && (<Form.Control
              value={descriptionK}
              onChange={(e) => setDescriptionK(e.target.value)}
              required
              placeholder="باسکردن بنوسە"
            />
            )}
            {lang==='1' && (<Form.Control
              value={descriptionA}
              onChange={(e) => setDescriptionA(e.target.value)}
              required
              placeholder="أدخل الوصف"
            />
            )}
            {lang==='2' && (<Form.Control
              value={descriptionE}
              onChange={(e) => setDescriptionE(e.target.value)}
              required
              placeholder="Enter Description"
            />
            )}
            {lang==='3' && (<Form.Control
              value={descriptionT}
              onChange={(e) => setDescriptionT(e.target.value)}
              
              placeholder="Açıklama Girin"
            />
            )}
            {lang==='4' && (<Form.Control
              value={descriptionP}
              onChange={(e) => setDescriptionP(e.target.value)}
              
              placeholder="توضیحات را وارد کنید"
            />
            )}
            {lang==='5' && (<Form.Control
              value={descriptionF}
              onChange={(e) => setDescriptionF(e.target.value)}
              
              placeholder="Entrez la description"
            />
            )}
            {lang==='6' && (<Form.Control
              value={descriptionG}
              onChange={(e) => setDescriptionG(e.target.value)}
              
              placeholder="Beschreibung eingeben"
            />
            )}
            
            {lang!=='0' && (<Form.Control
              value={descriptionK}
              onChange={(e) => setDescriptionK(e.target.value)}
              required
              placeholder="باسکردن بنوسە"
            />
            )}
            {lang!=='1' && (<Form.Control
              value={descriptionA}
              onChange={(e) => setDescriptionA(e.target.value)}
              required
              placeholder="أدخل الوصف"
            />
            )}
            {lang!=='2' && (<Form.Control
              value={descriptionE}
              onChange={(e) => setDescriptionE(e.target.value)}
              required
              placeholder="Enter Description"
            />
            )}
            {lang!=='3' && (<Form.Control
              value={descriptionT}
              onChange={(e) => setDescriptionT(e.target.value)}
              
              placeholder="Açıklama Girin"
            />
            )}
            {lang!=='4' && (<Form.Control
              value={descriptionP}
              onChange={(e) => setDescriptionP(e.target.value)}
              
              placeholder="توضیحات را وارد کنید"
            />
            )}
            {lang!=='5' && (<Form.Control
              value={descriptionF}
              onChange={(e) => setDescriptionF(e.target.value)}
              
              placeholder="Entrez la description"
            />
            )}
            {lang!=='6' && (<Form.Control
              value={descriptionG}
              onChange={(e) => setDescriptionG(e.target.value)}
              
              placeholder="Beschreibung eingeben"
            />
            )}
            
            
          </Form.Group>
          {userInfo.isSuperAdmin && (<Form.Check
            className="mb-3"
            type="checkbox"
            id="isAvailable"
            label="isAvailable"
            checked={isAvailable}
            
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
)}
          
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              {frontEnd.Update[lang] || frontEnd.Update[defLang] || "Update"}
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}{" "}
          </div>
        </Form>
      )}
    </Container>
  );
}

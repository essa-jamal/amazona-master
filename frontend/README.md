# MERN AMAZONA

Lessons:
Day-01:
1. Introduction
2. Install tools
3. Create React App
4. Create Git Repository
5. List Products
   1. create products array
   2. add product images
   3. render products
   4. style products
Day-02:
6. Add page routing
   1. npm i react-router-dom
   2. create route for home screen
   3. create router for product screen
7. Create Node.JS Server
   1. run npm init in root folder
   2. Update package.json set type: module
   3. Add .js to imports
   4. npm install express
   5. create server.js
   6. add start command as node backend/server.js
   7. require express
   8. create route for / return backend is ready.
   9. move products.js from frontend to backend
   10. create route for /api/products
   11. return products
   12. run npm start
8. Fetch Products From Backend
   1. set proxy in package.json
   2. npm install axios
   3. use state hook
   4. use effect hook
   5. use reducer hook
9. Manage State By Reducer Hook
   1. define reducer
   2. update fetch data
   3. get state from usReducer
Day-03:
10. Add bootstrap UI Framework
    1. npm install react-bootstrap bootstrap
    2. update App.js
11. Create Product and Rating Component
    1. create Rating component
    2. Create Product component
    3. Use Rating component in Product component
12. Create Product Details Screen
    1. fetch product from backend
    2. create 3 columns for image, info and action
13. Create Loading and Message Component
    1. create loading component
    2. use spinner component
    3. create message component
    4. create utils.js to define getError fuction
Day-04:
14. Create React Context For Add Item To Cart
    1. Create React Context
    2. define reducer
    3. create store provider
    4. implement add to cart button click handler
15. Complete Add To Cart
    1. check exist item in the cart
    2. check count in stock in backend
16. Create Cart Screen
    1. create 2 columns
    2. display items list
    3. create action column
Day-05:
17. Complete Cart Screen
    1. click handler for inc/dec item
    2. click handler for remove item
    3. click handler for checkout
18. Create Signin Screen
    1. create sign in form
    2. add email and password
    3. add signin button
Day-06:
19. Connect To MongoDB Database
    1. create atlas monogodb database
    2. install local mongodb database
    3. npm install mongoose
    4. connect to mongodb database
20. Seed Sample Products
    1. create Product model
    2. create seed route
    3. use route in server.js
    4. seed sample product
21. Seed Sample Users
    1. create user model
    2. seed sample users  
Day-07:
22. Create Signin Backend API
    1. create signin api
    2. npm install jsonwebtoken
    3. define generateToken
Day-08:
23. Complete Signin Screen
    1. handle submit action
    2. save token in store and local storage
    3. show user name in header
24. Create Shipping Screen
    1. create form inputs
    2. handle save shipping address
    3. add checkout wizard bar
Day-09:
25. Create Sign Up Screen
    1. create input forms
    2. handle submit
    3. create backend api
26. Implement Select Payment Method Screen
    1. create input forms
    2. handle submit
27. Create Place Order Screen
    1. show cart items, payment and address
    2. calculate order summary
Day-10:
28. Implement Place Order Action
    1. handle place order action
    2. create order create api
Day-11:
29. Create Order Screen
    1. create backend api for order/:id
    2. fetch order api in frontend
    3. show order information in 2 cloumns
Day-12
31. Display Order History
    1. create order screen
    2. create order history api
    3. use api in the frontend
32. Create Profile Screen
    1. get user info from context
    2. show user information
    3. create user update api
    4. update user info
Day-13
33. Publish To Heroku
    1. create and config node project
    2. serve build folder in frontend folder
    3. Create heroku account
    4. connect it to github
    5. Create mongodb atlas database
    6. Set database connection in heroku env variables
    7. Commit and push
34. Add Sidebar and Search Box
    1. add sidebar
    2. add search box
35. Create Search Screen
    1. show filters
    2. create api for searching products
    3. display results
Day-14
36. Create Admin Menu
    1. define protected route component
    2. define admin route component
    3. add menu for admin in header
Day-15
37. Create Dashboard Screen
    1. create dashboard ui
    2. implement backend api
    3. connect ui to backend
Day-16
38. Manage Products
    1. create products list ui
    2. implement backend api
    3. fetch data    
Day-17
39. Create Product
    1. create products button
    2. implement backend api
    3. handle on click
Day-18
40. Create Edit Product
    1. create edit button
    2. create edit product ui
    3. dispaly product info in the input boxes
41. Implement Update Product
    1. create edit product backend api
    2. handle update click
Day-19
42. Upload Product Image
    1. create cloudinary account
    2. use the api key in env file
    3. handle upload file
    4. implement backend api to upload
43. Delete Product
    1. show delete button
    2. implement backend api
    3. handle on click
44. List Orders
    1. create order list screen
    2. implement backen api
    3. fetch and display orders
45. Deliver Order
    1. add deliver button
    2. handle click action
    3. implement backen api for deliver
Day-20
46. Delete Order
    1. add delete button
    2. handle click action
    3. implement backen api for delete
47. List Users
    1. create user list screen
    2. implement backen api
    3. fetch and display users
Day-21
48. Edit User
    1. create edit button
    2. create edit product ui
    3. dispaly product info in the input boxes
    4. implement backend api
    5. handle edit click
49. Delete User
    1. add delete button
    2. handle click action
    3. implement backen api for delete
Day-22
52. Review Products
    1. create submit review form
    2. handle submit
    3. implement backend api for review
Day-23
53. Upload multiple Images
    1. add images to product model
    2. get images in edit screen
    3. show images in product screen
Day-24
54. Support Multiple Language
    1. create languages Array contains Language Object
    2. create Translator Object contains pages Object home, search, cart, customer, Admin pages
    3. add frontend and backend, and err 
    4. apply rtl direction 
    5. store Language to context store 
    6. translate frontend data to Home including app and home and category
    7. add translation to Cart Screen
49. Implement Seller View
    1. add seller menu
    2. create seller route
    3. list products for seller
    4. list orders for seller
    5. add Seller to Product List and Details Screen
50. Create Seller Page
    1. create seller page
    2. update product component and product screen
    3. update product routes    
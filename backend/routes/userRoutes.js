import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth, isAdmin, generateToken, isAdminOrSeller } from '../utils.js';

const userRouter = express.Router();

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
      }
      console.log('updatedUser =>',updatedUser)
if(updatedUser.isSeller){
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isSeller:updatedUser.isSeller,
        isAdmin: updatedUser.isAdmin,
        isSuperAdmin: updatedUser.isAdmin,
        sellerName:updatedUser.seller.name,
        sellerLogo:updatedUser.seller.logo,
        sellerDescription:updatedUser.seller.description,
        token: generateToken(updatedUser),
      });}
      else{
        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isSeller:updatedUser.isSeller,
          isAdmin: updatedUser.isAdmin,
          isSuperAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser),
        });
      }
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const userOwner=req.user.isSuperAdmin?{}:{_id:req.user._id}
    const users = await User.find(userOwner);
    res.send(users);
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdminOrSeller,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin =user.email === 'admin@example.com'?true: Boolean(req.body.isAdmin);
      user.isSeller = Boolean( req.body.isSeller)
      user.isSuperAdmin = Boolean( req.body.isSuperAdmin)
      
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        if(user.isSeller){
          res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isSeller:user.isSeller,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
          
          token: generateToken(user),
        });
      
      }
      else{
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isSeller:user.isSeller,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
          sellerName:user.name,
          sellerLogo:user.seller.logo,
          sellerDescription:user.seller.description,  
          token: generateToken(user),
        });
      }
        
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isSeller:user.isSeller,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      token: generateToken(user),
    });
  })
);

export default userRouter;
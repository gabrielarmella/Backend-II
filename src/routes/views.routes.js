import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { productService, cartService } from "../services/index.service.js";
import { CONFIG } from "../config/config.js";

const router = Router();


function isAuthenticated(req, res, next) {
  if (req.signedCookies.currentUser) {
    return next();
  }
  res.redirect("/login");
}

function isNotAuthenticated(req, res, next) {
  if (!req.signedCookies.currentUser) {
    return next();
  }
  res.redirect("/register");
}

router.get("/", (req, res) => {
  const isSession = req.session && req.session.user ? true : false;
  res.render("index", {
    title: "Inicio",
    isSession,
    user: req.session ? req.session.user : null
  });
});

router.get("/login", isNotAuthenticated, (req, res) => {
  const isSession = req.session && req.session.user ? true : false;

  if (isSession) {
    return res.redirect("/");
  }

  res.render("login", { title: "Login" });
});

router.get("/register", isNotAuthenticated, (req, res) => {
  const isSession = req.session && req.session.user ? true : false;

  if (isSession) {
    return res.redirect("/");
  }

  res.render("register", { title: "Register" });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.render('profile', { title: 'Profile', user: req.user });
});

router.get('/products', async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);
    res.render(
      'products',
      {
        title: 'Productos',
        products: products.docs,
      });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productService.getAllProducts(req.query);
  res.render(
    'realTimeProducts',
    {
      title: 'Productos',
      style: 'index.css',
      products: JSON.parse(JSON.stringify(products.docs))
    }
  )
});

router.get('/cart/:cid', async (req, res) => {
  const response = await cartService.getProductsFromCartByID(req.params.cid);

  if (response.status === 'error') {
    return res.render(
      'notFound',
      {
        title: 'Not Found',
        style: 'main.css'
      }
    );
  }

  res.render(
    'cart',
    {
      title: 'Carrito',
      style: 'main.css',
      products: JSON.parse(JSON.stringify(response.products))
    }
  )
});

router.get("/create-product", (req, res) => {
  res.render("createProduct", { title: "Crear Producto" });
});

router.get("/current", isAuthenticated, async (req, res) => {
  try {
    const token = req.signedCookies.currentUser;
    const decoded = jwt.verify(token, CONFIG.JWT.SECRET);
    const userDTO = await userService.getById(decoded.id);
    res.render("current", { user: userDTO });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

export { router as viewsRouter };
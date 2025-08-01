import Home from "./home/Home";
// import CreateShop from "./components/CreateShop";
import VerifyEmail from "./reset-password/verifyEmail";
import Order from "./order/Order";
import Text from "./components/text";
import ShopsHomeSkeleton from "./skeleton/ShopsHomeSkeleton";
import Settings from "./account/Settings";
import AboutShop from "./shop-settings/AboutShop";
import SkeletonShop from "./skeleton/SkeletonShop";
import AuthVendorLogin from "./authentication/authVendorLogin";
import Auth from "./authentication/auth";
import AuthVendor from "./authentication/authVendor";
import AuthCustomer from "./authentication/authCustomer";
import ForgetPassword from "./reset-password/ForgetPassword";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Shop from "./shop/Shop";
import Profile from "./account/Profile";
import CreateShop from "./create-shop/CreateShop";
import AddArticle from "./shop-profile/articles/AddArticle";
import ChangePassword from "./shop-settings/ChangePassword";
import UpdateArticle from "./shop-profile/articles/UpdateArticle";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <GoogleOAuthProvider
        clientId={
          /*clientId*/ "739869680076-jlv9amicing7jf86gasmar79v2hel8vb.apps.googleusercontent.com"
        }
      >
        <AuthProvider>
          <ToastContainer />
          <SkeletonTheme baseColor="#F8F8F8" highlightColor="#FFA500">
            <Routes>
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/" element={<Home />} />
              <Route path="/createshop" element={<CreateShop />} />
              <Route path="/insideshop/:shopId" element={<Shop />} />
              <Route path="/insideshop/:id/order" element={<Order />} />
              <Route path="/account" element={<Profile />} />
              <Route path="/account/settings" element={<Settings />} />
              <Route path="/account/settings/change-password" element={<ChangePassword />} />
              <Route path="/account/add-article" element={<AddArticle />} />
              <Route path="/account/update-article/:articleId" element={<UpdateArticle />} />
              <Route path="/ratingtest" element={<VerifyEmail />} />
              <Route path="/test" element={<Text />} />
              <Route path="/skeleton" element={<SkeletonShop />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/vendor" element={<AuthVendor />} />
              <Route path="/auth/customer" element={<AuthCustomer />} />
              <Route
                path="/auth/vendor/register"
                element={<CreateShop />}
              />
              <Route path="/auth/vendor/login" element={<AuthVendorLogin />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
            </Routes>
          </SkeletonTheme>
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;

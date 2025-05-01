import Home from "./home/Home";
import Login from "./components/Login";
import InsideShop from "./shop/InsideShop";
import CreateShop from "./components/CreateShop";
import Account from "./pages/account";
import UpdateAccount from "./pages/updateAccount";
import UpdateName from "./account/updateName";
import VerifyEmail from "./pages/verifyEmail";
import Order from "./shop/Order";
import Text from "./components/text";
import SkeletonShops from "./components/SkeletonShops";
import AuthVendorRegister from "./pages/authVendorRegister";
import ShopsType from "./home/ShopsType";
import AuthVendorLogin from "./pages/authVendorLogin";
import Auth from "./pages/auth";
import AuthVendor from "./pages/authVendor";
import AuthCustomer from "./pages/authCustomer";
import ResetPassword from "./pages/resetPassword";
import Test from "./components/test";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'


function App() {
  return (
    <>
      <GoogleOAuthProvider
        clientId={
          /*clientId*/ "739869680076-jlv9amicing7jf86gasmar79v2hel8vb.apps.googleusercontent.com"
        }
      >
        <AuthProvider>
          
            <SkeletonTheme baseColor="#F8F8F8" highlightColor="#FFA500">
              <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/createshop" element={<CreateShop />} />
                <Route path="/insideshop/:id" element={<InsideShop />} />
                <Route path="/insideshop/:id/order" element={<Order />} />
                <Route path="/account" element={<Account />} />
                <Route path="/update-account" element={<UpdateAccount />} />
                <Route path="/update-account/:type" element={<UpdateName />} />
                <Route path="/ratingtest" element={<VerifyEmail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/:type?" element={<ShopsType />} />
                <Route path="/test" element={<Text />} />
                <Route path="/skeleton" element={<SkeletonShops />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/vendor" element={<AuthVendor />} />
                <Route path="/auth/customer" element={<AuthCustomer />} />
                <Route path="/auth/vendor/register" element={<AuthVendorRegister />} />
                <Route path="/auth/vendor/login" element={<AuthVendorLogin />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/testtest" element={<Test/>} />
              </Routes>
            </SkeletonTheme>
        
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;

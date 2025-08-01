import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import AboutUser from "../user-settings/AboutUser";
import AboutShop from "../shop-settings/AboutShop";
const Settings = () => {
  const { user } = useContext(AuthContext);
  if (user?.role == "user") {
    return <AboutUser userId={user?._id} />;
  } else if (user?.role == "shop") {
    return <AboutShop shopId={user?._id} />;
  }
};

export default Settings;

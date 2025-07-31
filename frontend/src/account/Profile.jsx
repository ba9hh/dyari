import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import UserProfile from "../user-profile/UserProfile";
import ShopProfile from "../shop-profile/ShopProfile";
const Profile = () => {
  const { user } = useContext(AuthContext);
  if (user?.role == "user") {
    return <UserProfile userId={user?._id}/>;
  } else if (user?.role == "shop") {
    return <ShopProfile shopId={user?._id}/>;
  }
};

export default Profile;

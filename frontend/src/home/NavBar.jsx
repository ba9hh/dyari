import { useContext } from "react";
import dyari from "../assets/dyari.svg";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { useTranslation } from "react-i18next";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SearchIcon from "@mui/icons-material/Search";

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  return (
    <div className="h-fit sm:h-12 flex justify-between items-end w-full sm:pl-8 px-2 sm:pr-4 sm:pb-0 py-3">
      <div className="flex items-center gap-1">
        <img className="w-7" src={dyari} />
        <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
      </div>
      <div>
        {user ? (
          <Link to={"/account"}>
            <img
              src={user ? user.profilePicture : ""}
              className="rounded-full w-10 h-10 object-cover"
            />
          </Link>
        ) : (
          <div>
            <Link
              className="px-2 pb-1 rounded-lg border-2 text-amber-700 border-amber-500 shadow-lg hidden sm:block"
              to={"/auth"}
            >
              {/* {t("navbar.login")} */}
              se connecter
            </Link>
            <div className="flex gap-2">
              {/* <Link
                to={"/auth"}
                className=" rounded-full p-1 text-amber-700 border-amber-700 border w-7 h-7 flex justify-center items-center sm:hidden"
              >
                <SearchIcon style={{ fontSize: "1.1rem" }} />
              </Link> */}
              <Link
                to={"/auth"}
                className=" rounded-full p-1 text-gray-600 bg-amber-100 block sm:hidden"
              >
                <SearchIcon style={{ fontSize: "1.3rem" }} />
              </Link>
              <Link
                to={"/auth"}
                className=" rounded-full p-1 text-gray-600 bg-amber-100 block sm:hidden"
              >
                <PermIdentityIcon style={{ fontSize: "1.6rem" }} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;

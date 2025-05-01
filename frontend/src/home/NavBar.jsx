import React, { useState, useContext } from "react";
import dyari from "../assets/dyari.svg";
import { Link ,useParams} from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const NavBar = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  const { type } = useParams();
  const [navbarElement, setNavbarElement] = useState(type || "");
  const categories = [
    { name: "Les salés", link: "sales" },
    { name: "Les sucres", link: "sucres" },
    { name: "Un mélange", link: "" }, // If applicable
    { name: "Les gateaux", link: "gateaux" },
    { name: "Les biscuits", link: "biscuit" },
  ];

  return (
    <div>
      <div className="h-12 flex justify-between items-end pl-8 pr-4">
        <div className="flex items-center gap-1">
          <img className="w-7" src={dyari} />
          <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
        </div>
        <div>
          {user ? (
            <Link to={"/account"}>
              <img
                src={user ? user.profilePicture : ""}
                className="rounded-full w-10 h-10"
              />
            </Link>
          ) : (
            <Link
              className="px-2 pb-1 rounded-lg border-2 text-amber-700 border-amber-500 shadow-lg"
              to={"/auth"}
            >
              se connecter
            </Link>
          )}
        </div>
      </div>
      <div className=" flex w-full justify-center items-center gap-x-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <div className="bg-white rounded-full px-6 py-2 shadow-md">
          {categories.map((category) => (
            <Link
              key={category.link}
              to={`/${category.link}`}
              className={`px-3 py-2 ${
                navbarElement == category.link
                  ? "border-b-[4px] border-amber-400"
                  : ""
              }`}
              onClick={() => setNavbarElement(category.link)}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
    </div>
  );
};

export default NavBar;

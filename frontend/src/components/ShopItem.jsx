import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import biscuit50 from "../assets/biscuit50.jpg";

const ShopItem = ({ shop }) => {
  return (
    <Link
      to={`/insideshop/${shop._id}`}
      className="bg-white shadow-md py-3 px-5 rounded-md"
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <img
            className="w-10 h-10 rounded-full border"
            src={shop.profilePicture}
            alt="Shop Profile"
          />
          <div>
            <h1 className="my-0">
              {shop.name} {shop.lastName} ({shop.localisation})
            </h1>
            {shop.speciality?.length == 1 && (
              <span className="crimsonText my-0">
                Specialité : {shop.speciality?.[0]}
              </span>
            )}
            {shop.speciality?.length == 2 && (
              <span className="crimsonText my-0">
                Specialité : {shop.speciality?.[0]} et {shop.speciality?.[1]}
              </span>
            )}
            {shop.speciality?.length == 3 && (
              <span className="crimsonText my-0">
                Specialité : {shop.speciality?.[0]} , {shop.speciality?.[1]} et{" "}
                {shop.speciality?.[2]}
              </span>
            )}
            {shop.speciality?.length == 4 && (
              <span className="crimsonText my-0">
                Specialité : {shop.speciality?.[0]} , {shop.speciality?.[1]} ,{" "}
                {shop.speciality?.[2]} et {shop.speciality?.[3]}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <h1>{shop.averageRating}</h1>
          <ReactStars
            count={5}
            size={20}
            value={shop.averageRating || 0}
            isHalf={true}
            edit={false}
            activeColor="#FBBC04"
          />
          <h1>({shop.totalRating})</h1>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-1 border">
        <img
          className="w-full h-56 border object-cover"
          src={shop.articles[0]?.image || biscuit50}
        />
        <img
          className="w-full h-56 border object-cover"
          src={shop.articles[1]?.image || biscuit50}
        />
        <img
          className="w-full h-56 border object-cover"
          src={shop.articles[2]?.image || biscuit50}
        />
        <img
          className="w-full h-56 border object-cover"
          src={shop.articles[3]?.image || biscuit50}
        />
        <img
          className="w-full h-56 border object-cover"
          src={shop.articles[4]?.image || biscuit50}
        />
        <img
          className="w-full h-56 border object-cover"
          src={shop.articles[5]?.image || biscuit50}
        />
      </div>
    </Link>
  );
};

export default ShopItem;

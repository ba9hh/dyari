import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
const RatedShopsShop = ({ shop, userId }) => {
  return (
    <div className="flex justify-between items-center border sm:p-2 p-1 rounded">
      <Link className="flex flex-1 gap-2" to={`/insideshop/${shop.shopId?._id}`}>
        <img
          className="w-10 h-10 rounded-full border"
          src={shop.shopId?.profilePicture}
          alt="Shop Profile"
        />
        <div>
          <h1 className="my-0">
            <span className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200">{shop.shopId?.name} {shop.shopId?.lastName}</span> ({shop.shopId?.localisation})
          </h1>
          {shop.shopId?.speciality?.length == 1 && (
            <span className="crimsonText my-0">
              Specialité : {shop.shopId?.speciality?.[0]}
            </span>
          )}
          {shop.shopId?.speciality?.length == 2 && (
            <span className="crimsonText my-0">
              Specialité : {shop.shopId?.speciality?.[0]} et{" "}
              {shop.shopId?.speciality?.[1]}
            </span>
          )}
          {shop.shopId?.speciality?.length == 3 && (
            <span className="crimsonText my-0">
              Specialité : {shop.shopId?.speciality?.[0]} ,{" "}
              {shop.shopId?.speciality?.[1]} et {shop.shopId?.speciality?.[2]}
            </span>
          )}
          {shop.shopId?.speciality?.length == 4 && (
            <span className="crimsonText my-0">
              Specialité : {shop.shopId?.speciality?.[0]} ,{" "}
              {shop.shopId?.speciality?.[1]} , {shop.shopId?.speciality?.[2]} et{" "}
              {shop.shopId?.speciality?.[3]}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-col items-end w-fit">
        <div className="flex items-center">
          <h1 className="text-sm mr-1">global Rate : </h1>
          <h1>{shop.shopId?.averageRating}</h1>
          <ReactStars
            count={5}
            size={20}
            value={shop.shopId?.averageRating || 0}
            isHalf={true}
            edit={false}
            activeColor="#FBBC04"
          />
          <h1>({shop.shopId?.totalRating})</h1>
        </div>
        <div className="flex items-center">
          <h1 className="text-sm mr-1">your rating : </h1>
          <h1>{shop.rating}</h1>
          <ReactStars
            count={5}
            size={20}
            value={shop.rating || 0}
            isHalf={true}
            edit={false}
            activeColor="#FBBC04"
          />
          
        </div>
      </div>
    </div>
  );
};

export default RatedShopsShop;

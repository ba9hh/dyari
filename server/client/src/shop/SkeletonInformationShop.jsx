import Skeleton from "react-loading-skeleton"
const SkeletonInformationShop = () => {
  return (
    <div className="relative w-2/3 bg-white shadow-md rounded-md">
              <div className="absolute top-4 right-2 px-3 pb-2 pt-1 rounded-md">
                <Skeleton width={180} height={30} />{" "}
              </div>
              <div className="absolute top-4 left-2 px-3 pb-2 pt-1 rounded-md">
                <Skeleton width={100} height={15} />{" "}
              </div>
              <div className="h-48 bg-gradient-to-t from-gray-300 to-transparent flex justify-center items-center">
                {/* <button className="bg-white px-3 pb-2 pt-1 shadow-md rounded-md">Ajouter un photo de couverture</button> */}
              </div>
              <div className="flex justify-center -mt-6">
                <div className="flex flex-col items-center gap-1 mb-4">
                  <Skeleton width={80} height={80} circle />
                  <Skeleton width={100} height={20} />
                  <Skeleton width={200} height={20} />
                  <button className=" rounded-md  mt-2">
                    <Skeleton width={80} height={40} />
                  </button>
                </div>
              </div>
            </div>
  )
}

export default SkeletonInformationShop
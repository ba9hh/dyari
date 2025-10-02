import { useState, useEffect } from "react";
import axios from "axios";
import ShopsHomeSkeleton from "../skeleton/ShopsHomeSkeleton";
import ShopHome from "./ShopHome";
import { useSearchParams, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import LocalisationFilter from "../components/LocalisationFilter";
import CategoriesTabs from "../components/CategoriesTabs";
import EmptyShopState from "../components/EmptyShopsState";
const ShopsHome = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [shops, setShops] = useState([]);
  const [localisation, setLocalisation] = useState("Toute la Tunisie");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [navbarElement, setNavbarElement] = useState(type || "");
  useEffect(() => {
    const query = {};

    if (type) query.type = type;
    if (localisation !== "Toute la Tunisie") query.localisation = localisation;
    if (page !== 1) query.page = page;

    Object.keys(query).length > 0 ? setSearchParams(query) : navigate("/");
  }, [type, localisation, page]);
  useEffect(() => {
    const controller = new AbortController();
    const fetchShops = async () => {
      const type = searchParams.get("type") || "";
      const localisation = searchParams.get("localisation") || "";
      const page = searchParams.get("page") || 1;
      setLoading(true);
      try {
        const response = await axios.get(
          "https://dyari.onrender.com/api/shops",
          {
            params: {
              type,
              localisation:
                localisation === "Toute la Tunisie" ? "" : localisation,
              page,
              limit,
            },
          }
        );
        setShops(response.data.shopsWithArticles);
        const totalPages = response.data.totalPages || 0;
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
    return () => controller.abort();
  }, [searchParams]);
  if (loading)
    return (
      <div>
        <CategoriesTabs
          type={type}
          navbarElement={navbarElement}
          setType={setType}
          setNavbarElement={setNavbarElement}
          setLocalisation={setLocalisation}
        />
        <ShopsHomeSkeleton />
      </div>
    );
  return (
    <>
      <CategoriesTabs
        type={type}
        navbarElement={navbarElement}
        setType={setType}
        setNavbarElement={setNavbarElement}
        setLocalisation={setLocalisation}
      />
      <LocalisationFilter
        localisation={localisation}
        setLocalisation={setLocalisation}
      />
      <div>
        {shops.length > 0 ? (
          <div className="lg:grid-cols-2 md:grid-cols-2 grid grid-cols-1 gap-x-16 sm:gap-y-20 sm:mx-20 sm:mt-4">
            {shops.map((shop) => (
              <ShopHome key={shop._id} shop={shop} />
            ))}
          </div>
        ) : (
          <EmptyShopState />
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrev={() => page > 1 && setPage(page - 1)}
        onNext={() => page < totalPages && setPage(page + 1)}
      />
    </>
  );
};

export default ShopsHome;

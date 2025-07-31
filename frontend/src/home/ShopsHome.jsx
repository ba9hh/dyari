import { useState, useEffect } from "react";
import axios from "axios";
import ShopsHomeSkeleton from "../skeleton/ShopsHomeSkeleton";
import ShopHome from "./ShopHome";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tab, Tabs, Select, MenuItem, FormControl } from "@mui/material";
import cities from "../data/cities";
import Pagination from "../components/Pagination";
import thinking from "../assets/thinking.png";
const ShopsHome = () => {
  const handleChange = (event) => {
    setLocalisation(event.target.value);
  };
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { t } = useTranslation();
  const [shops, setShops] = useState([]);
  const [localisation, setLocalisation] = useState("Toute la Tunisie");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [navbarElement, setNavbarElement] = useState(type || "");
  const categories = [
    { name: "Les salés 🍕", link: "sales" },
    { name: "Les sucrés 🍩", link: "sucres" },
    { name: "Un mélange 🍱", link: "" },
    { name: "Les gâteaux 🎂", link: "gateaux" },
    { name: "Les biscuits 🍪", link: "biscuit" },
  ];
  useEffect(() => {
    const query = {};

    if (type) query.type = type;
    if (localisation !== "Toute la Tunisie") query.localisation = localisation;
    if (page !== 1) query.page = page;

    const hasFilters = Object.keys(query).length > 0;

    if (hasFilters) {
      setSearchParams(query);
    } else {
      navigate("/"); // Clean URL if no filters
    }
  }, [type, localisation, page]);
  useEffect(() => {
    const controller = new AbortController();
    const fetchShops = async () => {
      const type = searchParams.get("type") || "";
      const localisation = searchParams.get("localisation") || "";
      const page = searchParams.get("page") || 1;
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/shops", {
          params: {
            type,
            localisation:
              localisation === "Toute la Tunisie" ? "" : localisation,
            page,
            limit,
          },
        });
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
  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const handleChange1 = (event, newValue) => {
    setType(newValue);
  };
  if (loading)
    return (
      <div>
        <div className=" sm:flex w-full justify-center items-center gap-x-4 hidden">
          <div className="flex-grow border-t border-gray-300"></div>
          <div className="flex bg-white rounded-full px-6 shadow-md">
            {categories.map((category) => (
              <div
                key={category.link}
                className={`px-3 py-2 cursor-pointer ${
                  navbarElement == category.link
                    ? "border-b-[4px] border-amber-400"
                    : ""
                }`}
                onClick={() => {
                  setNavbarElement(category.link);
                  setType(category.link);
                  setLocalisation("Toute la Tunisie");
                }}
              >
                {category.name}
              </div>
            ))}
          </div>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="block sm:hidden">
          <Tabs
            value={type}
            onChange={handleChange1}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab
              value=""
              label="Un mélange 🍱"
              sx={{ textTransform: "none" }}
            />
            <Tab
              value="sales"
              label="Les salés 🍕"
              sx={{ textTransform: "none" }}
            />
            <Tab
              value="sucres"
              label="Les sucrés 🍩"
              sx={{ textTransform: "none" }}
            />
            <Tab
              value="gateaux"
              label="Les gâteaux 🎂"
              sx={{ textTransform: "none" }}
            />
            <Tab
              value="biscuit"
              label="Les biscuits 🍪"
              sx={{ textTransform: "none" }}
            />
          </Tabs>
        </div>
        <ShopsHomeSkeleton />
      </div>
    );
  return (
    <>
      <div className="sm:flex w-full justify-center items-center gap-x-4 hidden">
        <div className="flex-grow border-t border-gray-300"></div>
        <div className="flex bg-white rounded-full px-6 shadow-md ">
          {categories.map((category) => (
            <div
              key={category.link}
              className={`px-3 py-2 cursor-pointer ${
                navbarElement == category.link
                  ? "border-b-[4px] border-amber-400"
                  : ""
              }`}
              onClick={() => {
                setNavbarElement(category.link);
                setType(category.link);
                setLocalisation("Toute la Tunisie");
              }}
            >
              {category.name}
            </div>
          ))}
        </div>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div className="block sm:hidden">
        <Tabs
          value={type}
          onChange={handleChange1}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab value="" label="Un mélange 🍱" sx={{ textTransform: "none" }} />
          <Tab
            value="sales"
            label="Les salés 🍕"
            sx={{ textTransform: "none" }}
          />
          <Tab
            value="sucres"
            label="Les sucrés 🍩"
            sx={{ textTransform: "none" }}
          />
          <Tab
            value="gateaux"
            label="Les gâteaux 🎂"
            sx={{ textTransform: "none" }}
          />
          <Tab
            value="biscuit"
            label="Les biscuits 🍪"
            sx={{ textTransform: "none" }}
          />
        </Tabs>
      </div>
      <div className="block sm:hidden">
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={localisation}
            onChange={handleChange}
            sx={{
              "& .MuiSelect-select": {
                textAlign: "center",
              },
            }}
          >
            {cities.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="sm:flex justify-end py-3 px-8 hidden">
        <select
          name="localisation"
          value={localisation}
          onChange={(e) => setLocalisation(e.target.value)}
          className="h-[36px] text-[#1c1e21] rounded-[4px] px-[8px] pr-[20px] border border-gray-400 w-40"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div>
        {shops.length > 0 ? (
          <div className="lg:grid-cols-2 md:grid-cols-2 grid grid-cols-1 gap-x-16 sm:gap-y-20 sm:mx-20 sm:mt-4">
            {shops.map((shop) => (
              <ShopHome key={shop._id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3">
            <img src={thinking} className="h-16 w-16 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Aucune shop</h2>
            <p className="text-center max-w-sm">
              Il n'y a pas encore de boutiques avec ces caracteristiques.
              Explorez d'autres boutiques !
            </p>
          </div>
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrev={handlePrevious}
        onNext={handleNext}
      />
    </>
  );
};

export default ShopsHome;

import { Tab, Tabs } from "@mui/material";
import categories from "../data/categories";

const CategoriesTabs = ({
  type,
  navbarElement,
  setType,
  setNavbarElement,
  setLocalisation,
}) => {
  const handleTypeChange = (event, newValue) => {
    setType(newValue);
  };

  return (
    <>
      {/* Desktop */}
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
      {/* Mobile */}
      <div className="block sm:hidden">
        <Tabs
          value={type}
          onChange={handleTypeChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          textColor="inherit"
          TabIndicatorProps={{
            style: { backgroundColor: "#f59e0b" }, // active underline color
          }}
        >
          <Tab value="" label="Un mélange 🍱" sx={{ textTransform: "none" }} />
          <Tab
            value="salés"
            label="Les salés 🍕"
            sx={{ textTransform: "none" }}
          />
          <Tab
            value="sucrés"
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
    </>
  );
};

export default CategoriesTabs;

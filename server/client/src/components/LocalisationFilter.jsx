import { FormControl, Select, MenuItem } from "@mui/material";
import cities from "../data/cities";

const LocalisationFilter = ({ localisation, setLocalisation }) => {
  return (
    <>
      {/* Desktop */}
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
      {/* Mobile */}
      <div className="block sm:hidden">
        <FormControl fullWidth>
          <Select
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            sx={{ "& .MuiSelect-select": { textAlign: "center" } }}
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </>
  );
};

export default LocalisationFilter;

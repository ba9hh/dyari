import ShopsHome from "./ShopsHome";
import NavBar from "./NavBar";


const Home = () => {
  return (
    <div className="sm:bg-[#f5f5f5] bg-white min-h-screen pb-6">
      <NavBar />
      <ShopsHome />
    </div>
  );
};

export default Home;

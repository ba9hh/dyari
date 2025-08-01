import { Link } from "react-router-dom";
import dyari from "../assets/dyari.svg";

const Dyari = () => {
  return (
    <Link className="absolute flex items-center gap-1 top-4 sm:left-8 left-2" to={"/"}>
      <img className="w-7" src={dyari} />
      <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
    </Link>
  );
};

export default Dyari;

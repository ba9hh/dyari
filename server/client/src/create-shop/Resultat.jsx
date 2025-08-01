import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from "../AuthProvider";
import { Link } from "react-router-dom";

const Resultat = ({ formData }) => {
  const hasRunRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    if (hasRunRef.current) return;

    const createAllData = async () => {
      setLoading(true);

      try {
        const updatedArticles = [];
        for (const article of formData.articles) {
          const imgFormData = new FormData();
          imgFormData.append("image", article.image);

          try {
            const uploadRes = await axios.post(
              "https://dyari.onrender.com/upload",
              imgFormData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            updatedArticles.push({
              ...article,
              image: uploadRes.data.url,
            });
          } catch (uploadErr) {
            console.error("Error uploading image:", uploadErr);
            setError("Failed to upload one of the article images.");
            continue;
          }
        }
        const fullData = {
          ...formData,
          articles: updatedArticles,
        };
        try {
          const res = await axios.post(
            "https://dyari.onrender.com/api/create-shop",
            fullData,
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          setUser(res.data.shop);
          hasRunRef.current = true;
          setSuccess(true);
        } catch (error) {
          console.error("Shop creation failed:", error);
          setError("Failed to create shop. Please try again.");
        }
      } catch (error) {
        console.error("Unexpected error in data creation:", error);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    createAllData();
    hasRunRef.current = true;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress size={30} />
      </div>
    );
  }
  return (
    <div className="flex justify-center py-20">
      {error ? (
        <div className="text-center">
          <ErrorOutlineIcon
            className="text-red-500 mx-auto"
            style={{ fontSize: 60 }}
          />
          <p className="text-red-600 font-semibold text-lg mt-2">{error}</p>
          <div className="mt-4">
            <Link
              className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
              to={"/"}
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : success ? (
        <div className="text-center">
          <CheckCircleIcon
            className="text-green-500 mx-auto"
            style={{ fontSize: 60 }}
          />
          <p className="text-green-600 font-semibold text-lg text-center">
            Account has been created successfully!
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Link
              className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
              to={"/"}
            >
              Back to Home
            </Link>
            <Link
              className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
              to={"/account"}
            >
              Go to Account
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Resultat;

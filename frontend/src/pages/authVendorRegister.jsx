import React, { useState } from "react";
import dyari from "../assets/dyari.svg";
import biscuit1 from "../assets/biscuit50.jpg";
import { Link, useNavigate } from "react-router-dom";
import boys from "../data/boys";
import girls from "../data/girls";
import axios from "axios";

const AuthVendorRegister = () => {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectProfilePicture = (src) => {
    if (selectedPhoto) {
      setSelectedPhoto(null);
    }
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: src, // Update the profilePicture with the selected image src
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setSelectedPhoto(photoUrl);
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: file, // Update the profilePicture with the selected image src
      }));
    }
  };
  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const updatedArticles = [...formData.articles];
      updatedArticles[index] = { ...updatedArticles[index], image: file };
      setFormData({ ...formData, articles: updatedArticles });
    }
  };

  const handlePriceChange = (event, index) => {
    const price = event.target.value;
    const updatedArticles = [...formData.articles];
    updatedArticles[index] = { ...updatedArticles[index], price };
    setFormData({ ...formData, articles: updatedArticles });
  };

  const handleTypeChange = (event, index, type) => {
    const updatedArticles = [...formData.articles];
    updatedArticles[index] = { ...updatedArticles[index], type };
    setFormData({ ...formData, articles: updatedArticles });
  };

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    localisation: "Gabes",
    gender: "",
    speciality: [],
    profilePicture: "",
    email: "",
    password: "",
    articles: [{}, {}, {}, {}, {}, {}],
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSpecialityChange = (e) => {
    const { value, checked } = e.target;
    setFormData({
      ...formData,
      speciality: checked
        ? [...formData.speciality, value]
        : formData.speciality.filter((item) => item !== value),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.speciality.length === 0) {
      alert("Please select at least one specialty.");
      return; // Prevent form submission if no checkbox is selected
    }

    let articleValid = false;
    for (let article of formData.articles) {
      console.log(article);
      // Check if an article is incomplete
      if (Object.keys(article).length > 0 && Object.keys(article).length < 3) {
        alert("Please check if an article is missing something.");
        return;
      }

      // Check if there's at least one valid article
      if (Object.keys(article).length === 3) {
        articleValid = true;
        article.price = article.price.trim();

        // Check if the input is empty
        if (article.price === "") {
          alert("Price is required.");
          return false;
        }

        // Check if the input is a valid number
        if (isNaN(article.price)) {
          alert("Price must be a valid number.");
          return false;
        }
      }
    }

    // Check if no valid articles exist
    if (!articleValid) {
      alert("You need to select at least one article.");
      return;
    }
    if (!formData.profilePicture) {
      alert("You need to select a profile picture.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    formData.password = formData.password.trim();
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return false;
    }

    handleImageUpload1()
  };
  const handleImageUpload1 = async () => {
    setLoading(true);
    try {
      const updatedArticles = await Promise.all(
        formData.articles.map(async (article) => {
          // Skip empty objects
          if (Object.keys(article).length === 0) {
            return null; // Return null for empty articles
          }

          // Prepare form data for the image
          const formData1 = new FormData();
          formData1.append("image", article.image);
          console.log(article.image);

          try {
            const response = await axios.post(
              "http://localhost:3000/upload",
              formData1,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
                        // Update the article with the uploaded image URL
            return {
              ...article,
              image: response.data.url,
            };
          } catch (error) {
            console.error("Error uploading image:", error);
            return null; // Skip the article if upload fails
          }
        })
      );
    
      if (selectedPhoto) {
        const formData2 = new FormData();
        formData2.append("image", formData.profilePicture);
        try {
          const response = await axios.post(
            "http://localhost:3000/upload",
            formData2,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          formData.profilePicture = response.data.url;
          setSelectedPhoto(null);
        } catch (error) {
          console.error("Error uploading image:", error);
          return null; // Skip the article if upload fails
        }
      }

      // Filter out null values (dropped articles)
      const filteredArticles = updatedArticles.filter(
        (article) => article !== null
      );

      // Step 2: Update formData with the uploaded articles
      const finalFormData = {
        ...formData,
        articles: filteredArticles,
      };

      const res = await axios.post(
        "http://localhost:3000/api/shop",
        finalFormData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Shop created successfully:", res.data);
      alert("Shop created successfully!");
      sessionStorage.setItem("email", formData.email);
      navigate("/verify-email");
    } catch (error) {
      console.error("Error posting shop data:", error);
      alert("Failed to create the shop. Please try again.");
    }
    setLoading(false);
  };
  console.log(formData.profilePicture);
  console.log(selectedPhoto);
  return (
    <div className="flex justify-center items-center w-full  bg-[#f5f5f5]">
      <Link className="absolute flex items-center gap-1 top-4 left-8" to={"/"}>
        <img className="w-7" src={dyari} />
        <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-1/3 flex flex-col gap-y-3 bg-white px-10 py-6 rounded-md shadow-md mt-24"
      >
        <div>
          <h1 className="text-[25px] text-[#1c1e21]">Créer un shop</h1>
          <h1 className="text-[15px] text-[#606770]">c'est simple et rapide</h1>
        </div>
        <div className="flex gap-x-2">
          <input
            type="text"
            name="name"
            placeholder="Prénom"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-1/2 rounded-[5px] border border-gray-400 px-[10px] py-[8px] text-[15px]"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nom de famille"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-1/2 rounded-[5px] border border-gray-400 px-[10px] py-[8px] text-[15px]"
          />
        </div>
        <div className="flex gap-x-2">
          <div className="w-1/2">
            <div className="flex items-center space-x-[2px]">
              <label className="text-[12px] font-medium text-[#606770]">
                Localisation
              </label>
              <span className="text-gray-500 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 8v4m0 4h.01"
                  />
                </svg>
              </span>
            </div>

            <select
              name="localisation"
              value={formData.localisation}
              onChange={handleChange}
              required
              className="h-[36px] text-[#1c1e21] rounded-[4px] px-[8px] pr-[20px] border border-gray-400 w-full"
            >
              <option value="Tunisie">Tunisie</option>
              <option value="Ariana">Ariana</option>
              <option value="Manouba">Manouba</option>
              <option value="Ben Arous">Ben Arous</option>
              <option value="Nabeul">Nabeul</option>
              <option value="Bizerte">Bizerte</option>
              <option value="Zaghouan">Zaghouan</option>
              <option value="Sousse">Sousse</option>
              <option value="Monastir">Monastir</option>
              <option value="Mahdia">Mahdia</option>
              <option value="Sfax">Sfax</option>
              <option value="Béja">Béja</option>
              <option value="Jendouba">Jendouba</option>
              <option value="Le Kef">Le Kef</option>
              <option value="Siliana">Siliana</option>
              <option value="Kairouan">Kairouan</option>
              <option value="Sidi Bouzid">Sidi Bouzid</option>
              <option value="Kasserine">Kasserine</option>
              <option value="Gabès">Gabès</option>
              <option value="Médenine">Médenine</option>
              <option value="Gafsa">Gafsa</option>
              <option value="Tozeur">Tozeur</option>
              <option value="Tataouine">Tataouine</option>
              <option value="Kébili">Kébili</option>
            </select>
          </div>
          <div className="w-1/2">
            <div className="flex items-center space-x-[2px]">
              <label className="text-[12px] font-medium text-[#606770]">
                Genre
              </label>
              <span className="text-gray-500 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 8v4m0 4h.01"
                  />
                </svg>
              </span>
            </div>

            {/* Radio Buttons */}
            <div className="flex space-x-1">
              {/* Femme */}
              <label className="flex items-center space-x-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100">
                <span>Femme</span>
                <input
                  type="radio"
                  name="gender"
                  value="Femme"
                  checked={formData.gender === "Femme"}
                  onChange={handleChange}
                  className="accent-blue-500"
                  required
                />
              </label>

              {/* Homme */}
              <label className="flex items-center space-x-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100">
                <span>Homme</span>
                <input
                  type="radio"
                  name="gender"
                  value="Homme"
                  checked={formData.gender === "Homme"}
                  onChange={handleChange}
                  className="accent-blue-500"
                  required
                />
              </label>
            </div>
          </div>
        </div>
        {formData.gender && (
          <div>
            <div className="flex items-center space-x-[2px]">
              <label className="text-[12px] font-medium text-[#606770]">
                Photo de profile
              </label>
              <span className="text-gray-500 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 8v4m0 4h.01"
                  />
                </svg>
              </span>
            </div>
            <div className="flex gap-x-[2px] justify-between items-center">
              <div className="flex flex-col items-center">
                {selectedPhoto ? (
                  <img
                    src={selectedPhoto}
                    alt="Uploaded Profile"
                    className="w-[42px] h-[42px] p-[2px] rounded-full border"
                  />
                ) : (
                  <div />
                )}
                <label
                  htmlFor="upload-photo"
                  className="mt-1 px-2 py-2 bg-white text-black text-sm font-normal rounded cursor-pointer hover:bg-gray-200 border"
                >
                  Upload Photo
                </label>
                <input
                  id="upload-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
              <h1 className="text-[10px] font-medium">ou</h1>
              <div className="flex flex-wrap gap-2">
                {(formData.gender == "Femme" ? girls : boys).map(
                  (image, index) => (
                    <img
                      key={index}
                      src={image.src}
                      alt={image.alt}
                      className={`h-[42px] w-[42px] p-[2px] cursor-pointer border  rounded ${
                        formData.profilePicture === image.src
                          ? "border-blue-500"
                          : "border-gray-300 hover:border-gray-600"
                      }`}
                      onClick={() => handleSelectProfilePicture(image.src)}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        )}
        <div>
          <div className="flex items-center space-x-[2px]">
            <label className="text-[12px] font-medium text-[#606770]">
              Specialité
            </label>
            <span className="text-gray-500 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 8v4m0 4h.01"
                />
              </svg>
            </span>
          </div>

          {/* Radio Buttons */}
          <div className="flex space-x-1">
            
            <label className="flex items-center space-x-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100 w-1/4">
              <span>sales</span>
              <input
                type="checkbox"
                value="sales"
                checked={formData.speciality.includes("sales")}
                onChange={handleSpecialityChange}
                className="accent-blue-500"
              />
            </label>

            <label className="flex items-center space-x-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100 w-1/4">
              <span>sucres</span>
              <input
                type="checkbox"
                value="sucres"
                checked={formData.speciality.includes("sucres")}
                onChange={handleSpecialityChange}
                className="accent-blue-500"
              />
            </label>

            <label className="flex items-center space-x-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100 w-1/4">
              <span>gateaux</span>
              <input
                type="checkbox"
                value="gateaux"
                checked={formData.speciality.includes("gateaux")}
                onChange={handleSpecialityChange}
                className="accent-blue-500"
              />
            </label>
            <label className="flex items-center space-x-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100 w-1/4">
              <span>biscuit</span>
              <input
                type="checkbox"
                value="biscuit"
                checked={formData.speciality.includes("biscuit")}
                onChange={handleSpecialityChange}
                className="accent-blue-500"
              />
            </label>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-[2px]">
            <label className="text-[12px] font-medium text-[#606770]">
              Articles
            </label>
            <span className="text-gray-500 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 8v4m0 4h.01"
                />
              </svg>
            </span>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-x-3 gap-y-6 w-fit">
              {formData.articles.map((article, index) => (
                <div key={index} className="flex flex-col gap-y-1">
                  <div className="relative group">
                    <img
                      src={
                        article.image
                          ? URL.createObjectURL(article.image)
                          : biscuit1 // Default placeholder image
                      }
                      alt={`Article ${index + 1}`}
                      className="w-36 h-44 object-cover cursor-pointer"
                      onClick={() =>
                        document.getElementById(`fileInput-${index}`).click()
                      }
                    />
                    <input
                      type="file"
                      id={`fileInput-${index}`}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, index)}
                    />
                  </div>
                  <div className="flex items-center gap-x-1">
                    <div className="flex items-center gap-x-1 py-[2px]">
                      <h1 className="text-sm">kg</h1>
                      <input
                        type="radio"
                        name={`type-${index}`}
                        onChange={(e) => handleTypeChange(e, index, "kg")}
                      />
                    </div>
                    <h1 className="text-sm text-gray-500">ou</h1>
                    <div className="flex items-center gap-x-1 py-[2px]">
                      <h1 className="text-sm">piéce</h1>
                      <input
                        type="radio"
                        name={`type-${index}`}
                        onChange={(e) => handleTypeChange(e, index, "piéce")}
                      />
                    </div>
                  </div>
                  <div className="flex gap-x-1">
                    <input
                      type="text"
                      placeholder="Prix"
                      className="rounded-md border border-gray-500 px-3 text-sm w-2/5"
                      value={article.price || ""}
                      onChange={(e) => handlePriceChange(e, index)}
                    />
                    <h1 className="text-sm">dt</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <input
          type="email"
          name="email"
          placeholder="Votre e-mail"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-[5px] border border-gray-400 px-[10px] py-[8px] text-[15px]"
        />
        <input
          type="password"
          name="password"
          placeholder="Nouveau mot de passe"
          className="w-full rounded-[5px] border border-gray-400 px-[10px] py-[8px] text-[15px]"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="w-full flex justify-end">
          <button
            className="px-[32px] font-semibold bg-[#00a400] text-white text-[15px] h-[30px] rounded-[6px] disabled:bg-gray-400 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : "S'inscrire"}
          </button>
          
        </div>
      </form>
    </div>
  );
};

export default AuthVendorRegister;

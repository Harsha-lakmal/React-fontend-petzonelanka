import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import instance from "../../Service/AxiosHolder/AxiosHolder.jsx";

export default function Stock() {
  const token = localStorage.getItem("authToken");
  const [pets, setPets] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all pets
  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/pets/getPets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPets(response.data.pets);
      setError(null);
    } catch (error) {
      console.log("Error fetching pets:", error);
      setError("Failed to load pets data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all pet types
  const fetchPetTypes = async () => {
    try {
      const response = await instance.get("/pet/getAllPetType", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPetTypes(response.data.petTypes);
    } catch (error) {
      console.log("Error fetching pet types:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPets();
    fetchPetTypes();
  }, []);

  // Filter pets by type
  const filteredPets = selectedType === "All" 
    ? pets 
    : pets.filter(pet => pet.type === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
      <Navbar page="stock" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800">Pet Stock Management</h1>
          <button 
            onClick={fetchPets}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Stock
          </button>
        </div>

        {/* Pet Type Filter */}
        <div className="mb-8 bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter by Pet Type</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedType("All")}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedType === "All"
                  ? "bg-indigo-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Types
            </button>
            
            {petTypes.map((type) => (
              <button
                key={type._id}
                onClick={() => setSelectedType(type.name)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedType === type.name
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* Pet Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <div 
                key={pet._id} 
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pet.type === "Dog" ? "bg-yellow-100 text-yellow-800" :
                      pet.type === "Cat" ? "bg-purple-100 text-purple-800" :
                      pet.type === "Bird" ? "bg-blue-100 text-blue-800" :
                      pet.type === "Fish" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {pet.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{pet.description}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-gray-700 font-medium">ID: #{pet.petId}</div>
                    <div className="text-gray-700 font-medium">Stock: {pet.stock}</div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-indigo-600">Rs. {Number(pet.price).toLocaleString()}</span>
                     
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
   
      </div>
    </div>
  );
}
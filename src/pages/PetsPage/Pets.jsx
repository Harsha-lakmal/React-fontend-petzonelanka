import { useState, useEffect } from 'react';
import instance from '../../Service/AxiosHolder/AxiosHolder.jsx';
import Navbar from '../../components/Navbar/Navbar';
import Swal from 'sweetalert2';

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [petId, setPetId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchPets();
  }, []);

  function fetchPets() {
    setLoading(true);
    try {
      instance
        .get("/pets/getPets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPets(response.data.pets);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError("Failed to load pets data");
          setLoading(false);
        });
    } catch (error) {
      console.log("error " + error);
      setError("Something went wrong");
      setLoading(false);
    }
  }

  function deletePet() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          instance.delete('/pets/deletePet', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              data: {
                petId: petId
              }
            })
            .then((response) => {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Pet has been deleted successfully',
                timer: 1500,
                showConfirmButton: false
              });
              fetchPets();
            })
            .catch((error) => {
              console.log(error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete pet',
              });
            });
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong',
          });
        }
      }
    });
  }

  async function uploadImage(petId) {
    console.log(petId);
    
    if (!imageFile) return;
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      await instance.post(`/pets/image/${petId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  }

  async function addPet(e) {
    e.preventDefault();
    const newPet = {
      name,
      description,
      type,
      price,
      stock,
    };
    
    try {

      const response = await instance.post("/pets/createPet", newPet, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(response);
      
      
      const createdPetId = response.data.petId;
      console.log("pet id : "+ createdPetId);
      
      
      // Then upload the image if there is one
      if (imageFile) {
        await uploadImage(createdPetId);
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'New pet has been added successfully',
        timer: 1500,
        showConfirmButton: false
      });
      
      fetchPets();
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add new pet',
      });
    }
  }

  function updatePet(e) {
    e.preventDefault();
    const updateData = {
      petId,
      name,
      description,
      type,
      price,
      stock,
    };
    
    try {
      instance
        .put("/pets/updatePet", updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (response) => {
          // Upload new image if selected
          if (imageFile) {
            await uploadImage(petId);
          }
          
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Pet information has been updated successfully',
            timer: 1500,
            showConfirmButton: false
          });
          fetchPets(); 
          setIsUpdateModalOpen(false);
          resetForm();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update pet information',
          });
        });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong',
      });
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function resetForm() {
    setName('');
    setDescription('');
    setType('');
    setPrice('');
    setStock('');
    setPetId(null);
    setImageFile(null);
    setImagePreview(null);
  }

  function openUpdateModal(pet) {
    setPetId(pet.petId);
    setName(pet.name);
    setDescription(pet.description);
    setType(pet.type);
    setPrice(pet.price);
    setStock(pet.stock);
    // You might want to set a preview of the existing image here if available
    setIsUpdateModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
      <Navbar page="pet" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Pet
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div key={pet.petId} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{pet.name}</h2>
                      <p className="text-sm text-indigo-600 mt-1">{pet.type}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Stock: {pet.stock}
                    </span>
                  </div>
                  
                  <p className="mt-3 text-gray-600 text-sm">{pet.description}</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-900">Rs. {Number(pet.price).toLocaleString()}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openUpdateModal(pet)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deletePet(pet.petId)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
         


      {/* Add Pet Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="border-b px-4 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Add New Pet</h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={addPet} className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Pet Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Enter pet name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                  Pet Type
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="type"
                  type="text"
                  placeholder="Dog, Cat, etc."
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  placeholder="Pet description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price (Rs.)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="price"
                  type="number"
                  placeholder="Price in Rs."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                  Stock
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="stock"
                  type="number"
                  placeholder="Available stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Pet Image
                </label>
                <div className="flex items-center">
                  <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg">
                    <span>Choose Image</span>
                    <input 
                      type="file" 
                      id="image"
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  {imagePreview && (
                    <div className="ml-4 w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Pet Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="border-b px-4 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Update Pet</h3>
              <button 
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={updatePet} className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="update-name">
                  Pet Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="update-name"
                  type="text"
                  placeholder="Enter pet name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="update-type">
                  Pet Type
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="update-type"
                  type="text"
                  placeholder="Dog, Cat, etc."
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="update-description">
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="update-description"
                  placeholder="Pet description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="update-price">
                  Price (Rs.)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="update-price"
                  type="number"
                  placeholder="Price in Rs."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="update-stock">
                  Stock
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="update-stock"
                  type="number"
                  placeholder="Available stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="update-image">
                  Pet Image
                </label>
                <div className="flex items-center">
                  <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg">
                    <span>Change Image</span>
                    <input 
                      type="file" 
                      id="update-image"
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  {imagePreview && (
                    <div className="ml-4 w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Update Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

























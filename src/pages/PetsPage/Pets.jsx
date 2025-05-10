import { useState, useEffect } from 'react';
import instance from '../../Service/AxiosHolder/AxiosHolder.jsx';
import Navbar from '../../components/Navbar/Navbar';
import Swal from 'sweetalert2';

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
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
    fetchPetTypes();
  }, []);

  async function fetchPets() {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get("/pets/getPets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPets(response.data.pets);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
      setError("Failed to load pets data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPetTypes() {
    try {
      const response = await instance.get("/pet/getAllPetType", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPetTypes(response.data.petTypes);
      console.log(response.data.petTypes);
      
    } catch (error) {
      console.error("Failed to fetch pet types:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to load pet types',
        timer: 3000,
        showConfirmButton: false
      });
    }
  }

  function deletePet(petId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await instance.delete('/pets/deletePet', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              petId: petId
            }
          });
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Pet has been deleted successfully',
            timer: 1500,
            showConfirmButton: false
          });
          
          fetchPets();
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to delete pet',
          });
        }
      }
    });
  }

  async function uploadImage(petId) {
    if (!imageFile) return false;
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      await instance.post(`/pets/image/${petId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return true;
    } catch (error) {
      console.error("Image upload failed:", error);
      return false;
    }
  }

  async function addPet(e) {
    e.preventDefault();
    
    if (!imageFile) {
      Swal.fire({
        icon: 'error',
        title: 'Image Required',
        text: 'Please select an image for the pet',
      });
      return;
    }

    if (!imageFile.type.match('image.*')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Image',
        text: 'Please select a valid image file (JPEG, PNG, etc.)',
      });
      return;
    }

    const newPet = {
      name,
      description,
      type,
      price: parseFloat(price),
      stock: parseInt(stock),
    };
    
    try {
      const response = await instance.post("/pets/createPet", newPet, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const createdPetId = response.data.petId;
      console.log("pet id : "+createdPetId);
    
      const imageUploadSuccess = await uploadImage(createdPetId);
      
      if (imageUploadSuccess) {
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
      } else {
        // Rollback if image upload fails
        await instance.delete('/pets/deletePet', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            petId: createdPetId
          }
        });
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Image upload failed. The pet has not been added.',
        });
      }
    } catch (error) {
      console.error("Add pet error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add new pet',
      });
    }
  }

  async function updatePet(e) {
    e.preventDefault();
    
    if (imageFile && !imageFile.type.match('image.*')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Image',
        text: 'Please select a valid image file (JPEG, PNG, etc.)',
      });
      return;
    }

    const updateData = {
      petId,
      name,
      description,
      type,
      price: parseFloat(price),
      stock: parseInt(stock),
    };
    
    try {
      await instance.put("/pets/updatePet", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      let imageUploadSuccess = true;
      if (imageFile) {
        imageUploadSuccess = await uploadImage(petId);
      }
      
      if (imageUploadSuccess) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Pet information has been updated successfully',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Partial Update',
          text: 'Pet details were updated but image upload failed',
        });
      }
      
      fetchPets();
      setIsUpdateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Update pet error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update pet information',
      });
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file (JPEG, PNG, etc.)',
      });
      return;
    }
    
    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Please select an image smaller than 5MB',
      });
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
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
    setPrice(pet.price.toString());
    setStock(pet.stock.toString());
    setImageFile(null);
    setImagePreview(null);
    setIsUpdateModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
      <Navbar page="pet" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pet Management</h1>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
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
            <button 
              onClick={fetchPets}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No pets found</h3>
            <p className="mt-1 text-gray-500">Add your first pet by clicking the button above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div key={pet.petId} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{pet.name}</h2>
                      <p className="text-sm text-indigo-600 mt-1 capitalize">{pet.type}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      pet.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {pet.stock > 0 ? `In Stock: ${pet.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                  
                  <p className="mt-3 text-gray-600 text-sm line-clamp-2">{pet.description}</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-900">Rs. {Number(pet.price).toLocaleString()}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openUpdateModal(pet)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors"
                        aria-label="Edit pet"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deletePet(pet.petId)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
                        aria-label="Delete pet"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="border-b px-4 py-3 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">Add New Pet</h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={addPet} className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Pet Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  Pet Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select a pet type</option>
                  {petTypes.map((petType) => (
                    <option key={petType.petTypeId} value={petType.name}>
                      {petType.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="description"
                  placeholder="Pet description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                    Price (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Pet Image <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors">
                    <span>Choose Image</span>
                    <input 
                      type="file" 
                      id="image"
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </label>
                  {imagePreview && (
                    <div className="ml-4 w-16 h-16 rounded-md overflow-hidden border-2 border-gray-300">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB. Accepted formats: JPEG, PNG</p>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                  disabled={!name || !type || !description || !price || !stock || !imageFile}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="border-b px-4 py-3 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">Update Pet</h3>
              <button 
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={updatePet} className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="update-name">
                  Pet Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  Pet Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="update-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select a pet type</option>
                  {petTypes.map((petType) => (
                    <option key={petType.petTypeId} value={petType.type}>
                      {petType.type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="update-description">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="update-description"
                  placeholder="Pet description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="update-price">
                    Price (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    id="update-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="update-stock">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    id="update-stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="update-image">
                  Pet Image
                </label>
                <div className="flex items-center">
                  <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors">
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
                    <div className="ml-4 w-16 h-16 rounded-md overflow-hidden border-2 border-gray-300">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB. Accepted formats: JPEG, PNG</p>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                  disabled={!name || !type || !description || !price || !stock}
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
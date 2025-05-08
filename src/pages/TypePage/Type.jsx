import { useState, useEffect } from 'react';
import instance from '../../Service/AxiosHolder/AxiosHolder.jsx';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Swal from 'sweetalert2';

export default function Type() {
  const [petTypes, setPetTypes] = useState([]);
  const [name, setName] = useState("");
  const [petTypeId, setPetTypeId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchPetTypes();
  }, []);

  // Fetch all pet types
  const fetchPetTypes = () => {
    setLoading(true);
    instance
      .get("/pet/getAllPetType", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPetTypes(response.data.petTypes);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to load pet types',
          timer: 3000,
          showConfirmButton: false
        });
      });
  };

  // Delete pet type with confirmation
  const deletePetType = (id) => {
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
        setLoading(true);
        instance
          .delete("/pet/deletePetType", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { petTypeId: id }
          })
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Pet type deleted successfully',
              timer: 2000,
              showConfirmButton: false
            });
            fetchPetTypes();
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete pet type',
              timer: 3000,
              showConfirmButton: false
            });
          });
      }
    });
  };

  // Update pet type
  const updatePetType = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Pet type name cannot be empty',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }

    setLoading(true);
    const updateStockType = {
      petTypeId,
      name,
    };
    
    instance
      .put("/pet/updatePetTpye", updateStockType, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Pet type updated successfully',
          timer: 2000,
          showConfirmButton: false
        });
        setName("");
        setPetTypeId("");
        setIsEditing(false);
        fetchPetTypes();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update pet type',
          timer: 3000,
          showConfirmButton: false
        });
      });
  };

  // Add new pet type
  const addPetType = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Pet type name cannot be empty',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }

    setLoading(true);
    const newPetType = {
      name
    };
    
    instance
      .post('/pet/createPetType', newPetType, {
        headers: {
          Authorization: `Bearer ${token}`
        }  
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Pet type added successfully',
          timer: 2000,
          showConfirmButton: false
        });
        setName("");
        fetchPetTypes();
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to add pet type',
          timer: 3000,
          showConfirmButton: false
        });
      });
  };

  // Set up form for editing
  const handleEdit = (type) => {
    setName(type.name);
    setPetTypeId(type.petTypeId);
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setName("");
    setPetTypeId("");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
      <Navbar page="type" />
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Pet Types Management</h1>

        {/* Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Update Pet Type' : 'Add New Pet Type'}
          </h2>
          <form onSubmit={isEditing ? updatePetType : addPetType}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Pet Type Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter pet type name"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isEditing ? 'Update' : 'Add'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && !petTypes.length ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : petTypes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No pet types found</td>
                </tr>
              ) : (
                petTypes.map((type) => (
                  <tr key={type._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{type.petTypeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{type.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(type)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePetType(type.petTypeId)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import instance from "../../Service/AxiosHolder/AxiosHolder";
import { FiEdit, FiTrash2, FiPlus, FiX, FiCheck } from "react-icons/fi";
import Swal from "sweetalert2";

export default function Vlogs() {
  const token = localStorage.getItem("authToken");
  const [vlogs, setVlogs] = useState([]);
  const [newVlog, setNewVlog] = useState({
    desc: "",
    VlogerName: "",
  });
  const [editVlog, setEditVlog] = useState({
    vlogId: "",
    desc: "",
    VlogerName: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchVlogs();
  }, []);

  const fetchVlogs = () => {
    setIsLoading(true);
    instance
      .get("/vlog/getVlogs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setVlogs(response.data.vlog);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch vlogs",
          text: error.response?.data?.message || "Something went wrong",
        });
      });
  };

  const deleteVlog = (vlogId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        instance
          .delete(`/vlog/deleteVlog`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { vlogId },
          })
          .then(() => {
            fetchVlogs();
            Swal.fire("Deleted!", "Your vlog has been deleted.", "success");
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Failed to delete vlog",
              text: error.response?.data?.message || "Something went wrong",
            });
          });
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (vlogId) => {
    if (!imageFile) return false; // Changed to return false if no image

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      await instance.post(`/vlog/image/${vlogId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return true;
    } catch (error) {
      console.error("Image upload failed:", error);
      return false;
    }
  };

  const addVlog = async () => {
    if (!newVlog.desc || !newVlog.VlogerName) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all fields",
      });
      return;
    }

    // Check if image is selected - added mandatory image check
    if (!imageFile) {
      Swal.fire({
        icon: "error",
        title: "Image Required",
        text: "Please upload an image for the vlog",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await instance.post("/vlog/addVlog", newVlog, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const vlogId = response.data.vlogId;
      console.log(vlogId);
      
      
      const imageUploadSuccess = await uploadImage(vlogId);

      if (!imageUploadSuccess) {
        // Delete the vlog if image upload fails
        await instance.delete(`/vlog/deleteVlog`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { vlogId },
        });
        
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Image Upload Failed",
          text: "The vlog could not be created because the image upload failed.",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Vlog and image added successfully",
      });

      setNewVlog({ desc: "", VlogerName: "" });
      setImageFile(null);
      setImagePreview(null);
      setIsAdding(false);
      fetchVlogs();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Failed to add vlog",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const updateVlog = () => {
    if (!editVlog.desc || !editVlog.VlogerName) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all fields",
      });
      return;
    }

    setIsLoading(true);
    instance
      .put("/vlog/updateVlog", editVlog, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setEditVlog({ vlogId: "", desc: "", VlogerName: "" });
        fetchVlogs();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Vlog updated successfully",
        });
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Failed to update vlog",
          text: error.response?.data?.message || "Something went wrong",
        });
      });
  };

  const handleEditClick = (vlog) => {
    setEditVlog({
      vlogId: vlog.vlogId,
      desc: vlog.desc,
      VlogerName: vlog.VlogerName,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar page="vlog" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Vlogs Dashboard</h1>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isAdding
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            onClick={() => {
              if (isAdding) {
                // Reset form when canceling
                setNewVlog({ desc: "", VlogerName: "" });
                setImageFile(null);
                setImagePreview(null);
              }
              setIsAdding(!isAdding);
            }}
            disabled={isLoading}
          >
            {isAdding ? <FiX /> : <FiPlus />} {isAdding ? "Cancel" : "Add Vlog"}
          </button>
        </div>

        {isAdding && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Create New Vlog
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newVlog.desc}
                  onChange={(e) =>
                    setNewVlog({ ...newVlog, desc: e.target.value })
                  }
                  placeholder="What's your vlog about?"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vlogger Name*
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newVlog.VlogerName}
                  onChange={(e) =>
                    setNewVlog({ ...newVlog, VlogerName: e.target.value })
                  }
                  placeholder="Your name"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vlog Image* (Required)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-3 py-2 text-sm text-gray-700
                border border-gray-300 rounded-lg shadow-sm
                file:mr-4 file:py-1.5 file:px-4
                file:border-0 file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                {imagePreview ? (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 w-auto object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-red-500">
                    You must upload an image to create a vlog
                  </div>
                )}
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                onClick={addVlog}
                disabled={isLoading || !imageFile}
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <FiCheck /> Submit
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {editVlog.vlogId && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Edit Vlog
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editVlog.desc}
                  onChange={(e) =>
                    setEditVlog({ ...editVlog, desc: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vlogger Name*
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editVlog.VlogerName}
                  onChange={(e) =>
                    setEditVlog({ ...editVlog, VlogerName: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  onClick={updateVlog}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Updating..."
                  ) : (
                    <>
                      <FiCheck /> Update
                    </>
                  )}
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  onClick={() =>
                    setEditVlog({ vlogId: "", desc: "", VlogerName: "" })
                  }
                  disabled={isLoading}
                >
                  <FiX /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && !isAdding && !editVlog.vlogId && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading vlogs...</p>
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vlogs.length > 0 ? (
              vlogs.map((vlog) => (
                <div
                  key={vlog.vlogId}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {vlog.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={vlog.imageUrl}
                        alt={vlog.desc}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {vlog.desc}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(vlog.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-500">By:</span>{" "}
                      {vlog.VlogerName}
                    </p>
                  </div>
                  <div className="px-5 py-3 bg-gray-50 flex justify-between">
                    <button
                      className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-md transition-colors disabled:opacity-50"
                      onClick={() => handleEditClick(vlog)}
                      disabled={isLoading}
                    >
                      <FiEdit size={14} /> Edit
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors disabled:opacity-50"
                      onClick={() => deleteVlog(vlog.vlogId)}
                      disabled={isLoading}
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  No vlogs found. Add a new vlog to get started.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
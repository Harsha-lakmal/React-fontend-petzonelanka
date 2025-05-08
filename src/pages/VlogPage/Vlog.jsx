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
    console.log(vlogId);

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

  const addVlog = () => {
    if (!newVlog.desc || !newVlog.VlogerName) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all fields",
      });
      return;
    }

    setIsLoading(true);
    instance
      .post("/vlog/addVlog", newVlog, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setNewVlog({ desc: "", VlogerName: "" });
        setIsAdding(false);
        fetchVlogs();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Vlog added successfully",
        });
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Failed to add vlog",
          text: error.response?.data?.message || "Something went wrong",
        });
      });
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
            onClick={() => setIsAdding(!isAdding)}
            disabled={isLoading}
          >
            <FiPlus /> {isAdding ? "Cancel" : "Add Vlog"}
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
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                onClick={addVlog}
                disabled={isLoading}
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

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function ParcelPage() {
  const [parcels, setParcels] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);

  // 🔍 Filter states
  const [searchCity, setSearchCity] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchParcelID, setSearchParcelID] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/parcel", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setParcels(response.data);
          setLoaded(true);
        })
        .catch(() => {
          toast.error("Failed to fetch parcels");
          setLoaded(true);
        });
    }
  }, [loaded]);

  async function deleteParcel(parcelID) {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/parcel/" + parcelID,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      setLoaded(false);
      toast.success("Parcel deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete Parcel. Please try again."
      );
    }
  }

  // ✅ Function to convert parcel details into QR code JSON
  function generateQRData(parcel) {
    return JSON.stringify({
      parcelID: parcel.parcelID,
      name: parcel.name,
      address_line1: parcel.address_line1,
      city: parcel.city,
      district: parcel.district,
      details: parcel.details,
      estimateDate: parcel.estimateDate,
      status: parcel.status,
    });
  }

  // ✅ Combined filters
  const filteredParcels = parcels.filter((parcel) => {
    const matchesParcelID = parcel.parcelID
      ?.toLowerCase()
      .includes(searchParcelID.toLowerCase());
    const matchesCity = parcel.city
      ?.toLowerCase()
      .includes(searchCity.toLowerCase());
    const matchesEmail = parcel.email
      ?.toLowerCase()
      .includes(searchEmail.toLowerCase());
    const matchesStatus = searchStatus
      ? parcel.status?.toLowerCase() === searchStatus.toLowerCase()
      : true;
    const matchesDate = searchDate
      ? new Date(parcel.estimateDate).toLocaleDateString() ===
        new Date(searchDate).toLocaleDateString()
      : true;

    return matchesCity && matchesEmail && matchesStatus && matchesDate && matchesParcelID;
  });

  return (
    <div className="w-full h-full rounded-lg p-1 relative">
      {/* ➕ Add Parcel Button */}
      <Link
        to={"/admin/addparcel"}
        className="text-white bg-blue-500 hover:bg-blue-600 p-2 text-3xl rounded-full mb-4 flex items-center gap-2 absolute bottom-4 right-4"
      >
        <FaPlus />
      </Link>

      {/* 🔍 Filters */}
      <div className="flex justify-center gap-4 my-4 flex-wrap">
        {/* P_ID filter */}
        <input
          type="text"
          placeholder="Search by Parcel ID..."
          value={searchParcelID}
          onChange={(e) => setSearchParcelID(e.target.value)}
          className="border p-2 rounded-lg"
        />

        {/* Email filter */}
        <input
          type="text"
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border p-2 rounded-lg"
        />

        {/* City filter */}
        <input
          type="text"
          placeholder="Search by city..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="border p-2 rounded-lg"
        />

        {/* Status filter */}
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>

        {/* Estimate Date filter */}
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border p-2 rounded-lg"
        />

        {/* Clear Filters */}
        <button
          onClick={() => {
            setSearchCity("");
            setSearchEmail("");
            setSearchStatus("");
            setSearchDate("");
            setSearchParcelID("");
          }}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>

      {loaded && (
        <table className="w-full">
          <thead>
            <tr className="text-center ">
              <th className="p-2">Parcel ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">E-mail</th>
              <th className="p-2">Address</th>
              <th className="p-2">City</th>
              <th className="p-2">District</th>
              <th className="p-2">Details</th>
              <th className="p-2">Estimate Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredParcels.map((parcel, index) => (
              <tr
                key={index}
                className="text-center border-b cursor-pointer hover:bg-gray-100"
              >
                <td className="p-2">{parcel.parcelID}</td>
                <td className="p-2">{parcel.name}</td>
                <td className="p-2">{parcel.email}</td>
                <td className="p-2">{parcel.address_line1}</td>
                <td className="p-2">{parcel.city}</td>
                <td className="p-2">{parcel.district}</td>
                <td className="p-2">{parcel.details}</td>
                <td className="p-2">
                  {new Date(parcel.estimateDate).toLocaleDateString()}
                </td>
                <td className="p-2">{parcel.status}</td>
                <td className="p-2">
                  <div className="w-full h-full flex justify-center gap-2">
                    <MdOutlineDeleteOutline
                      onClick={() => deleteParcel(parcel.parcelID)}
                      className="text-[25px] hover:text-red-600"
                    />
                    <MdOutlineEdit
                      onClick={() =>
                        navigate("/admin/editparcel/", { state: parcel })
                      }
                      className="text-[25px] hover:text-blue-600"
                    />
                    {/* ✅ QR Button */}
                    <button
                      onClick={() => setSelectedParcel(parcel)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                    >
                      QR
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loaded && (
        <div className="w-full h-full flex items-center justify-center">
          <VscLoading className="text-[60px] animate-spin" />
        </div>
      )}

      {/* ✅ No results found */}
      {loaded && filteredParcels.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No parcels found for these filters.
        </p>
      )}

      {/* ✅ QR Code Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4">Parcel QR Code</h2>
            <QRCodeCanvas value={generateQRData(selectedParcel)} size={200} />
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={() => setSelectedParcel(null)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const canvas = document.querySelector("canvas");
                  const url = canvas.toDataURL("image/png");
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `parcel-${selectedParcel.parcelID}.png`;
                  a.click();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

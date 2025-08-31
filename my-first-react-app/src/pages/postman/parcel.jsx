import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineEdit } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

export default function ParcelPage() {
    const [parcels, setParcels] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [city, setCity] = useState("");
    const [citySubmitted, setCitySubmitted] = useState(false);

    const [emailFilter, setEmailFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const [filteredParcels, setFilteredParcels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (citySubmitted) {
            setLoaded(false);
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/parcel", {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
                .then((response) => {
                    // Filter by city first
                    const cityFiltered = response.data.filter(parcel =>
                        parcel.city.toLowerCase().includes(city.toLowerCase())
                    );
                    setParcels(cityFiltered);
                    setFilteredParcels(cityFiltered); // initially same as city filter
                    setLoaded(true);
                })
                .catch(() => {
                    toast.error("Failed to fetch parcels");
                    setLoaded(true);
                });
        }
    }, [citySubmitted]);

    // Apply additional filters whenever Email, Status, or Date changes
    useEffect(() => {
        let temp = [...parcels];

        if (emailFilter.trim() !== "") {
            temp = temp.filter(parcel =>
                parcel.email.toLowerCase().includes(emailFilter.toLowerCase())
            );
        }

        if (statusFilter !== "") {
            temp = temp.filter(parcel =>
                parcel.status.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        if (dateFilter !== "") {
            temp = temp.filter(parcel =>
                new Date(parcel.estimateDate).toDateString() === new Date(dateFilter).toDateString()
            );
        }

        setFilteredParcels(temp);
    }, [emailFilter, statusFilter, dateFilter, parcels]);

    return (
        
        <div className="w-full h-full rounded-lg p-1 relative ">
            
            {/* City Input */}
            {!citySubmitted && (
                <div className="flex flex-col items-center gap-3 my-5">
                    <img
                        src="https://img.freepik.com/premium-vector/vector-illustration-delivery-courier-holding-package-with-delivery-truck-background_675567-2242.jpg"
                        alt="search"
                        className="w-200  flex justify-center mx-auto mb-4"
                    />
                    <input
                        type="text"
                        placeholder="Enter your city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="border p-2 rounded-lg w-1/3 h-13"
                    />
                    <button
                        onClick={() => {
                            if (city.trim() === "") {
                                toast.error("Please enter a city");
                                return;
                            }
                            setCitySubmitted(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        View Parcels
                    </button>
                </div>
            )}

            {/* Additional Filters */}
            {citySubmitted && loaded && parcels.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-5 justify-center">
                    <input
                        type="text"
                        placeholder="Filter by Email"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                        className="border p-2 rounded-lg"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border p-2 rounded-lg"
                    >
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border p-2 rounded-lg"
                    />
                    {/* Clear Filters */}
                    <button
                    onClick={() => {
                        setDateFilter("");
                        setStatusFilter("");
                        setEmailFilter("");
                    }}
                    className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
                    >
                    Clear
                    </button>
                </div>
            )}

            {/* Parcel Table */}
            {citySubmitted && loaded && filteredParcels.length > 0 && (
                <table className="w-full">
                    <thead>
                        <tr className="text-center">
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
                            <tr key={index} className="text-center border-b cursor-pointer hover:bg-gray-100">
                                <td className="p-2">{parcel.parcelID}</td>
                                <td className="p-2">{parcel.name}</td>
                                <td className="p-2">{parcel.email}</td>
                                <td className="p-2">{parcel.address_line1}</td>
                                <td className="p-2">{parcel.city}</td>
                                <td className="p-2">{parcel.district}</td>
                                <td className="p-2">{parcel.details}</td>
                                <td className="p-2">{new Date(parcel.estimateDate).toLocaleDateString()}</td>
                                <td className="p-2">{parcel.status}</td>
                                <td className="p-2">
                                    <div className="w-full h-full flex justify-center gap-2">
                                        <MdOutlineEdit
                                            onClick={() => navigate("/postman/editparcel/", { state: parcel })}
                                            className="text-[25px] hover:text-blue-600"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* No Parcels Found */}
            {citySubmitted && loaded && filteredParcels.length === 0 && (
                <p className="text-center text-gray-500 mt-5">No parcels found for the selected filters.</p>
            )}

            {/* Loader */}
            {citySubmitted && !loaded && (
                <div className="w-full h-full flex items-center justify-center">
                    <VscLoading className="text-[60px] animate-spin" />
                </div>
            )}
        </div>
    );
}

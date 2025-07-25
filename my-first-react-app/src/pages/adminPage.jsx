import { Routes, Route, Link } from "react-router-dom";

import { FaUsers } from "react-icons/fa";
import { MdOutlineWarehouse } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import '../App.css';
import ParcelPage from "./admin/parcel";
import AddParcel from "./admin/addParcel";
import EditParcel from "./admin/editParcel";


export default function AdminPage() {
    return (
        <div className='w-full h-screen flex bg-gray-100 p-2'>
            <div className='h-full w-[300px] bg-red-200 rounded-xl shadow-lg p-4 flex flex-col mr-2'>
                <Link to ="/admin/users" className="block p-2 flex item-center" > <FaUsers className="mr-2 "/> Users</Link>
                <Link to ="/admin/parcel" className="block p-2 flex item-center"> <MdOutlineWarehouse className="mr-2"/> Parcel</Link>
                <Link to ="/admin/orders" className="block p-2 flex item-center"> <LiaFileInvoiceSolid className="mr-2"/> Orders</Link>
            </div>

            <div className="h-full bg-white w-[calc(100vw-300px)] rounded-xl shadow-lg p-4 overflow-y-auto">
                <Routes path="/*">
                    <Route path="/users" element={<div>User</div>} />
                    <Route path="/parcel" element={<ParcelPage />} />
                    <Route path="/orders" element={<div>Orders</div>} />
                    <Route path="/addparcel" element={<AddParcel />} />
                    <Route path="/editparcel/" element={<EditParcel />} />`
                </Routes>
            </div>
        </div>
    )
}
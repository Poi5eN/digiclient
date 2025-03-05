import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Table from "../../Dynamic/Table";
import Button from "../../Dynamic/utils/Button";

function AddDues() {
  const authToken = Cookies.get("token");
const [addDues,setAddDues]=useState(false)
  const [submittedData, setSubmittedData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("All");
  const [getClass, setGetClass] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleOpenModal = (admissionNumber) => {  // Consider if you still need this
   setModalData(admissionNumber);
   setIsOpen(true);
  };

  const toggleModal = () => setIsOpen(!isOpen); // Consider if you still need this

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  useEffect(() => {
    const fetchData = async () => {  // use async/await for cleaner code
      try {
        const feesResponse = await axios.get(
          `https://eserver-i5sm.onrender.com/api/v1/adminRoute/getAllStudents`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log("feesResponse",feesResponse)
        setSubmittedData(feesResponse?.data?.allStudent);
        console.log("response", feesResponse.data.data);
      } catch (error) {
        console.error("Error fetching fees data:", error);
      }

      try {
        const classesResponse = await axios.get(
          `https://eserver-i5sm.onrender.com/api/v1/adminRoute/getAllClasses`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        let classes = classesResponse.data.classList;
        setGetClass(classes.sort((a, b) => a - b));
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchData();
  }, [authToken]);

  const filteredData = submittedData?.filter((item) => {
    if (selectedClass === "All") {
      if (selectedStatus === "All") {
        return true;
      } else {
        return item.feeStatus === selectedStatus;
      }
    } else {
      if (selectedStatus === "All") {
        return item.class === selectedClass;
      } else {
        return (
          item.class === selectedClass && item.feeStatus === selectedStatus
        );
      }
    }
  });


  const getStatusButtonClasses = (status) => {
    switch (status) {
      case "Unpaid":
        return selectedStatus === status
          ? "bg-red-500 text-white"
          : "bg-[#f9d4d4] text-gray-700 hover:bg-gray-300";
      case "Paid":
        return selectedStatus === status
          ? "bg-green-500 text-white"
          : "bg-green-500 text-gray-700 hover:bg-gray-300";
      case "Partial":
        return selectedStatus === status
          ? "bg-blue-500 text-white"
          : "bg-blue-500 text-gray-700 hover:bg-gray-300";
      default:
        return selectedStatus === "All"
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    }
  };

  const tHead = [
    { id: "admissionNo", label: "Admission No" },
    { id: "name", label: "Name" },
    { id: "fatherName", label: "Father Name" },
    { id: "class", label: "Class" },
    // { id: "contact", label: "Contact" },
    // { id: "feeStatus", label: "feeStatus" },
    { id: "totalDues", label: "Total Dues" },
    // { id: "action", label: "Action" },
  ];
  const tBody = filteredData.map((val, ind) => ({
    admissionNo: val.admissionNumber,
    name: val.fullName,
    fatherName: val.fatherName,
    class: val.class,
    totalDues: addDues?<input className="border-none outline-none bg-red-300"/>: val.totalDues  ,
  }));
  const handleAddFee=()=>{
    setAddDues(true)
  }

  return (
    <div className="relative">
      
      <div className="flex space-x-2">
        <div className="mb-2">
          <select
            name="studentClass"
            className="w-full border-1 border-black outline-none py-[1px] bg-inherit text-sm h-7" // Added text-sm for smaller text, Reduced padding, set height
            value={selectedClass}
            onChange={handleClassChange}
          >
            <option value="All">All Classes</option>
            {getClass?.map((cls, index) => (
              <option key={index} value={cls.className}>
                {cls?.className}
              </option>
            ))}
          </select>
        </div>
        <button
          className={`py-0.5 px-2 rounded text-sm leading-none ${getStatusButtonClasses(
            "All"
          )}`} // Reduced padding, added text-sm and leading-none
          onClick={() => handleStatusChange("All")}
          style={{ lineHeight: "inherit", height: "1.75rem" }}
        >
          All
        </button>
        <button
          className={`py-0.5 px-2 rounded text-sm bg-[#eb4962] leading-none ${getStatusButtonClasses(
            "Unpaid"
          )}`} // Reduced padding, added text-sm and leading-none
          onClick={() => handleStatusChange("Unpaid")}
          style={{ lineHeight: "inherit", height: "1.75rem",background:"bg-[#eb4962]" }}
        >
          Unpaid
        </button>
        <button
          className={`py-0.5 px-2 rounded bg-[#01f315] text-sm leading-none ${getStatusButtonClasses(
            "Paid"
          )}`} // Reduced padding, added text-sm and leading-none
          onClick={() => handleStatusChange("Paid")}
          style={{ lineHeight: "inherit", height: "1.75rem" }}
        >
          Paid
        </button>
        <button
          className={`py-0.5 px-2 rounded text-sm bg-[#69aad8] leading-none ${getStatusButtonClasses(
            "Partial"
          )}`} // Reduced padding, added text-sm and leading-none
          onClick={() => handleStatusChange("Partial")}
          style={{ lineHeight: "inherit", height: "1.75rem" }}
        >
          Partial
        </button>
      </div>
      <div className="flex gap-3">

      <Button name="  Add Dues Fees" onClick={()=>handleAddFee()} />

 {
  addDues &&  <div className="flex gap-3">  <Button name="Save" color="green" />  <Button name="cancel" color="gray " onClick={()=>setAddDues(false)} /></div>
 }
      </div>


      <div className="md:h-screen dark:text-white dark:bg-secondary-dark-bg mx-auto bg-white mt-2 rounded-md overflow-scroll w-full">
        <div className="w-full">
          <Table tHead={tHead} tBody={tBody} />
        </div>
        
      </div>
    </div>
  );
}

export default AddDues;

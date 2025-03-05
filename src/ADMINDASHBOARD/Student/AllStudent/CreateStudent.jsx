import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../../Dynamic/Form/FormStyle.css";
import { useStateContext } from "../../../contexts/ContextProvider.js";
import Cookies from "js-cookie";
import Loading from "../../../Loading";
import useCustomQuery from "../../../useCustomQuery";
import SomthingwentWrong from "../../../SomthingwentWrong";
import NoDataFound from "../../../NoDataFound.jsx";
import { useReactToPrint } from "react-to-print";
import PrintTable from "./PrintTable"; // Import PrintTable component
import ExportToExcel from "./ExportToExcel"; // Import ExportToExcel component
import pdf from '../../../Icone/pdf.png'
import Table from "../../../Dynamic/Table.jsx";
import moment from "moment/moment.js";
import { Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { ReactSelect } from "../../../Dynamic/ReactSelect/ReactSelect.jsx";
import Breadcrumbs from "../../../components/Breadcrumbs .jsx";
import { AdminGetAllClasses, getAllStudents } from "../../../Network/AdminApi.js";
import { toast } from "react-toastify";
function CreateStudent() {
  const authToken = Cookies.get("token");
  const { currentColor } = useStateContext();
  const [getClass, setGetClass] = useState([]); // All classes
  const [selectedClass, setSelectedClass] = useState(""); // Selected class
  const [selectedSection, setSelectedSection] = useState(""); // Selected section
  const [availableSections, setAvailableSections] = useState([]); // Sections for selected class
  const [submittedData, setSubmittedData] = useState([]); // All student data
  const [filteredData, setFilteredData] = useState([]); // Filtered student data
    const getAllStudent=async()=>{
      try {
        const response= await getAllStudents()
        if(response?.success){
          let filterApproved=response?.allStudent?.filter((val)=>val.approvalStatus!=="pending")
          setSubmittedData(response?.allStudent);
          setFilteredData(response?.allStudent); 
          // setSubmittedData(filterApproved);
          // setFilteredData(filterApproved); 

        }
        else{
          toast.error(response?.message)
        }
      } catch (error) {
        console.log("error",error)
      }
    }
    const GetAllClasses=async()=>{
      try {
        const response= await AdminGetAllClasses()
       console.log("first response",response)
        if(response?.success){
          let classes = response?.classList;
          setGetClass(classes.sort((a, b) => a - b));
          // let classes = response.classList;
          // setGetClass(classes.sort((a, b) => a - b));

        }
        else{
          toast.error(response?.message)
        }
      } catch (error) {
        console.log("error",error)
      }
    }
useEffect(()=>{
  getAllStudent()
  GetAllClasses()
},[])
  const printRef = useRef(); 
  useEffect(() => {
    let filtered = submittedData;

    if (selectedClass) {
      filtered = filtered.filter((student) => student.class === selectedClass);
    }

    if (selectedSection) {
      filtered = filtered.filter((student) => student.section === selectedSection);
    }

    setFilteredData(filtered);
  }, [selectedClass, selectedSection, submittedData]);

  // Handle class selection
  const handleClassChange = (e) => {
    const selectedClassName = e.target.value;
    setSelectedClass(selectedClassName);

    const selectedClassObj = getClass?.find(
      (cls) => cls.className === selectedClassName
    );

    if (selectedClassObj) {
      setAvailableSections(selectedClassObj.sections.split(", "));
    } else {
      setAvailableSections([]);
    }

    setSelectedSection(""); // Reset section when class changes
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @media print {
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        body {
          font-family: Arial, sans-serif;
          -webkit-print-color-adjust: exact;
        }
        .page {
          page-break-after: always;
        }
        .print-header {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 10px;
        }
        .print-table {
          width: 100%;
          border-collapse: collapse;
        }
        .print-table th, .print-table td {
          border: 1px solid black;
          padding: 5px;
          text-align: left;
        }
        .print-table th {
          background-color: #f2f2f2;
        }
      }
    `,
  });


  const THEAD = [
    { id: "SN", label: "S No." },
    { id: "admissionNo", label: "Admission No" },
    { id: "name", label: "Name" },
    { id: "photo", label: "Photo" },
    { id: "email", label: "Email" },
    { id: "fatherName", label: "Father Name" },
    { id: "motherName", label: "Mother Name" },
    { id: "class", label: "Class" },
    { id: "dateOfBirth", label: "DOB" },
    { id: "contact", label: "Contact" },
    { id: "joiningDate", label: "Adm. Date" },
    { id: "gender", label: "Gender" },
    { id: "address", label: "Address" },
    { id: "action", label: "Action" },
  ];
   const tBody = filteredData?.map((val, ind) => ({
      SN: ind + 1,
      admissionNo: (
        <span className="text-green-800 font-semibold">{val.admissionNumber}</span>
      ),
      photo: <img src={val.studentImage?.url  || "https://www.stcroixstoves.com/wp-content/uploads/2020/04/no.png"}  alt="photo"  className="w-5 h-5 object-cover rounded-md" />,
      name: val.fullName,
      email: val.email,
      fatherName: val.fatherName,
      motherName: val.motherName,
      class: val.class,
      dateOfBirth:  moment(val.dateOfBirth).format("DD-MMM-YYYY"),
      contact: val.contact,
      joiningDate: moment(val.joiningDate).format("DD-MMM-YYYY"),
      gender: val.gender,
      address: val.address,
      feeStatus: val.feeStatus,
      action: (
       <div className="flex justify-center gap-5">
         <Link to={`/admin/allstudent/editstudent/edit-profile/${val?._id}`}>
        <span 
         className="cursor-pointer">
          <FaEdit className="text-[20px] text-yellow-700" />
        </span>
        </Link>
         <Link to={`/admin/allstudent/viewstudent/view-profile/${val?.email}`}>
        <span 
         className="cursor-pointer">
          <AiFillEye className="text-[20px] text-green-700" />
        </span>
        </Link>
       </div>
      ),
    }));

    const dynamicOptions = getClass.map((cls) => ({
      label: cls.className,
      value: cls.className,
    }));
    const DynamicSection = availableSections?.map((item) => ({
      label: item,
      value: item,
    }));
    const BreadItem=[
      {
        title:"All Student",
        link:"/allstudent"
      }
    ]
  return (
    <div className="  mx-auto p-1 overflow-hidden">
      
      <Breadcrumbs BreadItem={BreadItem} />
<div className="flex gap-2">
<ReactSelect
              name="studentClass"
              value={selectedClass}
              handleChange={handleClassChange}
              label="Select a Class"
              dynamicOptions={dynamicOptions}
            />
              <ReactSelect
                          name="studentSection"
                          value={selectedSection} // Use selectedSection state
                          handleChange={handleSectionChange} // Use the handleSectionChange function
                          label="Select a Section"
                          dynamicOptions={DynamicSection}
                        />
            
      <div className="flex space-x-2">
        <img src={pdf} alt=""  className="h-8 cursor-pointer"   onClick={handlePrint} />
        <ExportToExcel data={filteredData} fileName="Students_Report" />
      </div>
</div>
      {filteredData?.length > 0 ? (
         <Table tHead={THEAD} tBody={tBody} isSearch={true} />
      
      ) : (
        <NoDataFound />
      )}
    <div className="hidden"> 
    <PrintTable ref={printRef} data={filteredData} itemsPerPage={25} />
    </div>
    </div>
  );
}

export default CreateStudent;





import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "./index.css";
import "../../../src/index.css";
import Switch from "@mui/material/Switch";
import "../../Dynamic/Form/FormStyle.css";
import { useStateContext } from "../../contexts/ContextProvider";
import NoDataFound from "../../NoDataFound";
import { FormControlLabel } from "@mui/material";
import BulkAdmission from "./BulkAdmission";
import Button from "../../Dynamic/utils/Button";
import Table from "../../Dynamic/Table";
import { MdLocalPrintshop } from "react-icons/md";
import moment from "moment/moment";
import Modal from "../../Dynamic/Modal";
import Loading from "../../Loading";
import { AdminGetAllClasses, createStudentParent, LastYearStudents } from "../../Network/AdminApi";
import AdmissionPrint from "./AdmissionPrint"; // Import the component
import PrintHandler from "./PrintHandler"; // Import the PrintHandler
import { ReactSelect } from "../../Dynamic/ReactSelect/ReactSelect";
import { ReactInput } from "../../Dynamic/ReactInput/ReactInput";
import Breadcrumbs from "../../components/Breadcrumbs ";

function Create_Registration_Form() {
  const { currentColor ,setIsLoader} = useStateContext();
  const [sibling, setsibling] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);
  const [getClass, setGetClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState(""); // New state for selected section
  const [availableSections, setAvailableSections] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectStudent, setSelectStudent] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const [payload, setPayload] = useState({
    studentFullName: "",
    admissionNumber: "",
    studentContact: "",
    studentAddress: "",
    guardian_name: "",
    studentDateOfBirth: moment().format("DD-MMM-YYYY"),
    studentGender: "",
    studentClass: "",
    studentSection: "",
    studentImage: null, // CHANGED:  Initialize as null, not ""
    fatherName: "",
    motherName: "",
  });

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const lastYearStudent = async () => {
    setLoading(true);
    setIsLoader(true)
    try {
      const response = await LastYearStudents();
      let filterApproved=response?.allStudent?.filter((val)=>val.approvalStatus!=="pending")

      if (response?.allStudent) {
        setIsLoader(false)
        setSubmittedData(filterApproved);
        setLoading(false);
      } else {
        toast.error(response?.message);
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false); // Ensure loading is set to false on error
    }
  };

  useEffect(() => {
    lastYearStudent();
  }, []);

  const handleSubmit = async (e) => {
    // debugger
    setIsLoader(true)
    e.preventDefault();
    setLoading(true); //Start loading before making the request
    const payloadData = {
      studentFullName: payload.studentFullName,
      studentEmail: `${payload.studentFullName}${payload.studentContact}@gmail.com`,
      studentPassword: payload.studentContact,
      studentDateOfBirth:moment(payload.studentDateOfBirth).format("DD MMMM YYYY"),
      studentGender: payload.studentGender,
      studentJoiningDate: moment(Date.now()).format("DD MMMM YYYY"),
      studentAddress: payload.studentAddress,
      studentContact: payload.studentContact,
      studentClass: selectedClass,
      studentSection: selectedSection, // Use the selectedSection state
      fatherName: payload.fatherName,
      motherName: payload.motherName,
      parentEmail: `${payload.fatherName}${payload.studentContact}@gmail.com`,
      parentPassword: payload.studentContact,
      parentContact: payload.studentContact,
      admissionNumber: payload.admissionNumber,
      studentImage: payload.studentImage,
    };

    const formDataToSend = new FormData();
    Object.entries(payloadData).forEach(([key, value]) => {
        // Check if the value is a file, then append it, otherwise convert it to string.
        if (key === "studentImage" && value) {
            formDataToSend.append(key, value);  // Append the file object directly
        } else {
            formDataToSend.append(key, String(value)); //convert all other values to string
        }

    });

    try {
      const response= await createStudentParent(formDataToSend)
      if(response?.success){
        setIsLoader(false)
        lastYearStudent()
        toast.success(response?.message)
        toggleModal();
        setLoading(false);
        setModalOpen(false);
        //reset the form
        // setPayload({
        //     studentFullName: "",
        //     admissionNumber: "",
        //     studentContact: "",
        //     studentAddress: "",
        //     guardian_name: "",
        //     studentDateOfBirth: moment().format("DD-MMM-YYYY"),
        //     studentGender: "",
        //     studentClass: "",
        //     studentSection: "",
        //     studentImage: null,
        //     fatherName: "",
        //     motherName: "",
        //   })
          setSelectedClass("");
          setSelectedSection("");
      }
      else{
        toast.error(response?.data?.message)
        setLoading(false);
      }
    } catch (error) {
      console.log("error",error)
      setLoading(false); // Ensure loading is set to false on error
    }

  };

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
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value); // Update the selectedSection state
  };

  const handleFilterClassChange = (e) => {
    setFilterClass(e.target.value);
  };

  const getAllClass = async()=>{
    setIsLoader(true)
  try {

    const response =await AdminGetAllClasses()
    if(response?.success){
      setIsLoader(false)
      let classes = response.classList;
      setGetClass(classes.sort((a, b) => a - b));
    }
  } catch (error) {
    console.log("error")
  }
  }

  useEffect(()=>{
    getAllClass()
  },[])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPayload({
        ...payload,
        studentImage: file,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload(() => ({
      ...payload,
      [name]: value,
    }));
  };

  const filteredData = filterClass
    ? submittedData?.filter((item) => item.class === filterClass)
    : submittedData;

  const { handlePrint } = PrintHandler(); // Use the hook
  const handlePrintClick = (studentData) => {
    setSelectStudent(studentData);
    setTimeout(() => {
      // Call the reusable handlePrint function and pass the content
      handlePrint(document.getElementById("printContent").innerHTML);
    }, 100);
  };

  const THEAD = [
    { id: "SN", label: "S No." },
    { id: "admissionNo", label: "Admission No" },
    { id: "image", label: "Photo" },
    { id: "name", label: "Name" },
    { id: "fatherName", label: "Father Name" },
    { id: "class", label: "Class" },
    { id: "contact", label: "Contact" },
    { id: "action", label: "Action" },
  ];

  const tBody = filteredData.map((val, ind) => ({
  // const tBody = modifiedData.map((val, ind) => ({
    SN: ind + 1,
    admissionNo: (
      <span className="text-green-800 font-semibold">{val.admissionNumber}</span>
    ),
    image:  <img
    src={val?.studentImage?.url || "https://www.stcroixstoves.com/wp-content/uploads/2020/04/no.png"}
    alt="avatar"
    class="relative inline-block object-cover object-center w-6 h-6 rounded-lg"
  />,
    name: val.fullName,
    fatherName: val.fatherName,
    class: val.class,
    contact: val.contact,
    feeStatus: val.feeStatus,
    action: (
      <span onClick={() => handlePrintClick(val)} className="cursor-pointer">
        <MdLocalPrintshop className="text-[25px] text-green-700" />
      </span>
    ),
  }));

  if (loading) {
    return <Loading />;
  }

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
      title:"Admission",
      link:"/admission"
    }
  ]
  return (
    <div className="px-2 h-[86.5vh]">
      {/* <h2 className="text-[#e36233] font-bold uppercase">All Students</h2> */}
     <Breadcrumbs BreadItem={BreadItem} />
      <div className="flex md:flex-row gap-1">
        <Button name="New Admission" onClick={toggleModal} />
        <BulkAdmission />
        <div className="">
          <select
            style={{ background: currentColor, color: "white" }}
            id="filterClass"
            value={filterClass}
            onChange={handleFilterClassChange}
            className="border rounded py-1"
          >
            <option value="">All Classes</option>
            {getClass?.map((cls, index) => (
              <option key={index} value={cls.className}>
                {cls?.className}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={"Create "} maxWidth="500px">
        <form onSubmit={handleSubmit} className="p-3">
          <div className=" mt-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-3 px-1 mx-auto bg-gray-100 rounded-md ">

             <ReactInput
              type="text"
              name="studentFullName"
              required={true}
              label="Student's Name"
              onChange={handleChange}
              value={payload.studentFullName}
             />

             <ReactInput
              type="text"
              name="admissionNumber"
              required={false}
              label="Admission Number"
              onChange={handleChange}
              value={payload.admissionNumber}
             />

            <ReactInput
              type="number"
              maxLength="10"
              name="studentContact"
              required={true}
              label="Contact"
              onChange={handleChange}
              value={payload.studentContact}
             />

             <ReactInput
              type="text"
              name="studentAddress"
              required={false}
              label="Student Address"
              onChange={handleChange}
              value={payload.studentAddress}
             />
             <ReactInput
              type="text"
              name="guardian_name"
              required={true}
              label="Guardian Name"
              onChange={handleChange}
              value={payload.guardian_name}


             />

            <ReactSelect
              name="studentGender"
              value={payload?.studentGender}
              handleChange={handleChange}
              label="Gender"
              dynamicOptions={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
            />
               <ReactInput
                                                  type="date"
                                                  name="studentDateOfBirth"
                                                  required={true}
                                                  label="DOB"
                                                  onChange={handleChange}
                                                  value={payload?.studentDateOfBirth}
                                                 />

            <div style={{zIndex:"9999999999999"}}>

            </div>
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

<ReactInput
              type="file"
              name="studentImage"
              accept="image/*"
              required={false}
              label="Student Image"
              onChange={handleImageChange}


             />
              {payload.studentImage && (
            <img
              src={URL.createObjectURL(payload.studentImage)}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-md"
            />
          )}

          </div>
          <div className="flex flex-row gap-10 justify-center bg-gray-100 text-center">
            <span className="text-xl text-blue-900">Parent Details</span>
            <FormControlLabel
              control={<Switch onClick={() => setsibling(!sibling)} />}
              label="Sibling"
            />
          </div>
          {sibling ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-1 mx-auto bg-gray-100 rounded-md ">

               <ReactInput
              type="text"
              name="fatherName"
              required={true}
              label="Father Name"
              onChange={handleChange}
              value={payload.fatherName}
             />

               <ReactInput
              type="text"
              name="motherName"
              required={false}
              label="Mother Name"
              onChange={handleChange}
              value={payload.motherName}
             />
            </div>
          ) : (
            <div className="bg-gray-100">
              <div className="px-5 md:max-w-[25%] w-full text-center ">

                   <ReactInput
              type="text"
              name="parentAdmissionNumber"
              required={true}
              label="Parent's Admission Number"
              onChange={handleChange}
              value={payload.parentAdmissionNumber}
             />
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-col md:flex-row justify-center gap-2 py-2 px-1">
            <Button
              name="Submit"
              type="submit"
              loading={loading}
              width="full"
            />
            <Button
              name="Cancel"
              color="gray"
              loading={loading}
              width="full"
              onClick={toggleModal}
            />
          </div>
        </form>
      </Modal>

      <div
        style={{
          display: "none",
        }}
      >
        <div id="printContent">
          <AdmissionPrint studentValues={selectStudent} />
        </div>
      </div>

      {filteredData.length > 0 ? (
      // {modifiedData.length > 0 ? (
        <Table tHead={THEAD} tBody={tBody} isSearch={true} />
      ) : (
        <NoDataFound />
      )}
    </div>
  );
}

export default Create_Registration_Form;




// import React, { useState, useEffect, useRef } from "react";
// import { toast } from "react-toastify";
// import "./index.css";
// import "../../../src/index.css";
// import Switch from "@mui/material/Switch";
// import "../../Dynamic/Form/FormStyle.css";
// import { useStateContext } from "../../contexts/ContextProvider";
// import Cookies from "js-cookie";
// import NoDataFound from "../../NoDataFound";
// import { FormControlLabel } from "@mui/material";
// import LoadingComponent from "../../Loading";
// import BulkAdmission from "./BulkAdmission";
// import Input from "../../Dynamic/Input";
// import Button from "../../Dynamic/utils/Button";
// import Table from "../../Dynamic/Table";
// import { AiFillEye } from "react-icons/ai";
// import { MdLocalPrintshop } from "react-icons/md";
// import moment from "moment/moment";
// import Modal from "../../Dynamic/Modal";
// import Loading from "../../Loading";
// import { AdminGetAllClasses, createStudentParent, LastYearStudents } from "../../Network/AdminApi";
// import AdmissionPrint from "./AdmissionPrint"; // Import the component
// import PrintHandler from "./PrintHandler"; // Import the PrintHandler
// import { ReactSelect } from "../../Dynamic/ReactSelect/ReactSelect";
// import ReactDatePicker from "../../Dynamic/DatePicker/DatePicker";
// import { ReactInput } from "../../Dynamic/ReactInput/ReactInput";
// import Breadcrumbs from "../../components/Breadcrumbs ";

// function Create_Registration_Form() {
//   const { currentColor } = useStateContext();
//   const authToken = Cookies.get("token");
//   const [sibling, setsibling] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [submittedData, setSubmittedData] = useState([]);
//   const [getClass, setGetClass] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSection, setSelectedSection] = useState(""); // New state for selected section
//   const [availableSections, setAvailableSections] = useState([]);
//   const [filterClass, setFilterClass] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [openReceipt, setOpenReceipt] = useState(false);
//   const [selectStudent, setSelectStudent] = useState();
//   const [searchQuery, setSearchQuery] = useState("");

//   const [payload, setPayload] = useState({
//     studentFullName: "",
//     admissionNumber: "",
//     studentContact: "",
//     studentAddress: "",
//     guardian_name: "",
//     studentDateOfBirth: moment().format("DD-MMM-YYYY"),
//     studentGender: "",
//     studentClass: "",
//     studentSection: "",
//     studentImage: "",
//     fatherName: "",
//     motherName: "",
//     studentImage: null,
//   });

//   const toggleModal = () => {
//     setModalOpen(!modalOpen);
//   };

//   const lastYearStudent = async () => {
//     setLoading(true);
//     try {
//       const response = await LastYearStudents();
//       let filterApproved=response?.allStudent?.filter((val)=>val.approvalStatus!=="pending")
     
//       if (response?.allStudent) {
//         setSubmittedData(filterApproved);
//         // setSubmittedData(response.allStudent);
//         setLoading(false);
//       } else {
//         toast.error(response?.message);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   useEffect(() => {
//     lastYearStudent();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payloadData = {
//       studentFullName: payload.studentFullName,
//       studentEmail: `${payload.studentFullName}${payload.studentContact}@gmail.com`,
//       studentPassword: payload.studentContact,
//       studentDateOfBirth:moment(payload.studentDateOfBirth).format("DD MMMM YYYY"),
//       studentGender: payload.studentGender,
//       studentJoiningDate: moment(Date.now()).format("DD MMMM YYYY"),
//       studentAddress: payload.studentAddress,
//       studentContact: payload.studentContact,
//       studentClass: selectedClass,
//       studentSection: selectedSection, // Use the selectedSection state
//       fatherName: payload.fatherName,
//       motherName: payload.motherName,
//       parentEmail: `${payload.fatherName}${payload.studentContact}@gmail.com`,
//       parentPassword: payload.studentContact,
//       parentContact: payload.studentContact,
//       admissionNumber: payload.admissionNumber,
//       studentImage: payload.studentImage,
//     };

// const payloaddata=payloadData
//     try {
//       const response= await createStudentParent(payloaddata)
//       if(response?.success){
//         lastYearStudent()
//         toast.success(response?.message)
//         toggleModal();
//         setLoading(false);
//         setModalOpen(false);
//       }
//       else{
//         toast.error(response?.data?.message)
//       }
//     } catch (error) {
//       console.log("error",error)
//     }
   
//   };

//   const handleClassChange = (e) => {
//     const selectedClassName = e.target.value;
//     setSelectedClass(selectedClassName);
//     const selectedClassObj = getClass?.find(
//       (cls) => cls.className === selectedClassName
//     );

//     if (selectedClassObj) {
//       setAvailableSections(selectedClassObj.sections.split(", "));
//     } else {
//       setAvailableSections([]);
//     }
//   };

//   const handleSectionChange = (e) => {
//     setSelectedSection(e.target.value); // Update the selectedSection state
//   };

//   const handleFilterClassChange = (e) => {
//     setFilterClass(e.target.value);
//   };

//   const getAllClass = async()=>{
    
//   try {
//     const response =await AdminGetAllClasses()
//     if(response?.success){
     
//       let classes = response.classList;
//       setGetClass(classes.sort((a, b) => a - b));
//     }
//   } catch (error) {
//     console.log("error")
//   }
//   }

//   useEffect(()=>{
//     getAllClass()
//   },[])
  
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setPayload({
//         ...payload,
//         studentImage: file,
//       });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPayload(() => ({
//       ...payload,
//       [name]: value,
//     }));
//   };

//   const filteredData = filterClass
//     ? submittedData?.filter((item) => item.class === filterClass)
//     : submittedData;

//   const searchFilteredData = filteredData?.filter((item) => {
//     return (
//       item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   });

//   const modifiedData = searchFilteredData?.map((item) => ({
//     ...item,
//     childName: item.children?.map((child) => child.fullName)?.join("\n"),
//     childAdmissionNo: item.children
//       ?.map((child) => child.admissionNumber)
//       .join("\n"),
//   }));

//   const printRef = useRef(null);
//   const { handlePrint } = PrintHandler(); // Use the hook

//   const handlePrintClick = (studentData) => {
//     setSelectStudent(studentData);
//     setTimeout(() => {
//       // Call the reusable handlePrint function and pass the content
//       handlePrint(document.getElementById("printContent").innerHTML);
//     }, 100);
//   };

//   const THEAD = [
//     { id: "SN", label: "S No." },
//     { id: "admissionNo", label: "Admission No" },
//     { id: "image", label: "Phote" },
//     { id: "name", label: "Name" },
//     { id: "fatherName", label: "Father Name" },
//     { id: "class", label: "Class" },
//     { id: "contact", label: "Contact" },
//     { id: "action", label: "Action" },
//   ];

//   const tBody = modifiedData.map((val, ind) => ({
//     SN: ind + 1,
//     admissionNo: (
//       <span className="text-green-800 font-semibold">{val.admissionNumber}</span>
//     ),
//     image:  <img
//     src={val?.image?.url || "https://www.stcroixstoves.com/wp-content/uploads/2020/04/no.png"}
//     alt="avatar"
//     class="relative inline-block object-cover object-center w-6 h-6 rounded-lg"
//   />,
//     name: val.fullName,
//     fatherName: val.fatherName,
//     class: val.class,
//     contact: val.contact,
//     feeStatus: val.feeStatus,
//     action: (
//       <span onClick={() => handlePrintClick(val)} className="cursor-pointer">
//         <MdLocalPrintshop className="text-[25px] text-green-700" />
//       </span>
//     ),
//   }));

//   if (loading) {
//     return <Loading />;
//   }

//   const dynamicOptions = getClass.map((cls) => ({
//     label: cls.className,
//     value: cls.className,
//   }));

//   const DynamicSection = availableSections?.map((item) => ({
//     label: item,
//     value: item,
//   }));

//   const BreadItem=[
//     {
//       title:"Admission",
//       link:"/admission"
//     }
//   ]
//   return (
//     <div className="px-2 h-[86.5vh]">
//       {/* <h2 className="text-[#e36233] font-bold uppercase">All Students</h2> */}
//      <Breadcrumbs BreadItem={BreadItem} />
//       <div className="flex md:flex-row gap-1">
//         <Button name="New Admission" onClick={toggleModal} />
//         <BulkAdmission />
//         <div className="">
//           <select
//             style={{ background: currentColor, color: "white" }}
//             id="filterClass"
//             value={filterClass}
//             onChange={handleFilterClassChange}
//             className="border rounded py-1"
//           >
//             <option value="">All Classes</option>
//             {getClass?.map((cls, index) => (
//               <option key={index} value={cls.className}>
//                 {cls?.className}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={"Create "} maxWidth="500px">
//         <form onSubmit={handleSubmit} className="p-3">
//           <div className=" mt-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-3 px-1 mx-auto bg-gray-100 rounded-md ">
            
//              <ReactInput
//               type="text"
//               name="studentFullName"
//               required={true}
//               label="Student's Name"
//               onChange={handleChange}
//               value={payload.studentFullName}
//              />
            
//              <ReactInput
//               type="text"
//               name="admissionNumber"
//               required={false}
//               label="Admission Number"
//               onChange={handleChange}
//               value={payload.admissionNumber}
//              />
            
//             <ReactInput
//               type="number"
//               maxLength="10"
//               name="studentContact"
//               required={true}
//               // placeholder="guardian_name"
//               label="Contact"
//               onChange={handleChange}
//               value={payload.studentContact}
//              />
            
//              <ReactInput
//               type="text"
//               name="studentAddress"
//               required={false}
//               // placeholder="guardian_name"
//               label="Student Address"
//               onChange={handleChange}
//               value={payload.studentAddress}
//              />
//              <ReactInput
//               type="text"
//               name="guardian_name"
//               required={true}
//               // placeholder="guardian_name"
//               label="Guardian Name"
//               onChange={handleChange}
//               value={payload.guardian_name}
//               // required_field={required}
             
             
//              />

//             <ReactSelect
//               name="studentGender"
//               value={payload?.studentGender}
//               handleChange={handleChange}
//               label="Gender"
//               dynamicOptions={[
//                 { label: "Male", value: "male" },
//                 { label: "Female", value: "female" },
//                 { label: "Other", value: "other" },
//               ]}
//             />
//                <ReactInput
//                                                   type="date"
//                                                   name="studentDateOfBirth"
//                                                   required={true}
//                                                   label="DOB"
//                                                   onChange={handleChange}
//                                                   value={payload?.studentDateOfBirth}
//                                                  />
           
//             <div style={{zIndex:"9999999999999"}}>
           
//             </div>
//             <ReactSelect
//               name="studentClass"
//               value={selectedClass}
//               handleChange={handleClassChange}
//               label="Select a Class"
//               dynamicOptions={dynamicOptions}
//             />
//             <ReactSelect
//               name="studentSection"
//               value={selectedSection} // Use selectedSection state
//               handleChange={handleSectionChange} // Use the handleSectionChange function
//               label="Select a Section"
//               dynamicOptions={DynamicSection}
//             />

// <ReactInput
//               type="file"
//               name="studentImage"
//               required={false}
//               // placeholder="guardian_name"
//               label="Student Image"
//               onChange={handleImageChange}
//               // value={payload.guardian_name}
//               // required_field={required}
             
             
//              />
//             {/* <Input
//               type="file"
//               name="studentImage"
//               required={false}
//               label="Student Image"
//               onChange={handleImageChange}
//             /> */}
//           </div>
//           <div className="flex flex-row gap-10 justify-center bg-gray-100 text-center">
//             <span className="text-xl text-blue-900">Parent Details</span>
//             <FormControlLabel
//               control={<Switch onClick={() => setsibling(!sibling)} />}
//               label="Sibling"
//             />
//           </div>
//           {sibling ? (
//             <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-1 mx-auto bg-gray-100 rounded-md ">
             
//                <ReactInput
//               type="text"
//               name="fatherName"
//               required={true}
//               label="Father Name"
//               onChange={handleChange}
//               value={payload.fatherName}
//              />
             
//                <ReactInput
//               type="text"
//               name="motherName"
//               required={false}
//               label="Mother Name"
//               onChange={handleChange}
//               value={payload.motherName}
//              />
//             </div>
//           ) : (
//             <div className="bg-gray-100">
//               <div className="px-5 md:max-w-[25%] w-full text-center ">
                
//                    <ReactInput
//               type="text"
//               name="parentAdmissionNumber"
//               required={true}
//               label="Parent's Admission Number"
//               onChange={handleChange}
//               value={payload.parentAdmissionNumber}
//              />
//               </div>
//             </div>
//           )}
//           <div className="mt-4 flex flex-col md:flex-row justify-center gap-2 py-2 px-1">
//             <Button
//               name="Submit"
//               type="submit"
//               loading={loading}
//               width="full"
//             />
//             <Button
//               name="Cancel"
//               color="gray"
//               loading={loading}
//               width="full"
//               onClick={toggleModal}
//             />
//           </div>
//         </form>
//       </Modal>

//       <div
//         style={{
//           display: "none",
//         }}
//       >
//         <div id="printContent">
//           <AdmissionPrint studentValues={selectStudent} />
//         </div>
//       </div>

//       {modifiedData.length > 0 ? (
//         <Table tHead={THEAD} tBody={tBody} isSearch={true} />
//       ) : (
//         <NoDataFound />
//       )}
//     </div>
//   );
// }

// export default Create_Registration_Form;



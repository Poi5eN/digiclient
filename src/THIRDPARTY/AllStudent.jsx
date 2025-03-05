// import React, { useState, useCallback, useEffect } from "react";
// import { FaEdit } from "react-icons/fa";
// import Modal from "../Dynamic/Modal";
// import { useStateContext } from "../contexts/ContextProvider";
// import DynamicFormFileds from "../Dynamic/Form/Admission/DynamicFormFields";
// import { thirdpartyadmissions, thirdpartyclasses } from "../Network/ThirdPartyApi";
// import moment from "moment";

// function AllStudent() {
//   const SchoolID = localStorage.getItem("SchoolID");
//   const [reRender, setReRender] = useState(false);
//   const { currentColor, setIsLoader } = useStateContext();
//   const [getClass, setGetClass] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [availableSections, setAvailableSections] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [student, setStudent] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedImageFilter, setSelectedImageFilter] = useState("all"); // New state for image filter

//   const handleEditClick = useCallback((studentData) => {
//     setStudent(studentData);
//     setModalOpen(true);
//   }, []);

//   const handleClassChange = (e) => {
//     const selectedClassName = e.target.value;
//     setSelectedClass(selectedClassName);
//     setSelectedSection("");

//     if (selectedClassName === "all") {
//       setAvailableSections([]);
//     } else {
//       const selectedClassObj = getClass?.find((cls) => cls.className === selectedClassName);
//       setAvailableSections(selectedClassObj ? selectedClassObj.sections.split(", ") : []);
//     }
//   };

//   const handleSectionChange = (e) => {
//     setSelectedSection(e.target.value);
//   };

//   const handleImageFilterChange = (e) => {
//     setSelectedImageFilter(e.target.value);
//   };

//   const Getclasses = async () => {
//     try {
//       setIsLoader(true);
//       const response = await thirdpartyclasses(SchoolID);
//       if (response.success) {
//         let classes = response.classList;
//         localStorage.setItem("classes", JSON.stringify(classes.sort((a, b) => a - b)));
//         setGetClass([{ className: "all", sections: "" }, ...classes.sort((a, b) => a - b)]);
//       }
//       setIsLoader(false);
//     } catch (error) {
//       console.error("Error fetching classes:", error);
//     }
//   };

//   const getStudent = async () => {
//     try {
//       setIsLoader(true);
//       const response = await thirdpartyadmissions(SchoolID);
//       if (response.success) {
//         setAllStudents(response?.data);
//         setFilteredStudents(response?.data);
//       }
//       setIsLoader(false);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     }
//   };

//   useEffect(() => {
//     getStudent();
//   }, [reRender]);

//   useEffect(() => {
//     getStudent();
//     Getclasses();
//   }, []);

//   useEffect(() => {
//     let filtered = [...allStudents];

//     if (selectedClass && selectedClass !== "all") {
//       filtered = filtered.filter((student) => student.class === selectedClass);
//     }

//     if (selectedSection) {
//       filtered = filtered.filter((student) => student.section === selectedSection);
//     }

//     if (searchTerm) {
//       const lowerCaseSearchTerm = searchTerm.toLowerCase();
//       filtered = filtered.filter((student) =>
//         student.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
//         student.admissionNumber?.toLowerCase().includes(lowerCaseSearchTerm) ||
//         (typeof student.contact === "string" && student.contact.includes(searchTerm))
//       );
//     }

//     // 🔥 Image Filter Logic
//     if (selectedImageFilter === "withImage") {
//       filtered = filtered.filter((student) => student?.studentImage?.url);
//     } else if (selectedImageFilter === "withoutImage") {
//       filtered = filtered.filter((student) => !student?.studentImage?.url);
//     }

//     setFilteredStudents(filtered);
//   }, [selectedClass, selectedSection, allStudents, searchTerm, selectedImageFilter]);

//   return (
//     <>
//       <div className="bg-gray-800 py-[1px] fixed top-0 w-full z-10" style={{ background: "#2fa7db" }}>
//         <div className="flex justify-around max-w-md mx-auto gap-1">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="bg-[#2fa7db] text-[#f0592e] border border-white rounded-md px-2 outline-none w-[40vw]"
//           />
//           <select
//             name="studentClass"
//             className="w-full border-1 bg-gray-800 border-white text-white outline-none py-[3px]"
//             value={selectedClass}
//             onChange={handleClassChange}
//           >
//             <option value="" disabled>Class</option>
//             {getClass?.map((cls, index) => (
//               <option key={index} value={cls.className}>
//                 {cls?.className === "all" ? "All Classes" : cls?.className}
//               </option>
//             ))}
//           </select>

//           <select
//             name="studentSection"
//             className="w-full border-1 border-white text-white outline-none py-[3px]"
//             value={selectedSection}
//             onChange={handleSectionChange}
//             disabled={!selectedClass || selectedClass === "all"}
//           >
//             <option value="" disabled>Section</option>
//             {availableSections?.map((item, index) => (
//               <option key={index} value={item}>{item}</option>
//             ))}
//           </select>

//           {/* 🆕 Image Filter Dropdown */}
//           <select
//             name="imageFilter"
//             className="w-full border-1 border-white text-white outline-none py-[3px]"
//             value={selectedImageFilter}
//             onChange={handleImageFilterChange}
//           >
//             <option value="all">All</option>
//             <option value="withImage">With Image</option>
//             <option value="withoutImage">Without Image</option>
//           </select>
//         </div>
//       </div>

//       <div className="container mx-auto p-4 grid md:grid-cols-3 gap-2 mt-10">
//         {filteredStudents.map((val, index) => (
//           <div key={index} className="bg-white shadow-lg rounded-lg p-4 flex justify-between">
//             <div>
//               <p>Name: {val?.fullName}</p>
//               <p>Class: {val?.class}-{val?.section}</p>
//               <p>Roll No: {val?.rollNo}</p>
//               <p>Adm No: {val.admissionNumber}</p>
//               <p>Mobile No: {val?.contact}</p>
//             </div>
//             <img
//               src={val?.studentImage?.url || "https://via.placeholder.com/100"}
//               alt="Student"
//               className="w-16 h-16 object-cover"
//             />
//           </div>
//         ))}
//         <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title="Edit">
//           <DynamicFormFileds studentData={student} buttonLabel="Update" setIsOpen={setModalOpen} setReRender={setReRender} />
//         </Modal>
//       </div>
//     </>
//   );
// }

// export default AllStudent;




import React, { useState, useCallback, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import Modal from "../Dynamic/Modal";
import { ContextProvider, useStateContext } from "../contexts/ContextProvider";
import DynamicFormFileds from "../Dynamic/Form/Admission/DynamicFormFields";
import {
  thirdpartyadmissions,
  thirdpartyclasses,
} from "../Network/ThirdPartyApi";
import moment from "moment";

function AllStudent() {
  
  const SchoolID = localStorage.getItem("SchoolID");
  const [reRender, setReRender] = useState(false);
  const { currentColor,isLoader,setIsLoader } = useStateContext();
  const [getClass, setGetClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [availableSections, setAvailableSections] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [student, setStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

console.log("getClassgetClassgetClass",getClass)
  const handleEditClick = useCallback((studentData) => {
    setStudent(studentData);
    setModalOpen(true);
  }, []);

  const handleClassChange = (e) => {
    const selectedClassName = e.target.value;
    setSelectedClass(selectedClassName);
    setSelectedSection(""); // Reset section when class changes

    if (selectedClassName === "all") {
      setAvailableSections([]); // No sections when "All Classes" is selected
    } else {
      const selectedClassObj = getClass?.find(
        (cls) => cls.className === selectedClassName
      );

      if (selectedClassObj) {
        setAvailableSections(selectedClassObj.sections.split(", "));
      } else {
        setAvailableSections([]);
      }
    }
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const Getclasses = async () => {
    try {
      setIsLoader(true);
      const response = await thirdpartyclasses(SchoolID);
      console.log("response",response)
      if (response.success) {
        let classes = response.classList;
      //  JSON.stringify(localStorage.setItem("classes",classes.sort((a, b) => a - b)))
      localStorage.setItem("classes", JSON.stringify(classes.sort((a, b) => a-b)));
        setGetClass([{ className: "all", sections: "" }, ...classes.sort((a, b) => a - b)]); // Add "All Classes" option
        setIsLoader(false);
      } else {
        console.log("error", response?.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getStudent = async () => {
    try {
      setIsLoader(true);
      const response = await thirdpartyadmissions(SchoolID);

      if (response.success) {
        setAllStudents(response?.data);
        setFilteredStudents(response?.data);
        setIsLoader(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
useEffect(()=>{
  getStudent()
},[reRender])

  useEffect(() => {
    getStudent();
    Getclasses();
  }, []);


  // useEffect(() => {
  //   let filtered = [...allStudents];

  //   if (selectedClass && selectedClass !== "all") {
  //     filtered = filtered.filter((student) => student.class === selectedClass);
  //   }

  //   if (selectedSection) {
  //     filtered = filtered.filter(
  //       (student) => student.section === selectedSection
  //     );
  //   }

  //   if (searchTerm) {
  //     const lowerCaseSearchTerm = searchTerm.toLowerCase();
  //     filtered = filtered.filter(student => {
  //       return (
  //         student.fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
  //         student.class.toLowerCase().includes(lowerCaseSearchTerm) ||
  //         student.rollNo.toString().includes(searchTerm) ||
  //         student.admissionNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
  //         student.fatherName?.toLowerCase().includes(lowerCaseSearchTerm) || //Handle null or undefined
  //         student.contact?.includes(searchTerm) ||
  //         student.address?.toLowerCase().includes(lowerCaseSearchTerm)
  //       );
  //     });
  //   }


  //   setFilteredStudents(filtered);
  // }, [selectedClass, selectedSection, allStudents, searchTerm]);

  useEffect(() => {
    let filtered = [...allStudents];

    if (selectedClass && selectedClass !== "all") {
        filtered = filtered.filter((student) => student.class === selectedClass);
    }

    if (selectedSection) {
        filtered = filtered.filter(
            (student) => student.section === selectedSection
        );
    }

    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(student => {
          return (
              student.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
              // student.class?.toLowerCase().includes(lowerCaseSearchTerm) ||
              // (typeof student.rollNo === 'number' && !isNaN(student.rollNo) && student.rollNo.toString().includes(searchTerm)) ||
              student.admissionNumber?.toLowerCase().includes(lowerCaseSearchTerm) ||
              // student.fatherName?.toLowerCase().includes(lowerCaseSearchTerm) ||
              (typeof student.contact === "string" && student.contact.includes(searchTerm))
              // student.address?.toLowerCase().includes(lowerCaseSearchTerm)
          );
      });
      
        // filtered = filtered.filter(student => {
        //     return (
        //         student.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        //         student.class?.toLowerCase().includes(lowerCaseSearchTerm) ||
        //         (typeof student.rollNo === 'number' && !isNaN(student.rollNo) && student.rollNo.toString().includes(searchTerm)) ||
        //         student.admissionNumber?.toLowerCase().includes(lowerCaseSearchTerm) ||
        //         student.fatherName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        //         student.contact?.includes(searchTerm) ||
        //         student.address?.toLowerCase().includes(lowerCaseSearchTerm)
        //     );
        // });
    }

    setFilteredStudents(filtered);
}, [selectedClass, selectedSection, allStudents, searchTerm]);
  return (
    <>
      <div
        className="bg-gray-800 py-[1px] fixed top-0 w-full  z-10"
        style={{ background: "#2fa7db" }}
      >
        <div className="flex justify-around max-w-md mx-auto gap-1">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#2fa7db] text-[#f0592e] border border-white rounded-md px-2  outline-none w-[40vw]"
          />
          <div className="flex flex-col space-y-1 ">
            <select
              name="studentClass"
              className=" w-full border-1 bg-gray-800 border-white text-white outline-none py-[3px] bg-inherit"
              onFocus={(e) => (e.target.style.borderColor = currentColor)}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              value={selectedClass}
              onChange={handleClassChange}
              required
            >
              <option value="" disabled>
                Class
              </option>
              {getClass?.map((cls, index) => (
                <option
                  key={index}
                  value={cls.className}
                  className="text-white bg-gray-800"
                >
                  {cls?.className === 'all' ? "All Classes" : cls?.className}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1 mt-[2px]">
            <select
              name="studentSection"
              className=" w-full border-1 border-white text-white outline-none py-[3px] bg-inherit"
              onFocus={(e) => (e.target.style.borderColor = currentColor)}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              value={selectedSection}
              onChange={handleSectionChange}
              required
              disabled={!selectedClass || selectedClass === "all"} // Disable if no class is selected or "All Classes" is selected
            >
              <option value="" disabled>
                Section
              </option>
              {availableSections?.map((item, index) => (
                <option key={index} value={item}
                  className="text-white bg-gray-800"
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4 grid md:grid-cols-3 gap-2 mt-10">
        {filteredStudents.map((val, index) => (
          <div
            key={index}

            className="bg-white relative shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg p-4  mb-2 flex items-center justify-between"
          >
            <div className="text-gray-700 font-semibold text-sm absolute top-2 right-2 gap-2">

              <div className="flex justify-center items-center gap-3">
                <p>
                  {val?.assignedThirdParty == null ? (<span className="bg-[#f0592e] px-1 text-white shadow-md rounded-md text-[8px]">Admin</span>) : <span className="bg-[#2fa7db] text-[8px] px-1 rounded-md shadow-md text-white">T-Party</span>}

                </p>
                <button
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                  onClick={() => handleEditClick(val)}
                >
                  <FaEdit size={20} />
                </button>
              </div>
            </div>
            <div className="">

              <div className="mb-1 ">


                <p className="text-gray-700 font-semibold text-sm">
                  Name: {val?.fullName}
                </p>
                <p className="text-gray-700 text-[12px]">Class: {val?.class}-{val?.section}</p>
                <p className="text-gray-700 text-[12px]">
                  Roll No: {val?.rollNo}
                </p>
                <p className="text-gray-700 text-[12px]">
                  Adm No:{" "}
                  <span className="text-[#ee582c] font-bold">
                    {val.admissionNumber}
                  </span>
                </p>
                <p className="text-gray-700 text-[12px]">
                  Father Name: {val?.udisePlusDetails?.father_name || "N/A"}
                  {/* Father Name: {val?.fatherName || "N/A"} */}
                </p>
                <p className="text-gray-700 text-[12px]">
                  Mobile No: {val?.contact}
                </p>
                <p className="text-gray-700 text-[12px]">
                  DOB: {moment(val?.dateOfBirth).format("DD-MMM-YYYY")}
                </p>
                <p className="text-gray-700 text-[12px]">
                  Address: {val?.address}
                </p>
              </div>
            </div>
            <div className="flex items-center border">
              <div className="border-1 border-cyan-500 p-[1px] w-[67px] h-[67px]">
                <img
                  src={val?.studentImage?.url || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"}
                  alt="val"
                  className="rounded-sm w-16 h-16 object-cover"
                />
              </div>
            </div>

          </div>
        ))}

        <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`Edit`}>
          <DynamicFormFileds studentData={student} buttonLabel={"Update"} setIsOpen={setModalOpen} setReRender={setReRender} />
        </Modal>
      </div>
    </>
  );
}

export default AllStudent;



// import React, { useState, useCallback, useEffect } from "react";
// import { FaEdit } from "react-icons/fa";
// import Modal from "../Dynamic/Modal";
// import { useStateContext } from "../contexts/ContextProvider";
// import DynamicFormFileds from "../Dynamic/Form/Admission/DynamicFormFields";
// import {
//   thirdpartyadmissions,
//   thirdpartyclasses,
// } from "../Network/ThirdPartyApi";

// function AllStudent() {
//   const SchoolID = localStorage.getItem("SchoolID");
//    const [reRender, setReRender] = useState(false);
//   const { currentColor } = useStateContext();
//   const [getClass, setGetClass] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [availableSections, setAvailableSections] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [student, setStudent] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingIndex, setEditingIndex] = useState(null);

//   const handleEditClick = useCallback((studentData) => {
//     setStudent(studentData);
//     setModalOpen(true);
//   }, []);

//   const handleClassChange = (e) => {
//     const selectedClassName = e.target.value;
//     setSelectedClass(selectedClassName);
//     setSelectedSection(""); // Reset section when class changes

//     if (selectedClassName === "all") {
//       setAvailableSections([]); // No sections when "All Classes" is selected
//     } else {
//       const selectedClassObj = getClass?.find(
//         (cls) => cls.className === selectedClassName
//       );

//       if (selectedClassObj) {
//         setAvailableSections(selectedClassObj.sections.split(", "));
//       } else {
//         setAvailableSections([]);
//       }
//     }
//   };

//   const handleSectionChange = (e) => {
//     setSelectedSection(e.target.value);
//   };

//   const Getclasses = async () => {
//     try {
//       const response = await thirdpartyclasses(SchoolID);
//       if (response.success) {
//         let classes = response.classList;
//         setGetClass([{ className: "all", sections: "" }, ...classes.sort((a, b) => a - b)]); // Add "All Classes" option
//       } else {
//         console.log("error", response?.message);
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   const getStudent = async () => {
//     try {
//       const response = await thirdpartyadmissions(SchoolID);

//       if (response.success) {
//         setAllStudents(response?.data);
//         setFilteredStudents(response?.data);
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };
//   localStorage.setItem("classes", JSON.stringify(getClass));
//   const clas = JSON.parse(localStorage.getItem("classes"));
// console.log("clas", clas);
//   // localStorage.setItem("classes",getClass)
//   // let clas= localStorage.getItem("classes");
//   // console.log("clas",clas)
//   useEffect(() => {
//     getStudent();
//    setReRender(false)
//   }, [reRender]);
//   useEffect(() => {
//     getStudent();
//     Getclasses();
//   }, []);

//   useEffect(() => {
//     let filtered = [...allStudents];

//     if (selectedClass && selectedClass !== "all") {
//       filtered = filtered.filter((student) => student.class === selectedClass);
//     }

//     if (selectedSection) {
//       filtered = filtered.filter(
//         (student) => student.section === selectedSection
//       );
//     }

//     setFilteredStudents(filtered);
//   }, [selectedClass, selectedSection, allStudents]);


//   return (
//     <>
//       <div
//         className="bg-gray-800 py-[1px] fixed top-0 w-full  z-10"
//         style={{ background: "#f0592e" }}
//       >
//         <div className="flex justify-around max-w-md mx-auto">
//           <input type="text" />
//           <div className="flex flex-col space-y-1 ">
//             <select
//               name="studentClass"
//               className=" w-full border-1 bg-gray-800 border-white text-white outline-none py-[3px] bg-inherit"
//               onFocus={(e) => (e.target.style.borderColor = currentColor)}
//               onBlur={(e) => (e.target.style.borderColor = "#ccc")}
//               value={selectedClass}
//               onChange={handleClassChange}
//               required
//             >
//               <option value="" disabled>
//                 Class
//               </option>
//               {getClass?.map((cls, index) => (
//                 <option
//                   key={index}
//                   value={cls.className}
//                   className="text-white bg-gray-800"
//                 >
//                   {cls?.className === 'all' ? "All Classes" : cls?.className}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex flex-col space-y-1 mt-[2px]">
//             <select
//               name="studentSection"
//               className=" w-full border-1 border-white text-white outline-none py-[3px] bg-inherit"
//               onFocus={(e) => (e.target.style.borderColor = currentColor)}
//               onBlur={(e) => (e.target.style.borderColor = "#ccc")}
//               value={selectedSection}
//               onChange={handleSectionChange}
//               required
//               disabled={!selectedClass || selectedClass === "all"} // Disable if no class is selected or "All Classes" is selected
//             >
//               <option value="" disabled>
//                 Section
//               </option>
//               {availableSections?.map((item, index) => (
//                 <option key={index} value={item}
//                  className="text-white bg-gray-800"
//                 >
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//       <div className="container mx-auto p-4 grid md:grid-cols-3 gap-2 mt-10">
//         {filteredStudents.map((val, index) => (
//           <div
//             key={index}
            
//             className="bg-white relative shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg p-4  mb-2 flex items-center justify-between"
//           >
//             <div className="text-gray-700 font-semibold text-sm absolute top-2 right-2 gap-2">

// <div className="flex justify-center items-center gap-3">
// <p>
// {val?.assignedThirdParty==null ?(<span className="bg-[#f0592e] px-1 text-white shadow-md rounded-md">Admin</span>):<span className="bg-[#2fa7db] px-1 rounded-md shadow-md text-white">T-Party</span>}

// </p>
//           <button
//               className="text-blue-500 hover:text-blue-700 focus:outline-none"
//               onClick={() => handleEditClick(val)}
//             >
//               <FaEdit size={20} />
//             </button>
// </div>
//          </div>
//             <div className="">
            
//               <div className="mb-1 ">

               
//                 <p className="text-gray-700 font-semibold text-sm">
//                   Name: {val?.fullName}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">Class: {val.class}</p>
//                 <p className="text-gray-700 text-[12px]">
//                   Roll No: {val.rollNo}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Adm No:{" "}
//                   <span className="text-[#ee582c] font-bold">
//                     {val.admissionNumber}
//                   </span>
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Father Name: {val.fatherName || "N/A"}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Mobile No: {val.contact}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Address: {val.address}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center border">
//               <div className="mr-4 ">
//                 <img
//                   src={val?.photo ||"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png" }
//                   alt="val"
//                   className="rounded-sm w-24 h-24 object-cover"
//                 />
//               </div>
//             </div>
           
//           </div>
//         ))}

//         <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`Edit`}>
//           <DynamicFormFileds studentData={student} buttonLabel={"Update"}  setIsOpen={setModalOpen} setReRender={setReRender} />
//         </Modal>
//       </div>
//     </>
//   );
// }

// export default AllStudent;


// import React, { useState, useCallback, useEffect } from "react";
// import { FaEdit } from "react-icons/fa"; // Import edit icon
// import Modal from "../Dynamic/Modal";
// import { useStateContext } from "../contexts/ContextProvider";
// import DynamicFormFileds from "../Dynamic/Form/Admission/DynamicFormFields";
// import {
//   thirdpartyadmissions,
//   thirdpartyclasses,
// } from "../Network/ThirdPartyApi";

// function AllStudent() {
//   const SchoolID = localStorage.getItem("SchoolID");
//   const { currentColor } = useStateContext();
//   const [getClass, setGetClass] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [availableSections, setAvailableSections] = useState([]);
//   const [allStudents, setAllStudents] = useState([]); // Store all fetched students
//   const [filteredStudents, setFilteredStudents] = useState([]); // Students after filtering
//   const [student, setStudent] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingIndex, setEditingIndex] = useState(null);

//   const handleEditClick = useCallback((studentData) => {
//     setStudent(studentData);
//     setModalOpen(true);
//   }, []);

//   const handleClassChange = (e) => {
//     const selectedClassName = e.target.value;
//     setSelectedClass(selectedClassName);
//     setSelectedSection(""); // Reset section when class changes
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
//     setSelectedSection(e.target.value);
//   };

//   const Getclasses = async () => {
//     try {
//       const response = await thirdpartyclasses(SchoolID);
//       if (response.success) {
//         let classes = response.classList;
//         setGetClass(classes.sort((a, b) => a - b));
//       } else {
//         console.log("error", response?.message);
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   const getStudent = async () => {
//     try {
//       const response = await thirdpartyadmissions(SchoolID);

//       if (response.success) {
//         setAllStudents(response?.data);
//         setFilteredStudents(response?.data);
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   useEffect(() => {
//     getStudent();
//     Getclasses();
//   }, []);

//   useEffect(() => {
//     // Filter students whenever selectedClass or selectedSection changes
//     let filtered = [...allStudents];

//     if (selectedClass) {
//       filtered = filtered.filter((student) => student.class === selectedClass);
//     }

//     if (selectedSection) {
//       filtered = filtered.filter(
//         (student) => student.section === selectedSection
//       );
//     }

//     setFilteredStudents(filtered);
//   }, [selectedClass, selectedSection, allStudents]);


//   return (
//     <>
//       <div
//         className="bg-gray-800 p-2 fixed top-0 w-full"
//         style={{ background: "#f0592e" }}
//       >
//         <div className="flex justify-around max-w-md mx-auto">
//           <input type="text" />
//           <div className="flex flex-col space-y-1 mt-[2px]">
//             <select
//               name="studentClass"
//               className=" w-full border-1 bg-gray-800 border-white text-white outline-none py-[3px] bg-inherit"
//               onFocus={(e) => (e.target.style.borderColor = currentColor)}
//               onBlur={(e) => (e.target.style.borderColor = "#ccc")}
//               value={selectedClass}
//               onChange={handleClassChange}
//               required
//             >
//               <option value="" disabled>
//                 Class
//               </option>
//               {getClass?.map((cls, index) => (
//                 <option
//                   key={index}
//                   value={cls.className}
//                   className="text-white bg-gray-800"
//                 >
//                   {cls?.className}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex flex-col space-y-1 mt-[2px]">
//             <select
//               name="studentSection"
//               className=" w-full border-1 border-white text-white outline-none py-[3px] bg-inherit"
//               onFocus={(e) => (e.target.style.borderColor = currentColor)}
//               onBlur={(e) => (e.target.style.borderColor = "#ccc")}
//               value={selectedSection}
//               onChange={handleSectionChange}
//               required
//               disabled={!selectedClass} // Disable if no class is selected
//             >
//               <option value="" disabled>
//                 Section
//               </option>
//               {availableSections?.map((item, index) => (
//                 <option key={index} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//       <div className="container mx-auto p-4 grid md:grid-cols-3 gap-2 mt-10">
//         {filteredStudents.map((val, index) => (
//           <div
//             key={index}
//             className="bg-white shadow-md rounded-lg p-4  mb-2 flex items-center justify-between"
//           >
//             <div>
//               <div className="mb-1">
//                 <p className="text-gray-700 font-semibold text-sm">
//                   Name: {val?.fullName}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">Class: {val.class}</p>
//                 <p className="text-gray-700 text-[12px]">
//                   Roll No: {val.rollNo}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Adm No:{" "}
//                   <span className="text-[#ee582c] font-bold">
//                     {val.admissionNumber}
//                   </span>
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Father Name: {val.fatherName || "N/A"}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Mobile No: {val.contact}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Address: {val.address}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <div className="mr-4">
//                 <img
//                   src={val.photo}
//                   alt="val"
//                   className="rounded-sm w-24 h-24 object-cover"
//                 />
//               </div>
//             </div>
//             <button
//               className="text-blue-500 hover:text-blue-700 focus:outline-none"
//               onClick={() => handleEditClick(val)}
//             >
//               <FaEdit size={20} />
//             </button>
//           </div>
//         ))}

//         <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`Edit`}>
//           <DynamicFormFileds studentData={student} buttonLabel={"Update"} />
//         </Modal>
//       </div>
//     </>
//   );
// }

// export default AllStudent;



// import React, { useState, useCallback, useEffect } from "react";
// import { FaEdit } from "react-icons/fa"; // Import edit icon
// import Modal from "../Dynamic/Modal";
// import { useStateContext } from "../contexts/ContextProvider";
// import DynamicFormFileds from "../Dynamic/Form/Admission/DynamicFormFields";
// import { thirdpartyadmissions, thirdpartyclasses, ThirdpartyGetAllStudent } from "../Network/ThirdPartyApi";
// function AllStudent() {
//   const SchoolID=localStorage.getItem("SchoolID")

//   const { currentColor } = useStateContext();
//   const [getClass, setGetClass] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [availableSections, setAvailableSections] = useState([]);
//   const [student, setStudent] = useState([]);
//   const [values, setValues] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const handleEditClick = useCallback((index) => {
//     setEditingIndex(index);
//     setStudent(index)
//     setModalOpen(true);
//   }, []);
//   useEffect(() => {
//     if (editingIndex !== null) {
//     }
//   }, [editingIndex]);

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

//   const Getclasses = async () => {
//     try {
//       const response = await thirdpartyclasses(SchoolID);
//       if (response.success) {
//         let classes = response.classList;
//         console.log("response class",response)
//         setGetClass(classes.sort((a, b) => a - b));
//       }
//      else{
//       console.log("error",response?.message)
//      }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };
//   const getStudent = async () => {
//     try {
//       const response = await thirdpartyadmissions(SchoolID);

//       if (response.success) {
//         setValues(response?.data);
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };
//   useEffect(() => {
//     getStudent();
//     Getclasses()
//   }, []);
// console.log("getClass",getClass)
//   return (
//     <>
//       <div
//         className="bg-gray-800 p-2 fixed top-0 w-full"
//         style={{ background: "#f0592e" }}
//       >
//         <div className="flex justify-around max-w-md mx-auto">
//           <input type="text" />
//           <div className="flex flex-col space-y-1 mt-[2px]">
//             <select
//               name="studentClass"
//               className=" w-full border-1 bg-gray-800 border-white text-white outline-none py-[3px] bg-inherit"
//               onFocus={(e) => (e.target.style.borderColor = currentColor)}
//               onBlur={(e) => (e.target.style.borderColor = "#ccc")}
//               value={selectedClass}
//               onChange={handleClassChange}
//               required
//             >
//               <option value="" disabled>
//                 Class
//               </option>
//               {getClass?.map((cls, index) => (
//                 <option key={index} value={cls.className} className="text-white bg-gray-800">
//                   {cls?.className}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex flex-col space-y-1 mt-[2px]">
//             <select
//               name="studentSection"
//               className=" w-full border-1 border-white text-white outline-none py-[3px] bg-inherit"
//               onFocus={(e) => (e.target.style.borderColor = currentColor)}
//               onBlur={(e) => (e.target.style.borderColor = "#ccc")}
//               value={selectedClass}
//               onChange={handleClassChange}
//               required
//             >
//               <option value="" disabled>
//                 Section
//               </option>
//               {availableSections?.map((item, index) => (
//                 <option key={index} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//       <div className="container mx-auto p-4 grid md:grid-cols-3 gap-2 mt-10">
//         {values.map((val, index) => (
//           <div
//             key={index}
//             className="bg-white shadow-md rounded-lg p-4  mb-2 flex items-center justify-between"
//           >
//             <div>
//               <div className="mb-1">
//                 <p className="text-gray-700 font-semibold text-sm">
//                   Name: {val?.fullName}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">Class: {val.class}</p>
//                 <p className="text-gray-700 text-[12px]">
//                   Roll No: {val.rollNo}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Adm No:{" "}
//                   <span className="text-[#ee582c] font-bold">
//                     {val.admissionNumber}
//                   </span>
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Father Name: {val.fatherName || "N/A"}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Mobile No: {val.contact}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Address: {val.address}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <div className="mr-4">
//                 <img
//                   src={val.photo}
//                   alt="val"
//                   className="rounded-sm w-24 h-24 object-cover"
//                 />
//               </div>
//             </div>
//             <button
//               className="text-blue-500 hover:text-blue-700 focus:outline-none"
//               onClick={() => handleEditClick(val)}
//             >
//               <FaEdit size={20} />
//             </button>
//           </div>
//         ))}

//         <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`Edit`}>
//           <DynamicFormFileds
//            studentData={student}
//            buttonLabel={'Update'}
//            />

         
//         </Modal>
//       </div>
//     </>
//   );
// }

// export default AllStudent;



// import React, { useState, useCallback, useEffect } from "react";
// import { FaEdit } from "react-icons/fa"; // Import edit icon
// import Modal from "../Dynamic/Modal";
// import axios from "axios";
// import { useStateContext } from "../contexts/ContextProvider";
// import Cookies from "js-cookie";
// import DynamicFormFileds from "../Dynamic/Form/Admission/DynamicFormFields";
// import { ThirdpartyGetAllStudent } from "../Network/ThirdPartyApi";
// function AllStudent() {
//   const authToken = Cookies.get("token");
//   const [loading, setLoading] = useState(false);
//   const { currentColor } = useStateContext();
//   const [getClass, setGetClass] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [availableSections, setAvailableSections] = useState([]);
//   const [student, setStudent] = useState([]);
//   const [values, setValues] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingIndex, setEditingIndex] = useState(null);

//   const handleEditClick = useCallback((index) => {
//     setEditingIndex(index);
//     setValues(index);
//     setModalOpen(true);
//   }, []);
//   useEffect(() => {
//     if (editingIndex !== null) {
//     }
//   }, [editingIndex]);

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

//   useEffect(() => {
//     axios
//       .get(
//         `https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllClasses`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         let classes = response.data.classList;

//         setGetClass(classes.sort((a, b) => a - b));
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, []);

//   const getStudent = async () => {
//     try {
//       const response = await ThirdpartyGetAllStudent();
//       if (response.success) {
//         setValues(response?.data);
//       }
//       console.log("response", response);
//       // const student = response.data.student
//     } catch (error) {
//       console.log("error", error);
//     }
//   };
//   useEffect(() => {
//     getStudent();
//   }, []);

//   return (
//     <>
//       <div
//         className="bg-gray-800 p-2 fixed top-0 w-full"
//         style={{ background: "#f0592e" }}
//       >
//         <div className="flex justify-around max-w-md mx-auto">
//           <input type="text" />
//           <div className="flex flex-col space-y-1 mt-[2px]">
//             <select
//               name="studentClass"
//               className=" w-full border-1 border-white text-white outline-none py-[3px] bg-inherit"
//               onFocus={(e) => (e.target.style.borderColor = currentColor)}
//               onBlur={(e) => (e.target.style.borderColor = "#ccc")}
//               value={selectedClass}
//               onChange={handleClassChange}
//               required
//             >
//               <option value="" disabled>
//                 Class
//               </option>
//               {getClass?.map((cls, index) => (
//                 <option key={index} value={cls.className}>
//                   {cls?.className}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex flex-col space-y-1 mt-[2px]">
//             <select
//               name="studentSection"
//               className=" w-full border-1 border-white text-white outline-none py-[3px] bg-inherit"
//               onFocus={(e) => (e.target.style.borderColor = currentColor)}
//               onBlur={(e) => (e.target.style.borderColor = "#ccc")}
//               value={selectedClass}
//               onChange={handleClassChange}
//               required
//             >
//               <option value="" disabled>
//                 Section
//               </option>
//               {availableSections?.map((item, index) => (
//                 <option key={index} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//       <div className="container mx-auto p-4 grid md:grid-cols-3 gap-2 mt-10">
//         {values.map((val, index) => (
//           <div
//             key={index}
//             className="bg-white shadow-md rounded-lg p-4  mb-2 flex items-center justify-between"
//           >
//             <div>
//               <div className="mb-1">
//                 <p className="text-gray-700 font-semibold text-sm">
//                   Name: {val?.fullName}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">Class: {val.class}</p>
//                 <p className="text-gray-700 text-[12px]">
//                   Roll No: {val.rollNo}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Adm No:{" "}
//                   <span className="text-[#ee582c] font-bold">
//                     {val.admissionNumber}
//                   </span>
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Father Name: {val.fatherName || "N/A"}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Mobile No: {val.contact}
//                 </p>
//                 <p className="text-gray-700 text-[12px]">
//                   Address: {val.address}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <div className="mr-4">
//                 <img
//                   src={val.photo}
//                   alt="val"
//                   className="rounded-sm w-24 h-24 object-cover"
//                 />
//               </div>
//             </div>
//             <button
//               className="text-blue-500 hover:text-blue-700 focus:outline-none"
//               onClick={() => handleEditClick(val)}
//             >
//               <FaEdit size={20} />
//             </button>
//           </div>
//         ))}

//         <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`Edit`}>
//           <DynamicFormFileds student={student} setStudent={setStudent} />

//           <div className="px-4  shadow-xl bg-wh ">
//             <button
//               className="w-full bg-[#2fa7db] text-white  rounded-md mb-5 py-2 "
//               // onClick={handleSaveClick}
//               disabled={loading}
//             >
//               {loading ? "Updating..." : "Update"}
//             </button>
//           </div>
//         </Modal>
//       </div>
//     </>
//   );
// }

// export default AllStudent;

// import React, { useState, useCallback, useEffect } from 'react';
// import Cropper from 'react-easy-crop';
// import getCroppedImg from './getCroppedImg';
// import { FaEdit } from 'react-icons/fa'; // Import edit icon

// // Modal component (as before)
// const Modal = ({ isOpen, setIsOpen, title, children, onSave, onCancel }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
//             <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//                 <div className="mt-3 text-center">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
//                     <div className="mt-2 px-7 py-3">
//                         {children}
//                     </div>
//                     <div className="items-center px-4 py-3">
//                         <button
//                             className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 mr-2"
//                             onClick={onSave} // Call the onSave function
//                         >
//                             Submit
//                         </button>
//                         <button
//                             className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                             onClick={onCancel}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// function AllStudent() {
//     // Initial array of 10 student data objects
//     const initialStudents = Array(10).fill({
//         photo: 'https://via.placeholder.com/150', // Default placeholder image
//         name: 'John Doe',
//         class: '10th',
//         rollNo: '12345',
//         admissionNo: '67890',
//         fatherName: 'Mr. Smith',
//         mobileNo: '9876543210',
//         address: '123 Main Street, Anytown',
//         guardianName: '',
//         remarks: '',
//         transport: '',
//         motherName: '',
//         motherPhoto: null,
//         fatherPhoto: null,
//         guardianPhoto: null,
//     });

//     const [students, setStudents] = useState(initialStudents);

//     // State for the modal
//     const [modalOpen, setModalOpen] = useState(false);

//     // State to track the currently editing student index
//     const [editingIndex, setEditingIndex] = useState(null);

//     // State for the image cropping
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//     const [croppedImageSource, setCroppedImageSource] = useState(null); // Use this for the Cropper

//     // New State added to identify the current Photo being changed
//     const [currentPhotoField, setCurrentPhotoField] = useState(null);
//     const [isEditingPhoto, setIsEditingPhoto] = useState(false); // New state to track photo editing
//     const [photoInputValue, setPhotoInputValue] = useState(''); // Store the photo input value

//     // Wrap state updates with useCallback
//     const setStudentsCallback = useCallback(setStudents, []);
//     const setCroppedImageSourceCallback = useCallback(setCroppedImageSource, []);
//     const setCurrentPhotoFieldCallback = useCallback(setCurrentPhotoField, []);

//     // Function to handle input field changes (for the currently edited student)
//     const handleInputChange = useCallback((e) => {
//         const { name, value } = e.target;
//         setStudentsCallback(prevStudents =>
//             prevStudents.map((student, index) =>
//                 index === editingIndex ? { ...student, [name]: value } : student
//             )
//         );
//     }, [editingIndex, setStudentsCallback]);

//     // Function to handle photo input changes (for the currently edited student)
//     const handlePhotoChange = useCallback((e, photoField) => {
//         const { files } = e.target;
//         setCurrentPhotoFieldCallback(photoField);
//         setIsEditingPhoto(true);
//         setPhotoInputValue(e.target.value); // Store the file input value
//         if (files && files[0]) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setCroppedImageSourceCallback(reader.result);
//             };
//             reader.readAsDataURL(files[0]);
//         }
//     }, [setCroppedImageSourceCallback, setCurrentPhotoFieldCallback]);

//     const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//         setCroppedAreaPixels(croppedAreaPixels);
//     }, []);

//     const showCroppedImage = useCallback(async () => {
//         try {
//             if (!croppedImageSource || !croppedAreaPixels) {
//                 console.error("Cannot crop image: imageSrc or croppedAreaPixels is missing.");
//                 return;
//             }

//             const croppedImageURL = await getCroppedImg(croppedImageSource, croppedAreaPixels);

//             setCroppedImageSourceCallback(null); // Hide the Cropper
//             setStudentsCallback(prevStudents =>
//                 prevStudents.map((student, index) =>
//                     index === editingIndex ? { ...student, [currentPhotoField]: croppedImageURL } : student
//                 )
//             );
//             setCurrentPhotoFieldCallback(null);
//             setIsEditingPhoto(false); // Reset photo editing flag
//             setPhotoInputValue(''); // Clear the input value

//         } catch (error) {
//             console.error("Error cropping image:", error);
//         }
//     }, [croppedAreaPixels, croppedImageSource, editingIndex, currentPhotoField, setStudentsCallback, setCurrentPhotoFieldCallback, setCroppedImageSourceCallback]);

//     const cancelCrop = useCallback(() => {
//         setCroppedImageSource(null);
//         setIsEditingPhoto(false);
//         setPhotoInputValue('');
//     }, [setCroppedImageSource]);

//     // Function to open the modal and set the editing index
//     const handleEditClick = useCallback((index) => {
//         setEditingIndex(index);
//         setModalOpen(true);
//     }, []);

//     // Function to submit the changes and close the modal
//     const handleSubmitClick = useCallback(() => {
//         setModalOpen(false);
//         setEditingIndex(null);
//         setIsEditingPhoto(false);
//         setPhotoInputValue(''); // Clear the photo input value

//         //persist the data to state
//         console.log("Submitted students data:", students);
//     }, [students]);

//     // Function to cancel the changes and close the modal
//     const handleCancelClick = useCallback(() => {
//         setModalOpen(false);
//         setEditingIndex(null);
//         setIsEditingPhoto(false);
//         setPhotoInputValue(''); // Clear the photo input value
//         // Optionally, revert changes made in the modal
//     }, []);

//     // Set initial values in the modal when it opens
//     useEffect(() => {
//         if (editingIndex !== null) {
//             // No need to set values here directly as they are already being set via the `value` prop in the inputs.
//         }
//     }, [editingIndex]);

//     return (
//         <div className="container mx-auto p-4">
//             {students.map((student, index) => (
//                 <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between">
//                     <div>
//                         <div className="mb-2">
//                             <p className="text-gray-700 font-semibold">Name: {student.name}</p>
//                             <p className="text-gray-700">Class: {student.class}</p>
//                             <p className="text-gray-700">Roll No: {student.rollNo}</p>
//                             <p className="text-gray-700">Adm No: {student.admissionNo}</p>
//                             <p className="text-gray-700">Father Name: {student.fatherName}</p>
//                             <p className="text-gray-700">Mobile No: {student.mobileNo}</p>
//                             <p className="text-gray-700">Address: {student.address}</p>
//                         </div>
//                     </div>
//                     <div className="flex items-center">
//                         <div className="mr-4">
//                             <img src={student.photo} alt="Student" className="rounded-sm w-24 h-24 object-cover" />
//                         </div>
//                         {/* Edit Icon Button */}
//                         <button
//                             className="text-blue-500 hover:text-blue-700 focus:outline-none"
//                             onClick={() => handleEditClick(index)}
//                         >
//                             <FaEdit size={20} />
//                         </button>
//                     </div>
//                 </div>
//             ))}

//             <Modal
//                 isOpen={modalOpen}
//                 setIsOpen={setModalOpen}
//                 title="Edit Student Information"
//                 onSave={handleSubmitClick} // Pass the save function
//                 onCancel={handleCancelClick} // Pass the cancel function
//             >
//                 {/* Content of the modal (additional fields) */}
//                 {editingIndex !== null && (
//                     <div className="mt-4">
//                         {croppedImageSource ? (
//                             <div className='relative w-full aspect-square'>
//                                 <Cropper
//                                     image={croppedImageSource}
//                                     crop={crop}
//                                     zoom={zoom}
//                                     aspect={1}
//                                     onCropChange={setCrop}
//                                     onZoomChange={setZoom}
//                                     onCropComplete={onCropComplete}
//                                 />
//                                 <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4'>
//                                     <button
//                                         onClick={cancelCrop}
//                                         className='bg-red-500 text-white py-2 px-4 rounded'>
//                                         Cancel Crop
//                                     </button>
//                                     <button
//                                         onClick={showCroppedImage}
//                                         className='bg-blue-500 text-white py-2 px-4 rounded'>
//                                         Crop Image
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <>
//                                 {/* Name */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//                                         Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="name"
//                                         name="name"
//                                         type="text"
//                                         placeholder="Name"
//                                         value={students[editingIndex].name}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                                 {/* Class */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class">
//                                         Class:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="class"
//                                         name="class"
//                                         type="text"
//                                         placeholder="Class"
//                                         value={students[editingIndex].class}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Roll No */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rollNo">
//                                         Roll No:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="rollNo"
//                                         name="rollNo"
//                                         type="text"
//                                         placeholder="Roll No"
//                                         value={students[editingIndex].rollNo}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Admission No */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="admissionNo">
//                                         Admission No:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="admissionNo"
//                                         name="admissionNo"
//                                         type="text"
//                                         placeholder="Admission No"
//                                         value={students[editingIndex].admissionNo}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Father Name */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fatherName">
//                                         Father Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="fatherName"
//                                         name="fatherName"
//                                         type="text"
//                                         placeholder="Father Name"
//                                         value={students[editingIndex].fatherName}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Mobile No */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNo">
//                                         Mobile No:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="mobileNo"
//                                         name="mobileNo"
//                                         type="text"
//                                         placeholder="Mobile No"
//                                         value={students[editingIndex].mobileNo}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Address */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
//                                         Address:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="address"
//                                         name="address"
//                                         type="text"
//                                         placeholder="Address"
//                                         value={students[editingIndex].address}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Student Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
//                                         Student Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="photo"
//                                         name="photo"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'photo')}
//                                         value={isEditingPhoto ? photoInputValue : ''}
//                                     />
//                                     {students[editingIndex].photo && !croppedImageSource && (
//                                         <img
//                                             src={students[editingIndex].photo}
//                                             alt="Student"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>

//                                 {/* Guardian Name */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardianName">
//                                         Guardian Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="guardianName"
//                                         name="guardianName"
//                                         type="text"
//                                         placeholder="Guardian Name"
//                                         value={students[editingIndex].guardianName}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Transport */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
//                                         Transport:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="transport"
//                                         name="transport"
//                                         type="text"
//                                         placeholder="Transport"
//                                         value={students[editingIndex].transport}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Mother Name */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motherName">
//                                         Mother Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="motherName"
//                                         name="motherName"
//                                         type="text"
//                                         placeholder="Mother Name"
//                                         value={students[editingIndex].motherName}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Mother Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motherPhoto">
//                                         Mother Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="motherPhoto"
//                                         name="motherPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'motherPhoto')}
//                                         value={isEditingPhoto ? photoInputValue : ''}
//                                     />
//                                     {students[editingIndex].motherPhoto && !croppedImageSource && (
//                                         <img
//                                             src={students[editingIndex].motherPhoto}
//                                             alt="Mother"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>

//                                 {/* Father Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fatherPhoto">
//                                         Father Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="fatherPhoto"
//                                         name="fatherPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'fatherPhoto')}
//                                         value={isEditingPhoto ? photoInputValue : ''}

//                                     />
//                                     {students[editingIndex].fatherPhoto && !croppedImageSource && (
//                                         <img
//                                             src={students[editingIndex].fatherPhoto}
//                                             alt="Father"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>

//                                 {/* Guardian Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardianPhoto">
//                                         Guardian Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="guardianPhoto"
//                                         name="guardianPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'guardianPhoto')}
//                                         value={isEditingPhoto ? photoInputValue : ''}

//                                     />
//                                     {students[editingIndex].guardianPhoto && !croppedImageSource && (
//                                         <img
//                                             src={students[editingIndex].guardianPhoto}
//                                             alt="Guardian"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// }

// export default AllStudent;

// import React, { useState, useCallback, useEffect } from 'react';
// import Cropper from 'react-easy-crop';
// import getCroppedImg from './getCroppedImg';
// import { FaEdit } from 'react-icons/fa'; // Import edit icon

// // Modal component (as before)
// const Modal = ({ isOpen, setIsOpen, title, children, onSave }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
//             <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//                 <div className="mt-3 text-center">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
//                     <div className="mt-2 px-7 py-3">
//                         {children}
//                     </div>
//                     <div className="items-center px-4 py-3">
//                         <button
//                             className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 mr-2"
//                             onClick={onSave} // Call the onSave function
//                         >
//                             Save
//                         </button>
//                         <button
//                             className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                             onClick={() => setIsOpen(false)}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// function AllStudent() {
//     // Initial array of 10 student data objects
//     const initialStudents = Array(10).fill({
//         photo: 'https://via.placeholder.com/150', // Default placeholder image
//         name: 'John Doe',
//         class: '10th',
//         rollNo: '12345',
//         admissionNo: '67890',
//         fatherName: 'Mr. Smith',
//         mobileNo: '9876543210',
//         address: '123 Main Street, Anytown',
//         guardianName: '',
//         remarks: '',
//         transport: '',
//         motherName: '',
//         motherPhoto: null,
//         fatherPhoto: null,
//         guardianPhoto: null,
//     });

//     const [students, setStudents] = useState(initialStudents);

//     // State for the modal
//     const [modalOpen, setModalOpen] = useState(false);

//     // State to track the currently editing student index
//     const [editingIndex, setEditingIndex] = useState(null);

//     // State for the image cropping
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//     const [croppedImageSource, setCroppedImageSource] = useState(null); // Use this for the Cropper

//     // New State added to identify the current Photo being changed
//     const [currentPhotoField, setCurrentPhotoField] = useState(null);
//     const [isEditingPhoto, setIsEditingPhoto] = useState(false); // New state to track photo editing
//     const [photoInputValue, setPhotoInputValue] = useState(''); // Store the photo input value

//     // Wrap state updates with useCallback
//     const setStudentsCallback = useCallback(setStudents, []);
//     const setCroppedImageSourceCallback = useCallback(setCroppedImageSource, []);
//     const setCurrentPhotoFieldCallback = useCallback(setCurrentPhotoField, []);

//     // Function to handle input field changes (for the currently edited student)
//     const handleInputChange = useCallback((e) => {
//         const { name, value } = e.target;
//         setStudentsCallback(prevStudents =>
//             prevStudents.map((student, index) =>
//                 index === editingIndex ? { ...student, [name]: value } : student
//             )
//         );
//     }, [editingIndex, setStudentsCallback]);

//     // Function to handle photo input changes (for the currently edited student)
//     const handlePhotoChange = useCallback((e, photoField) => {
//         const { files } = e.target;
//         setCurrentPhotoFieldCallback(photoField);
//         setIsEditingPhoto(true);
//         setPhotoInputValue(e.target.value); // Store the file input value
//         if (files && files[0]) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setCroppedImageSourceCallback(reader.result);
//             };
//             reader.readAsDataURL(files[0]);
//         }
//     }, [setCroppedImageSourceCallback, setCurrentPhotoFieldCallback]);

//     const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//         setCroppedAreaPixels(croppedAreaPixels);
//     }, []);

//     const showCroppedImage = useCallback(async () => {
//         try {
//             if (!croppedImageSource || !croppedAreaPixels) {
//                 console.error("Cannot crop image: imageSrc or croppedAreaPixels is missing.");
//                 return;
//             }

//             const croppedImageURL = await getCroppedImg(croppedImageSource, croppedAreaPixels);

//             setCroppedImageSourceCallback(null); // Hide the Cropper
//             setStudentsCallback(prevStudents =>
//                 prevStudents.map((student, index) =>
//                     index === editingIndex ? { ...student, [currentPhotoField]: croppedImageURL } : student
//                 )
//             );
//             setCurrentPhotoFieldCallback(null);
//             setIsEditingPhoto(false); // Reset photo editing flag
//             setPhotoInputValue(''); // Clear the input value

//         } catch (error) {
//             console.error("Error cropping image:", error);
//         }
//     }, [croppedAreaPixels, croppedImageSource, editingIndex, currentPhotoField, setStudentsCallback, setCurrentPhotoFieldCallback, setCroppedImageSourceCallback]);

//     const cancelCrop = useCallback(() => {
//         setCroppedImageSource(null);
//         setIsEditingPhoto(false);
//         setPhotoInputValue('');
//     }, [setCroppedImageSource]);

//     // Function to open the modal and set the editing index
//     const handleEditClick = useCallback((index) => {
//         setEditingIndex(index);
//         setModalOpen(true);
//     }, []);

//     // Function to save the changes and close the modal
//     const handleSaveClick = useCallback(() => {
//         setModalOpen(false);
//         setEditingIndex(null);
//         setIsEditingPhoto(false);
//         setPhotoInputValue(''); // Clear the photo input value

//         //persist the data to state
//         console.log("Saved students data:", students);
//     }, [students]);

//     // Set initial values in the modal when it opens
//     useEffect(() => {
//         if (editingIndex !== null) {
//             // Optionally, set initial values based on the student data
//             // This could involve setting state variables for each input field
//             // inside the modal, using the corresponding student data.

//         }
//     }, [editingIndex]);

//     return (
//         <div className="container mx-auto p-4">
//             {students.map((student, index) => (
//                 <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between">
//                     <div>
//                         <div className="mb-2">
//                             <p className="text-gray-700 font-semibold">Name: {student.name}</p>
//                             <p className="text-gray-700">Class: {student.class}</p>
//                             <p className="text-gray-700">Roll No: {student.rollNo}</p>
//                             <p className="text-gray-700">Adm No: {student.admissionNo}</p>
//                             <p className="text-gray-700">Father Name: {student.fatherName}</p>
//                             <p className="text-gray-700">Mobile No: {student.mobileNo}</p>
//                             <p className="text-gray-700">Address: {student.address}</p>
//                         </div>
//                     </div>
//                     <div className="flex items-center">
//                         <div className="mr-4">
//                             <img src={student.photo} alt="Student" className="rounded-sm w-24 h-24 object-cover" />
//                         </div>
//                         {/* Edit Icon Button */}
//                         <button
//                             className="text-blue-500 hover:text-blue-700 focus:outline-none"
//                             onClick={() => handleEditClick(index)}
//                         >
//                             <FaEdit size={20} />
//                         </button>
//                     </div>
//                 </div>
//             ))}

//             <Modal
//                 isOpen={modalOpen}
//                 setIsOpen={setModalOpen}
//                 title="Edit Student Information"
//                 onSave={handleSaveClick} // Pass the save function
//             >
//                 {/* Content of the modal (additional fields) */}
//                 {editingIndex !== null && (
//                     <div className="mt-4">
//                         {croppedImageSource ? (
//                             <div className='relative w-full aspect-square'>
//                                 <Cropper
//                                     image={croppedImageSource}
//                                     crop={crop}
//                                     zoom={zoom}
//                                     aspect={1}
//                                     onCropChange={setCrop}
//                                     onZoomChange={setZoom}
//                                     onCropComplete={onCropComplete}
//                                 />
//                                 <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4'>
//                                     <button
//                                         onClick={cancelCrop}
//                                         className='bg-red-500 text-white py-2 px-4 rounded'>
//                                         Cancel Crop
//                                     </button>
//                                     <button
//                                         onClick={showCroppedImage}
//                                         className='bg-blue-500 text-white py-2 px-4 rounded'>
//                                         Crop Image
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <>
//                                 {/* Name */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//                                         Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="name"
//                                         name="name"
//                                         type="text"
//                                         placeholder="Name"
//                                         value={students[editingIndex].name}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                                 {/* Class */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class">
//                                         Class:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="class"
//                                         name="class"
//                                         type="text"
//                                         placeholder="Class"
//                                         value={students[editingIndex].class}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Roll No */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rollNo">
//                                         Roll No:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="rollNo"
//                                         name="rollNo"
//                                         type="text"
//                                         placeholder="Roll No"
//                                         value={students[editingIndex].rollNo}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                  {/* Admission No */}
//                                  <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="admissionNo">
//                                         Admission No:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="admissionNo"
//                                         name="admissionNo"
//                                         type="text"
//                                         placeholder="Admission No"
//                                         value={students[editingIndex].admissionNo}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                  {/* Father Name */}
//                                  <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fatherName">
//                                         Father Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="fatherName"
//                                         name="fatherName"
//                                         type="text"
//                                         placeholder="Father Name"
//                                         value={students[editingIndex].fatherName}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Mobile No */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNo">
//                                         Mobile No:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="mobileNo"
//                                         name="mobileNo"
//                                         type="text"
//                                         placeholder="Mobile No"
//                                         value={students[editingIndex].mobileNo}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Address */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
//                                         Address:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="address"
//                                         name="address"
//                                         type="text"
//                                         placeholder="Address"
//                                         value={students[editingIndex].address}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Student Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
//                                         Student Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="photo"
//                                         name="photo"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'photo')}
//                                         value={isEditingPhoto ? photoInputValue : ''}
//                                     />
//                                     {students[editingIndex].photo && !croppedImageSource && (
//                                         <img
//                                             src={students[editingIndex].photo}
//                                             alt="Student"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>

//                                 {/* Guardian Name */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardianName">
//                                         Guardian Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="guardianName"
//                                         name="guardianName"
//                                         type="text"
//                                         placeholder="Guardian Name"
//                                         value={students[editingIndex].guardianName}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Transport */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
//                                         Transport:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="transport"
//                                         name="transport"
//                                         type="text"
//                                         placeholder="Transport"
//                                         value={students[editingIndex].transport}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Mother Name */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motherName">
//                                         Mother Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="motherName"
//                                         name="motherName"
//                                         type="text"
//                                         placeholder="Mother Name"
//                                         value={students[editingIndex].motherName}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Mother Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motherPhoto">
//                                         Mother Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="motherPhoto"
//                                         name="motherPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'motherPhoto')}
//                                         value={isEditingPhoto ? photoInputValue : ''}
//                                     />
//                                     {students[editingIndex].motherPhoto && !croppedImageSource && (
//                                         <img
//                                             src={students[editingIndex].motherPhoto}
//                                             alt="Mother"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>

//                                 {/* Father Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fatherPhoto">
//                                         Father Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="fatherPhoto"
//                                         name="fatherPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'fatherPhoto')}
//                                         value={isEditingPhoto ? photoInputValue : ''}

//                                     />
//                                     {students[editingIndex].fatherPhoto && !croppedImageSource && (
//                                         <img
//                                             src={students[editingIndex].fatherPhoto}
//                                             alt="Father"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>

//                                 {/* Guardian Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardianPhoto">
//                                         Guardian Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="guardianPhoto"
//                                         name="guardianPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'guardianPhoto')}
//                                         value={isEditingPhoto ? photoInputValue : ''}

//                                     />
//                                     {students[editingIndex].guardianPhoto && !croppedImageSource && (
//                                         <img
//                                             src={students[editingIndex].guardianPhoto}
//                                             alt="Guardian"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// }

// export default AllStudent;

// import React, { useState, useCallback } from 'react';
// import Cropper from 'react-easy-crop';
// import getCroppedImg from './getCroppedImg';
// import { FaEdit } from 'react-icons/fa'; // Import edit icon

// // Modal component (as before)
// const Modal = ({ isOpen, setIsOpen, title, children, onSave }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
//             <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//                 <div className="mt-3 text-center">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
//                     <div className="mt-2 px-7 py-3">
//                         {children}
//                     </div>
//                     <div className="items-center px-4 py-3">
//                         <button
//                             className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 mr-2"
//                             onClick={onSave} // Call the onSave function
//                         >
//                             Save
//                         </button>
//                         <button
//                             className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                             onClick={() => setIsOpen(false)}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// function AllStudent() {
//     // Initial array of 10 student data objects
//     const initialStudents = Array(10).fill({
//         photo: 'https://via.placeholder.com/150', // Default placeholder image
//         name: 'John Doe',
//         class: '10th',
//         rollNo: '12345',
//         admissionNo: '67890',
//         fatherName: 'Mr. Smith',
//         mobileNo: '9876543210',
//         address: '123 Main Street, Anytown',
//         guardianName: '',
//         remarks: '',
//         transport: '',
//         motherName: '',
//         motherPhoto: null,
//         fatherPhoto: null,
//         guardianPhoto: null,
//     });

//     const [students, setStudents] = useState(initialStudents);

//     // State for the modal
//     const [modalOpen, setModalOpen] = useState(false);

//     // State to track the currently editing student index
//     const [editingIndex, setEditingIndex] = useState(null);

//     // State for the image cropping
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//     const [croppedImageSource, setCroppedImageSource] = useState(null); // Use this for the Cropper

//     // New State added to identify the current Photo being changed
//     const [currentPhotoField, setCurrentPhotoField] = useState(null);

//     // Wrap state updates with useCallback
//     const setStudentsCallback = useCallback(setStudents, []);
//     const setCroppedImageSourceCallback = useCallback(setCroppedImageSource, []);
//     const setCurrentPhotoFieldCallback = useCallback(setCurrentPhotoField, []);

//     // Function to handle input field changes (for the currently edited student)
//     const handleInputChange = useCallback((e) => {
//         const { name, value } = e.target;
//         setStudentsCallback(prevStudents =>
//             prevStudents.map((student, index) =>
//                 index === editingIndex ? { ...student, [name]: value } : student
//             )
//         );
//     }, [editingIndex, setStudentsCallback]);

//     // Function to handle photo input changes (for the currently edited student)
//     const handlePhotoChange = useCallback((e, photoField) => {
//         const { files } = e.target;
//         setCurrentPhotoFieldCallback(photoField);
//         if (files && files[0]) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setCroppedImageSourceCallback(reader.result);
//             };
//             reader.readAsDataURL(files[0]);
//         }
//     }, [setCroppedImageSourceCallback, setCurrentPhotoFieldCallback]);

//     const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//         setCroppedAreaPixels(croppedAreaPixels);
//     }, []);

//     const showCroppedImage = useCallback(async () => {
//         try {
//             if (!croppedImageSource || !croppedAreaPixels) {
//                 console.error("Cannot crop image: imageSrc or croppedAreaPixels is missing.");
//                 return;
//             }

//             const croppedImageURL = await getCroppedImg(croppedImageSource, croppedAreaPixels);

//             setCroppedImageSourceCallback(null); // Hide the Cropper
//             setStudentsCallback(prevStudents =>
//                 prevStudents.map((student, index) =>
//                     index === editingIndex ? { ...student, [currentPhotoField]: croppedImageURL } : student
//                 )
//             );
//             setCurrentPhotoFieldCallback(null);
//         } catch (error) {
//             console.error("Error cropping image:", error);
//         }
//     }, [croppedAreaPixels, croppedImageSource, editingIndex, currentPhotoField, setStudentsCallback, setCurrentPhotoFieldCallback, setCroppedImageSourceCallback]);

//     // Function to open the modal and set the editing index
//     const handleEditClick = useCallback((index) => {
//         setEditingIndex(index);
//         setModalOpen(true);
//     }, []);

//     // Function to save the changes and close the modal
//     const handleSaveClick = useCallback(() => {
//         setModalOpen(false);
//         setEditingIndex(null);

//         //persist the data to state
//         console.log("Saved students data:", students);
//     }, [students]);

//     return (
//         <div className="container mx-auto p-4">
//             {students.map((student, index) => (
//                 <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between">
//                     <div>
//                         <div className="mb-2">
//                             <p className="text-gray-700 font-semibold">Name: {student.name}</p>
//                             <p className="text-gray-700">Class: {student.class}</p>
//                             <p className="text-gray-700">Roll No: {student.rollNo}</p>
//                             <p className="text-gray-700">Adm No: {student.admissionNo}</p>
//                             <p className="text-gray-700">Father Name: {student.fatherName}</p>
//                             <p className="text-gray-700">Mobile No: {student.mobileNo}</p>
//                             <p className="text-gray-700">Address: {student.address}</p>
//                         </div>
//                     </div>
//                     <div className="flex items-center">
//                         <div className="mr-4">
//                             <img src={student.photo} alt="Student" className="rounded-sm w-24 h-24 object-cover" />
//                         </div>
//                          {/* Edit Icon Button */}
//                          <button
//                             className="text-blue-500 hover:text-blue-700 focus:outline-none"
//                             onClick={() => handleEditClick(index)}
//                         >
//                             <FaEdit size={20} />
//                         </button>
//                     </div>
//                 </div>
//             ))}

//             <Modal
//                 isOpen={modalOpen}
//                 setIsOpen={setModalOpen}
//                 title="Edit Student Information"
//                 onSave={handleSaveClick} // Pass the save function
//             >
//                 {/* Content of the modal (additional fields) */}
//                 {editingIndex !== null && (
//                     <div className="mt-4">
//                         {croppedImageSource ? (
//                             <div className='relative w-full aspect-square'>
//                                 <Cropper
//                                     image={croppedImageSource}
//                                     crop={crop}
//                                     zoom={zoom}
//                                     aspect={1}
//                                     onCropChange={setCrop}
//                                     onZoomChange={setZoom}
//                                     onCropComplete={onCropComplete}
//                                 />
//                                 <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4'>
//                                     <button
//                                         onClick={() => setCroppedImageSource(null)}
//                                         className='bg-red-500 text-white py-2 px-4 rounded'>
//                                         Cancel Crop
//                                     </button>
//                                     <button
//                                         onClick={showCroppedImage}
//                                         className='bg-blue-500 text-white py-2 px-4 rounded'>
//                                         Crop Image
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <>
//                                 {/* Guardian Name */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardianName">
//                                         Guardian Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="guardianName"
//                                         name="guardianName"
//                                         type="text"
//                                         placeholder="Guardian Name"
//                                         value={students[editingIndex].guardianName}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Transport */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
//                                         Transport:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="transport"
//                                         name="transport"
//                                         type="text"
//                                         placeholder="Transport"
//                                         value={students[editingIndex].transport}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Mother Name */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motherName">
//                                         Mother Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="motherName"
//                                         name="motherName"
//                                         type="text"
//                                         placeholder="Mother Name"
//                                         value={students[editingIndex].motherName}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Mother Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motherPhoto">
//                                         Mother Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="motherPhoto"
//                                         name="motherPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'motherPhoto')}
//                                     />
//                                     {students[editingIndex].motherPhoto && (
//                                         <img
//                                             src={students[editingIndex].motherPhoto}
//                                             alt="Mother"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>

//                                 {/* Father Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fatherPhoto">
//                                         Father Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="fatherPhoto"
//                                         name="fatherPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'fatherPhoto')}
//                                     />
//                                     {students[editingIndex].fatherPhoto && (
//                                         <img
//                                             src={students[editingIndex].fatherPhoto}
//                                             alt="Father"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>

//                                 {/* Guardian Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardianPhoto">
//                                         Guardian Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="guardianPhoto"
//                                         name="guardianPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'guardianPhoto')}
//                                     />
//                                     {students[editingIndex].guardianPhoto && (
//                                         <img
//                                             src={students[editingIndex].guardianPhoto}
//                                             alt="Guardian"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// }

// export default AllStudent;

// import React, { useState, useCallback } from 'react';
// import Cropper from 'react-easy-crop';
// import getCroppedImg from './getCroppedImg';

// // Modal component (as before)
// const Modal = ({ isOpen, setIsOpen, title, children, onSave }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
//             <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//                 <div className="mt-3 text-center">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
//                     <div className="mt-2 px-7 py-3">
//                         {children}
//                     </div>
//                     <div className="items-center px-4 py-3">
//                         <button
//                             className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 mr-2"
//                             onClick={onSave} // Call the onSave function
//                         >
//                             Save
//                         </button>
//                         <button
//                             className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                             onClick={() => setIsOpen(false)}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// function AllStudent() {
//     // Initial array of 10 student data objects
//     const initialStudents = Array(10).fill({
//         photo: 'https://via.placeholder.com/150', // Default placeholder image
//         name: 'John Doe',
//         class: '10th',
//         rollNo: '12345',
//         admissionNo: '67890',
//         fatherName: 'Mr. Smith',
//         mobileNo: '9876543210',
//         address: '123 Main Street, Anytown',
//         guardianName: '',
//         remarks: '',
//         transport: '',
//         motherName: '',
//         motherPhoto: null,
//         fatherPhoto: null,
//         guardianPhoto: null,
//     });

//     const [students, setStudents] = useState(initialStudents);

//     // State for the modal
//     const [modalOpen, setModalOpen] = useState(false);

//     // State to track the currently editing student index
//     const [editingIndex, setEditingIndex] = useState(null);

//     // State for the image cropping
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//     const [croppedImageSource, setCroppedImageSource] = useState(null); // Use this for the Cropper

//     // New State added to identify the current Photo being changed
//     const [currentPhotoField, setCurrentPhotoField] = useState(null);

//     // Wrap state updates with useCallback
//     const setStudentsCallback = useCallback(setStudents, []);
//     const setCroppedImageSourceCallback = useCallback(setCroppedImageSource, []);
//     const setCurrentPhotoFieldCallback = useCallback(setCurrentPhotoField, []);

//     // Function to handle input field changes (for the currently edited student)
//     const handleInputChange = useCallback((e) => {
//         const { name, value } = e.target;
//         setStudentsCallback(prevStudents =>
//             prevStudents.map((student, index) =>
//                 index === editingIndex ? { ...student, [name]: value } : student
//             )
//         );
//     }, [editingIndex, setStudentsCallback]);

//     // Function to handle photo input changes (for the currently edited student)
//     const handlePhotoChange = useCallback((e, photoField) => {
//         const { files } = e.target;
//         setCurrentPhotoFieldCallback(photoField);
//         if (files && files[0]) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setCroppedImageSourceCallback(reader.result);
//             };
//             reader.readAsDataURL(files[0]);
//         }
//     }, [setCroppedImageSourceCallback, setCurrentPhotoFieldCallback]);

//     const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//         setCroppedAreaPixels(croppedAreaPixels);
//     }, []);

//     const showCroppedImage = useCallback(async () => {
//         try {
//             if (!croppedImageSource || !croppedAreaPixels) {
//                 console.error("Cannot crop image: imageSrc or croppedAreaPixels is missing.");
//                 return;
//             }

//             const croppedImageURL = await getCroppedImg(croppedImageSource, croppedAreaPixels);

//             setCroppedImageSourceCallback(null); // Hide the Cropper
//             setStudentsCallback(prevStudents =>
//                 prevStudents.map((student, index) =>
//                     index === editingIndex ? { ...student, [currentPhotoField]: croppedImageURL } : student
//                 )
//             );
//             setCurrentPhotoFieldCallback(null);
//         } catch (error) {
//             console.error("Error cropping image:", error);
//         }
//     }, [croppedAreaPixels, croppedImageSource, editingIndex, currentPhotoField, setStudentsCallback, setCurrentPhotoFieldCallback, setCroppedImageSourceCallback]);

//     // Function to open the modal and set the editing index
//     const handleAddClick = useCallback((index) => {
//         setEditingIndex(index);
//         setModalOpen(true);
//     }, []);

//     // Function to save the changes and close the modal
//     const handleSaveClick = useCallback(() => {
//         setModalOpen(false);
//         setEditingIndex(null);

//         //persist the data to state
//         console.log("Saved students data:", students);
//     }, [students]);

//     return (
//         <div className="container mx-auto p-4">
//             {students.map((student, index) => (
//                 <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center">

//                 <div>
//                     <div className="mb-2">
//                         <p className="text-gray-700 font-semibold">Name: {student.name}</p>
//                         <p className="text-gray-700">Class: {student.class}</p>
//                         <p className="text-gray-700">Roll No: {student.rollNo}</p>
//                         <p className="text-gray-700">Adm No: {student.admissionNo}</p>
//                         <p className="text-gray-700">Father Name: {student.fatherName}</p>
//                         <p className="text-gray-700">Mobile No: {student.mobileNo}</p>
//                         <p className="text-gray-700">Address: {student.address}</p>
//                     </div>

//                     <button
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         type="button"
//                         onClick={() => handleAddClick(index)} // Open modal for this student
//                     >
//                         Add More Info
//                     </button>
//                 </div>
//                 <div className="mr-4">
//                     <img src={student.photo} alt="Student" className="rounded-sm w-24 h-24 object-cover" /> {/* w-24 = 6rem = 96px (close to 100px), h-24 for square */}
//                 </div>
//             </div>

//             ))}

//             <Modal
//                 isOpen={modalOpen}
//                 setIsOpen={setModalOpen}
//                 title="Additional Information"
//                 onSave={handleSaveClick} // Pass the save function
//             >
//                 {/* Content of the modal (additional fields) */}
//                 {editingIndex !== null && (
//                     <div className="mt-4">
//                         {croppedImageSource ? (
//                             <div className='relative w-full aspect-square'>
//                                 <Cropper
//                                     image={croppedImageSource}
//                                     crop={crop}
//                                     zoom={zoom}
//                                     aspect={1}
//                                     onCropChange={setCrop}
//                                     onZoomChange={setZoom}
//                                     onCropComplete={onCropComplete}
//                                 />
//                                 <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4'>
//                                     <button
//                                         onClick={() => setCroppedImageSource(null)}
//                                         className='bg-red-500 text-white py-2 px-4 rounded'>
//                                         Cancel Crop
//                                     </button>
//                                     <button
//                                         onClick={showCroppedImage}
//                                         className='bg-blue-500 text-white py-2 px-4 rounded'>
//                                         Crop Image
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <>
//                                 {/* Guardian Name */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardianName">
//                                         Guardian Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="guardianName"
//                                         name="guardianName"
//                                         type="text"
//                                         placeholder="Guardian Name"
//                                         value={students[editingIndex].guardianName}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Transport */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
//                                         Transport:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="transport"
//                                         name="transport"
//                                         type="text"
//                                         placeholder="Transport"
//                                         value={students[editingIndex].transport}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Mother Name */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motherName">
//                                         Mother Name:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="motherName"
//                                         name="motherName"
//                                         type="text"
//                                         placeholder="Mother Name"
//                                         value={students[editingIndex].motherName}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 {/* Mother Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motherPhoto">
//                                         Mother Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="motherPhoto"
//                                         name="motherPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'motherPhoto')}
//                                     />
//                                     {students[editingIndex].motherPhoto && (
//                                         <img
//                                             src={students[editingIndex].motherPhoto}
//                                             alt="Mother"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>

//                                 {/* Father Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fatherPhoto">
//                                         Father Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="fatherPhoto"
//                                         name="fatherPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'fatherPhoto')}
//                                     />
//                                     {students[editingIndex].fatherPhoto && (
//                                         <img
//                                             src={students[editingIndex].fatherPhoto}
//                                             alt="Father"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>

//                                 {/* Guardian Photo */}
//                                 <div className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardianPhoto">
//                                         Guardian Photo:
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="guardianPhoto"
//                                         name="guardianPhoto"
//                                         type="file"
//                                         accept="image/*"
//                                         capture="environment" // Use the camera to capture
//                                         onChange={(e) => handlePhotoChange(e, 'guardianPhoto')}
//                                     />
//                                     {students[editingIndex].guardianPhoto && (
//                                         <img
//                                             src={students[editingIndex].guardianPhoto}
//                                             alt="Guardian"
//                                             className="rounded-sm w-20 h-20 object-cover mt-2"
//                                         />
//                                     )}
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// }

// export default AllStudent;

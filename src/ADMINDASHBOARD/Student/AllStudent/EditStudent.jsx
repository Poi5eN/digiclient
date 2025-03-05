import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactInput } from "../../../Dynamic/ReactInput/ReactInput";
import { ReactSelect } from "../../../Dynamic/ReactSelect/ReactSelect";
import Button from "../../../Dynamic/utils/Button";
import moment from "moment";
import {
  AdminGetAllClasses,
  editStudentParent,
  getStudentAndParent,
} from "../../../Network/AdminApi";

const EditStudent = () => {
  const [Sclass, setSClass] = useState("");
  const [section, setSection] = useState("");
  const [selectedClass, setSelectedClass] = useState(Sclass);
  const navigate = useNavigate();
  const { email } = useParams();
  const [getClass, setGetClass] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parentData, setParentData] = useState({});
  const [studentData, setStudentData] = useState({
    image: null,
  });
  const [parentsData, setParentsData] = useState({
    image: null,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const parentHandleOnChange = (e) => {
    const { name, value } = e.target;

    setParentData({ ...parentData, [name]: value });
  };

  const handleClassChange = (e) => {
    const selectedClassName = e.target.value;
    setSelectedClass(selectedClassName);
    const selectedClassObj = getClass.find(
      (cls) => cls.className === selectedClassName
    );

    if (selectedClassObj) {
      setAvailableSections(selectedClassObj.sections.split(", "));
    } else {
      setAvailableSections([]);
    }
  };

  const getAllClasses = async () => {
    try {
      const response = await AdminGetAllClasses();
      if (response?.success) {
        let classes = response?.classList;

        setGetClass(classes?.sort((a, b) => a - b));
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const getStudentAndParentdata = async () => {
    try {
      const response = await getStudentAndParent(email);
      if (response?.success) {
        const student = response?.student;
        // const parent = response.data.parent;
        setSClass(student.class);
        setSection(student.section);
        setStudentData(response?.student);
        setParentsData(response?.parent);
        // setStudentData((prevFormData) => ({
        //   ...prevFormData,
        //   ...student,
        //   className: student.class || "",
        // }));
        setSelectedClass(student.class || "");

        // handleClassChange({ target: { value: student.class || "" } });
        // setParentData((prevParentData) => ({
        //   ...prevParentData,
        //   ...parent,
        // }));
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getAllClasses();
    getStudentAndParentdata();
  }, []);

  console.log("first studentData", studentData);
  const handleUpdate = async () => {
    try {
      const payload = {
        studentDateOfBirth: studentData?.dateOfBirth || "",
        rollNo: studentData?.rollNo || "",
        studentGender: studentData?.gender || "",
        studentJoiningDate: studentData?.joiningDate || "",
        studentAddress: studentData?.address || "",
        studentContact: studentData?.contact || "",
        studentClass: studentData?.classTeacher || "",
        studentSection: studentData?.selectedClass || "",
        studentCountry: studentData?.Country || "",
        caste: studentData?.caste || "",
        nationality: studentData?.nationality || "",
        pincode: studentData?.pincode || "",
        city: studentData?.city || "",
        fatherName: studentData?.fatherName || "",
        motherName: studentData?.motherName || "",
        parentQualification: studentData?.qualification || "",
        parentContact: studentData?.contact || "",
        parentIncome: studentData?.income || "",
        studentFullName: studentData?.fullName || "",
        studentImage: studentData?.studentImage,
        fatherImage: studentData?.fatherImage,
        motherImage: studentData?.motherImage,
        guardianImage: studentData?.guardianImage,
      };
  
      const formDataToSend = new FormData();
  
      Object.entries(payload).forEach(([key, value]) => {
        // If the key is an image and the value is a valid File object, append it
        if (
          (key === "studentImage" || key === "fatherImage" || key === "motherImage" || key === "guardianImage") &&
          value instanceof File
        ) {
          formDataToSend.append(key, value);
        }
        // For other fields, append as a string
        else {
          formDataToSend.append(key, String(value));
        }
      });
  
      console.log("FormData to send:", formDataToSend);
  
      const response = await editStudentParent(email, formDataToSend);
  
      if (response?.success) {
        navigate("/admin/allstudent");
        toast.success("Updated successfully!");
      } else {
        toast.error(response?.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error in handleUpdate:", error);
      toast.error("Something went wrong!");
    }
  };
  
  // const handleUpdate = async () => {
  //   try {
  //     const payload = {
  //       studentDateOfBirth: studentData?.dateOfBirth || "",
  //       rollNo: studentData?.rollNo || "",
  //       studentGender: studentData?.gender || "",
  //       studentJoiningDate: studentData?.joiningDate || "",
  //       studentAddress: studentData?.address || "",
  //       studentContact: studentData?.contact || "",
  //       studentClass: studentData?.classTeacher || "",
  //       studentSection: studentData?.selectedClass || "",
  //       studentCountry: studentData?.Country || "",
  //       // religion:studentData?. ||"",
  //       caste: studentData?.caste || "",
  //       nationality: studentData?.nationality || "",
  //       pincode: studentData?.pincode || "",
  //       city: studentData?.city || "",
  //       fatherName: studentData?.fatherName || "",
  //       motherName: studentData?.motherName || "",
  //       parentQualification: studentData?.qualification || "",
  //       parentContact: studentData?.contact || "",
  //       parentIncome: studentData?.income || "",
  //       motherName: studentData?.motherName || "",
  //       studentFullName: studentData?.fullName || "",
  //       studentAddress: studentData?.address || "",
  //       studentImage: studentData.studentImage,
  //       fatherImage: studentData.fatherImage,
  //     };
  //     const formDataToSend = new FormData();
  //     Object.entries(payload).forEach(([key, value]) => {
  //       // Check if the value is a file, then append it, otherwise convert it to string.
  //       // if (key === "studentImage" && value)
  //       if (
  //         (key === "studentImage" || key === "fatherImage") &&
  //         value instanceof File
  //       )
  //          {
  //         formDataToSend.append(key, value); // Append the file object directly
  //       }
  //        else {
  //         formDataToSend.append(key, String(value)); //convert all other values to string
  //       }
  //     });
  //     console.log("first formDataToSend", formDataToSend);
  //     const response = await editStudentParent(email, formDataToSend);
  //     if (response?.success) {
  //       navigate("/admin/allstudent");
  //       toast.success("Updated successfully!");
  //     } else {
  //       toast.error(response?.message);
  //     }
  //   } catch (error) {}
  // };

  return (
    <div className="text-center p-5 bg-white">
      <h1 className="text-xl font-bold mb-6">Edit Student Profile</h1>

      <div className="py-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4 bg-white ">
        <ReactInput
          type="text"
          name="fullName"
          // required={true}
          label="Student's Name"
          onChange={handleOnChange}
          value={studentData?.fullName}
        />
        <ReactInput
          type="text"
          name="admissionNumber"
          required={false}
          label="Admission Number"
          onChange={handleOnChange}
          value={studentData?.admissionNumber}
        />
        <ReactInput
          type="text"
          name="studentPassword"
          required={false}
          label="Student Password"
          onChange={handleOnChange}
          value={studentData?.studentPassword}
        />
        <ReactInput
          type="text"
          name="rollNo"
          required={false}
          label="Roll No"
          onChange={handleOnChange}
          value={studentData?.rollNo}
        />
        <ReactInput
          type="date"
          label="Date Of Birth"
          required={false}
          onChange={handleOnChange}
          name="dateOfBirth"
          // value={studentData?.dateOfBirth}
          value={moment(studentData?.dateOfBirth, "YYYY-MM-DD").format(
            "YYYY-MM-DD"
          )}
        />
        <ReactSelect
          name="gender"
          value={studentData?.gender}
          handleChange={handleOnChange}
          label="Gender"
          dynamicOptions={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ]}
        />
        <ReactInput
          type="date"
          label="Admission Date"
          required={false}
          onChange={handleOnChange}
          name="joiningDate"
          // value={studentData?.joiningDate}
          value={moment(studentData?.joiningDate, "DD-MMM-YYYY").format(
            "YYYY-MM-DD"
          )}
        />
        <ReactInput
          type="text"
          label="Address"
          required={false}
          onChange={handleOnChange}
          name="address"
          value={studentData?.address}
        />
        <ReactInput
          type="text"
          label="Country"
          required={false}
          onChange={handleOnChange}
          name="country"
          value={studentData?.country}
        />
        <ReactInput
          type="text"
          label="Caste"
          required={false}
          onChange={handleOnChange}
          name="caste"
          value={studentData?.caste}
        />
        <ReactInput
          type="text"
          label="Nationality"
          required={false}
          onChange={handleOnChange}
          name="nationality"
          value={studentData?.nationality}
        />
        <ReactInput
          type="number"
          label="Pincode"
          required={false}
          onChange={handleOnChange}
          name="pincode"
          value={studentData?.pincode}
        />
        <ReactInput
          type="text"
          label="City"
          required={false}
          onChange={handleOnChange}
          name="city"
          value={studentData?.city}
        />
        <ReactInput
          type="text"
          label="Contact"
          required={false}
          onChange={handleOnChange}
          name="contact"
          value={studentData?.contact}
        />
        <ReactInput
          type="text"
          label="Father's Name"
          required={false}
          onChange={handleOnChange}
          name="fatherName"
          value={studentData?.fatherName}
        />
        <ReactInput
          type="text"
          label="Mother's Name"
          required={false}
          onChange={handleOnChange}
          name="motherName"
          value={studentData?.motherName}
        />
        <ReactInput
          type="text"
          label="Parent's Qualification"
          required={false}
          onChange={handleOnChange}
          name="qualification"
          value={studentData?.qualification}
        />
        <ReactInput
          type="text"
          label="Parent's Income"
          required={false}
          onChange={handleOnChange}
          name="income"
          value={studentData?.income}
        />
        <ReactInput
          type="text"
          label="Parent's Contact"
          required={false}
          onChange={handleOnChange}
          name="contact"
          value={studentData?.contact}
        />
      
        <div className="flex justify-center items-center">
          <ReactInput
            type="file"
            label="Student Image"
            accept="image/*"
            required={false}
            onChange={(e) => {
              setStudentData({
                ...studentData,
                studentImage: e.target.files[0],
              });
            }}
            name="studentImage"
          />
          {studentData.studentImage && (
            <img
              src={
                studentData?.studentImage?.url ||
                studentData.studentImage ||
                URL.createObjectURL(studentData.studentImage)
              }
              // src={(studentData?.studentImage?.url || URL.createObjectURL(studentData.studentImage))}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-md"
            />
          )}
        </div>
        <div className="flex justify-center items-center">
          <ReactInput
            type="file"
            label="Father Image"
            accept="image/*"
            required={false}
            onChange={(e) => {
              setStudentData({
                ...studentData,
                fatherImage: e.target.files[0],
              });
            }}
            name="fatherImage"
          />
          {studentData.fatherImage && (
            <img
              src={
                studentData?.fatherImage?.url ||
                studentData.fatherImage ||
                URL.createObjectURL(studentData.fatherImage)
              }
              // src={(studentData?.studentImage?.url || URL.createObjectURL(studentData.studentImage))}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-md"
            />
          )}
        </div>
        <div className="flex justify-center items-center">
          <ReactInput
            type="file"
            label="Mother Image"
            accept="image/*"
            required={false}
            onChange={(e) => {
              setStudentData({
                ...studentData,
                motherImage: e.target.files[0],
              });
            }}
            name="motherImage"
          />
          {studentData.motherImage && (
            <img
              src={
                studentData?.motherImage?.url ||
                studentData.motherImage ||
                URL.createObjectURL(studentData.motherImage)
              }
              // src={(studentData?.studentImage?.url || URL.createObjectURL(studentData.studentImage))}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-md"
            />
          )}
        </div>
        <div className="flex justify-center items-center">
          <ReactInput
            type="file"
            label="Guardian Image"
            accept="image/*"
            required={false}
            onChange={(e) => {
              setStudentData({
                ...studentData,
                guardianImage: e.target.files[0],
              });
            }}
            name="guardianImage"
          />
          {studentData.guardianImage && (
            <img
              src={
                studentData?.guardianImage?.url ||
                studentData.guardianImage ||
                URL.createObjectURL(studentData.guardianImage)
              }
              // src={(studentData?.studentImage?.url || URL.createObjectURL(studentData.studentImage))}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-md"
            />
          )}
        </div>

        <TextField
          label="Class"
          name="classTeacher"
          select
          value={selectedClass}
          onChange={handleClassChange}
          required
          style={{ width: "70%", paddingBottom: "20px" }}
        >
          <MenuItem value="" disabled>
            Select a Class
          </MenuItem>
          {getClass.map((cls, index) => (
            <MenuItem key={index} value={cls?.className}>
              {cls.className}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Section"
          name="section"
          select
          value={section}
          // value={studentData.section}
          onChange={(e) =>
            setStudentData({ ...studentData, section: e.target?.value })
          }
          required
          style={{ width: "70%", paddingBottom: "20px" }}
        >
          <MenuItem value="" disabled>
            Select a Section
          </MenuItem>
          {availableSections.map((sec, index) => (
            <MenuItem key={index} value={studentData?.section}>
              {/* <MenuItem key={index} value={section}> */}
              {sec}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className="flex  gap-3 mt-6">
        <Button
          name="Update"
          onClick={handleUpdate}
          loading={loading}
          width="full"
        />
        <Button
          name="Cancel"
          onClick={() => navigate("/admin/allstudent")}
          width="full"
        />
      </div>
    </div>
  );
};

export default EditStudent;




// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { TextField, MenuItem } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { ReactInput } from "../../../Dynamic/ReactInput/ReactInput";
// import { ReactSelect } from "../../../Dynamic/ReactSelect/ReactSelect";
// import Button from "../../../Dynamic/utils/Button";
// import moment from "moment";
// import {
//   AdminGetAllClasses,
//   editStudentParent,
//   getStudentAndParent,
// } from "../../../Network/AdminApi";

// const EditStudent = () => {
//   const [Sclass, setSClass] = useState("");
//   const [section, setSection] = useState("");
//   const [selectedClass, setSelectedClass] = useState(Sclass);
//   const navigate = useNavigate();
//   const { email } = useParams();
//   const [getClass, setGetClass] = useState([]);
//   const [availableSections, setAvailableSections] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [parentData, setParentData] = useState({});
//   const [studentData, setStudentData] = useState({
//     image: null,
//   });
//   const [parentsData, setParentsData] = useState({
//     image: null,
//   });

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setStudentData({ ...studentData, [name]: value });
//   };

//   const parentHandleOnChange = (e) => {
//     const { name, value } = e.target;

//     setParentData({ ...parentData, [name]: value });
//   };

//   const handleClassChange = (e) => {
//     const selectedClassName = e.target.value;
//     setSelectedClass(selectedClassName);
//     const selectedClassObj = getClass.find(
//       (cls) => cls.className === selectedClassName
//     );

//     if (selectedClassObj) {
//       setAvailableSections(selectedClassObj.sections.split(", "));
//     } else {
//       setAvailableSections([]);
//     }
//   };

//   const getAllClasses = async () => {
//     try {
//       const response = await AdminGetAllClasses();
//       if (response?.success) {
//         let classes = response?.classList;

//         setGetClass(classes?.sort((a, b) => a - b));
//       } else {
//         toast.error(response?.message);
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };
//   const getStudentAndParentdata = async () => {
//     try {
//       const response = await getStudentAndParent(email);
//       if (response?.success) {
//         const student = response?.student;
//         // const parent = response.data.parent;
//         setSClass(student.class);
//         setSection(student.section);
//         setStudentData(response?.student);
//         setParentsData(response?.parent);
//         // setStudentData((prevFormData) => ({
//         //   ...prevFormData,
//         //   ...student,
//         //   className: student.class || "",
//         // }));
//         setSelectedClass(student.class || "");

//         // handleClassChange({ target: { value: student.class || "" } });
//         // setParentData((prevParentData) => ({
//         //   ...prevParentData,
//         //   ...parent,
//         // }));
//       } else {
//         toast.error(response?.message);
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   useEffect(() => {
//     getAllClasses();
//     getStudentAndParentdata();
//   }, []);

//   console.log("first studentData", studentData);
//   const handleUpdate = async () => {
//     try {
//       const payload = {
//         studentDateOfBirth: studentData?.dateOfBirth || "",
//         rollNo: studentData?.rollNo || "",
//         studentGender: studentData?.gender || "",
//         studentJoiningDate: studentData?.joiningDate || "",
//         studentAddress: studentData?.address || "",
//         studentContact: studentData?.contact || "",
//         studentClass: studentData?.classTeacher || "",
//         studentSection: studentData?.selectedClass || "",
//         studentCountry: studentData?.Country || "",
//         // religion:studentData?. ||"",
//         caste: studentData?.caste || "",
//         nationality: studentData?.nationality || "",
//         pincode: studentData?.pincode || "",
//         city: studentData?.city || "",
//         fatherName: studentData?.fatherName || "",
//         motherName: studentData?.motherName || "",
//         parentQualification: studentData?.qualification || "",
//         parentContact: studentData?.contact || "",
//         parentIncome: studentData?.income || "",
//         motherName: studentData?.motherName || "",
//         studentFullName: studentData?.fullName || "",
//         studentAddress: studentData?.address || "",
//         studentImage: studentData.studentImage,
//       };
//       const formDataToSend = new FormData();
//       Object.entries(payload).forEach(([key, value]) => {
//         // Check if the value is a file, then append it, otherwise convert it to string.
//         if (key === "studentImage" && value) {
//           formDataToSend.append(key, value); // Append the file object directly
//         } else {
//           formDataToSend.append(key, String(value)); //convert all other values to string
//         }
//       });
//       console.log("first formDataToSend", formDataToSend);
//       const response = await editStudentParent(email, formDataToSend);
//       if (response?.success) {
//         navigate("/admin/allstudent");
//         toast.success("Updated successfully!");
//       } else {
//         toast.error(response?.message);
//       }
//     } catch (error) {}
//   };

//   return (
//     <div className="text-center p-5 bg-white">
//       <h1 className="text-xl font-bold mb-6">Edit Student Profile</h1>

//       <div className="py-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4 bg-white ">
//         <ReactInput
//           type="text"
//           name="fullName"
//           // required={true}
//           label="Student's Name"
//           onChange={handleOnChange}
//           value={studentData?.fullName}
//         />
//         <ReactInput
//           type="text"
//           name="admissionNumber"
//           required={false}
//           label="Admission Number"
//           onChange={handleOnChange}
//           value={studentData?.admissionNumber}
//         />
//         <ReactInput
//           type="text"
//           name="studentPassword"
//           required={false}
//           label="Student Password"
//           onChange={handleOnChange}
//           value={studentData?.studentPassword}
//         />
//         <ReactInput
//           type="text"
//           name="rollNo"
//           required={false}
//           label="Roll No"
//           onChange={handleOnChange}
//           value={studentData?.rollNo}
//         />
//         <ReactInput
//           type="date"
//           label="Date Of Birth"
//           required={false}
//           onChange={handleOnChange}
//           name="dateOfBirth"
//           // value={studentData?.dateOfBirth}
//           value={moment(studentData?.dateOfBirth, "YYYY-MM-DD").format(
//             "YYYY-MM-DD"
//           )}
//         />
//         <ReactSelect
//           name="gender"
//           value={studentData?.gender}
//           handleChange={handleOnChange}
//           label="Gender"
//           dynamicOptions={[
//             { label: "Male", value: "male" },
//             { label: "Female", value: "female" },
//             { label: "Other", value: "other" },
//           ]}
//         />
//         <ReactInput
//           type="date"
//           label="Admission Date"
//           required={false}
//           onChange={handleOnChange}
//           name="joiningDate"
//           // value={studentData?.joiningDate}
//           value={moment(studentData?.joiningDate, "DD-MMM-YYYY").format(
//             "YYYY-MM-DD"
//           )}
//         />
//         <ReactInput
//           type="text"
//           label="Address"
//           required={false}
//           onChange={handleOnChange}
//           name="address"
//           value={studentData?.address}
//         />
//         <ReactInput
//           type="text"
//           label="Country"
//           required={false}
//           onChange={handleOnChange}
//           name="country"
//           value={studentData?.country}
//         />
//         <ReactInput
//           type="text"
//           label="Caste"
//           required={false}
//           onChange={handleOnChange}
//           name="caste"
//           value={studentData?.caste}
//         />
//         <ReactInput
//           type="text"
//           label="Nationality"
//           required={false}
//           onChange={handleOnChange}
//           name="nationality"
//           value={studentData?.nationality}
//         />
//         <ReactInput
//           type="number"
//           label="Pincode"
//           required={false}
//           onChange={handleOnChange}
//           name="pincode"
//           value={studentData?.pincode}
//         />
//         <ReactInput
//           type="text"
//           label="City"
//           required={false}
//           onChange={handleOnChange}
//           name="city"
//           value={studentData?.city}
//         />
//         <ReactInput
//           type="text"
//           label="Contact"
//           required={false}
//           onChange={handleOnChange}
//           name="contact"
//           value={studentData?.contact}
//         />
//         <ReactInput
//           type="text"
//           label="Father's Name"
//           required={false}
//           onChange={handleOnChange}
//           name="fatherName"
//           value={studentData?.fatherName}
//         />
//         <ReactInput
//           type="text"
//           label="Mother's Name"
//           required={false}
//           onChange={handleOnChange}
//           name="motherName"
//           value={studentData?.motherName}
//         />
//         <ReactInput
//           type="text"
//           label="Parent's Qualification"
//           required={false}
//           onChange={handleOnChange}
//           name="qualification"
//           value={studentData?.qualification}
//         />
//         <ReactInput
//           type="text"
//           label="Parent's Income"
//           required={false}
//           onChange={handleOnChange}
//           name="income"
//           value={studentData?.income}
//         />
//         <ReactInput
//           type="text"
//           label="Parent's Contact"
//           required={false}
//           onChange={handleOnChange}
//           name="contact"
//           value={studentData?.contact}
//         />
//         {/* <ReactInput
//             type="file"
//             label="Student Image"
//             required={false}
//             onChange={handleOnChange}
//             name="studentImage"
//             value={studentData?.studentImage}
//           /> */}
//         <div className="flex justify-center items-center">
//           <ReactInput
//             type="file"
//             label="Student Image"
//             accept="image/*"
//             required={false}
//             onChange={(e) => {
//               setStudentData({
//                 ...studentData,
//                 studentImage: e.target.files[0],
//               });
//             }}
//             name="studentImage"
//           />
//           {studentData.studentImage && (
//             <img
//               src={
//                 studentData?.studentImage?.url ||
//                 studentData.studentImage ||
//                 URL.createObjectURL(studentData.studentImage)
//               }
//               // src={(studentData?.studentImage?.url || URL.createObjectURL(studentData.studentImage))}
//               alt="Preview"
//               className="w-10 h-10 object-cover rounded-md"
//             />
//           )}
//         </div>

//         <TextField
//           label="Class"
//           name="classTeacher"
//           select
//           value={selectedClass}
//           onChange={handleClassChange}
//           required
//           style={{ width: "70%", paddingBottom: "20px" }}
//         >
//           <MenuItem value="" disabled>
//             Select a Class
//           </MenuItem>
//           {getClass.map((cls, index) => (
//             <MenuItem key={index} value={cls?.className}>
//               {cls.className}
//             </MenuItem>
//           ))}
//         </TextField>

//         <TextField
//           label="Section"
//           name="section"
//           select
//           value={section}
//           // value={studentData.section}
//           onChange={(e) =>
//             setStudentData({ ...studentData, section: e.target?.value })
//           }
//           required
//           style={{ width: "70%", paddingBottom: "20px" }}
//         >
//           <MenuItem value="" disabled>
//             Select a Section
//           </MenuItem>
//           {availableSections.map((sec, index) => (
//             <MenuItem key={index} value={studentData?.section}>
//               {/* <MenuItem key={index} value={section}> */}
//               {sec}
//             </MenuItem>
//           ))}
//         </TextField>
//       </div>
//       <div className="flex  gap-3 mt-6">
//         <Button
//           name="Update"
//           onClick={handleUpdate}
//           loading={loading}
//           width="full"
//         />
//         <Button
//           name="Cancel"
//           onClick={() => navigate("/admin/allstudent")}
//           width="full"
//         />
//       </div>
//     </div>
//   );
// };

// export default EditStudent;

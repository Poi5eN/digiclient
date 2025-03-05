// import React, { useState, useCallback } from 'react';
// import Cropper from 'react-easy-crop';

// // Utility function to crop image
// function getCroppedImg(imageSrc, pixelCrop) {
//   return new Promise((resolve, reject) => {
//     const image = new Image();
//     image.addEventListener('load', () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');

//       // Set canvas size to match cropped area
//       canvas.width = pixelCrop.width;
//       canvas.height = pixelCrop.height;

//       // Draw the cropped image
//       ctx.drawImage(
//         image,
//         pixelCrop.x,
//         pixelCrop.y,
//         pixelCrop.width,
//         pixelCrop.height,
//         0,
//         0,
//         pixelCrop.width,
//         pixelCrop.height
//       );

//       // Convert canvas to blob
//       canvas.toBlob((blob) => {
//         if (!blob) {
//           reject(new Error('Canvas is empty'));
//           return;
//         }
//         // Create a file from the blob
//         const croppedImageFile = new File([blob], 'cropped-image.jpg', { 
//           type: 'image/jpeg' 
//         });
        
//         // Create URL for the cropped image
//         const croppedImageUrl = URL.createObjectURL(croppedImageFile);
//         resolve(croppedImageUrl);
//       }, 'image/jpeg');
//     });

//     // Set image source
//     image.src = imageSrc;
//   });
// }

// // Image Cropper Component
// function ImageCropper({ imageSource, onCropComplete, onCancelCrop, onSaveCroppedImage }) {
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

//   const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//     onCropComplete(croppedAreaPixels);
//   }, [onCropComplete]);

//   const handleSaveCrop = async () => {
//     try {
//       const croppedImageUrl = await getCroppedImg(imageSource, croppedAreaPixels);
//       onSaveCroppedImage(croppedImageUrl);
//     } catch (error) {
//       console.error('Error cropping image', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg p-4 w-full max-w-md">
//         <div className="relative h-64 w-full">
//           <Cropper
//             image={imageSource}
//             crop={crop}
//             zoom={zoom}
//             aspect={1}
//             onCropChange={setCrop}
//             onZoomChange={setZoom}
//             onCropComplete={handleCropComplete}
//           />
//         </div>
//         <div className="flex justify-between items-center mt-4">
//           <div className="flex items-center">
//             <label className="mr-2">Zoom:</label>
//             <input 
//               type="range" 
//               value={zoom} 
//               min={1} 
//               max={3} 
//               step={0.1} 
//               onChange={(e) => setZoom(Number(e.target.value))}
//               className="w-full"
//             />
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={onCancelCrop}
//               className="px-4 py-2 bg-gray-200 rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSaveCrop}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md"
//             >
//               Crop
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main Component Demonstrating Image Cropping
// function ImageCropperDemo() {
//   const [originalImage, setOriginalImage] = useState(null);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
// console.log("croppedImage",croppedImage)
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         setOriginalImage(reader.result);
//       };
//     }
//   };

//   const handleCropComplete = (croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   };

//   const handleSaveCroppedImage = (croppedImageUrl) => {
//     setCroppedImage(croppedImageUrl);
//     setOriginalImage(null);
//   };

//   const handleCancelCrop = () => {
//     setOriginalImage(null);
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4">Image Cropper</h2>
      
//       {/* Image Upload Input */}
//       <input 
//         type="file" 
//         accept="image/*" 
//         onChange={handleImageUpload} 
//         className="mb-4"
//       />

//       {/* Cropper Modal */}
//       {originalImage && (
//         <ImageCropper 
//           imageSource={originalImage}
//           onCropComplete={handleCropComplete}
//           onCancelCrop={handleCancelCrop}
//           onSaveCroppedImage={handleSaveCroppedImage}
//         />
//       )}

//       {/* Cropped Image Preview */}
//       {croppedImage && (
//         <div className="mt-4">
//           <h3 className="text-lg font-semibold mb-2">Cropped Image:</h3>
//           <img 
//             src={croppedImage} 
//             alt="Cropped" 
//             className="max-w-full rounded-lg shadow-md"
//           />
//           <button 
//             onClick={() => setCroppedImage(null)}
//             className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
//           >
//             Clear Cropped Image
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ImageCropperDemo;


import React, { useState, useCallback, useEffect } from "react";
import { Camera } from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./getCroppedImg";
import Modal from "../../Modal";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Button from "../../utils/Button";
import {
  Admission,
  thirdpartymystudents,
} from "../../../Network/ThirdPartyApi";
import { toast } from "react-toastify";
import moment from "moment";
import { useStateContext } from "../../../contexts/ContextProvider";

function DynamicFormFileds(props) {
   const { currentColor ,isLoader,setIsLoader} = useStateContext();
  const [getClass, setGetClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [availableSections, setAvailableSections] = useState([]);
  const { studentData, buttonLabel, setIsOpen, setReRender } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [values, setValues] = useState({
    admissionNumber: "",
    rollNo: "",
    fullName: "",
    class: "",
    section: "",
    gender: "",
    DOB: moment("1999-01-01").format("YYYY-MM-DD"),
    // DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
    fatherName: "",
    motherName: "",
    guardianName: "",
    contact: "",
    address: "",
    studentImage: null,
    motherImage: null,
    fatherImage: null,
    guardianImage: null,
    transport: "",
    remarks: "",
  });
console.log("values",values)
  useEffect(() => {
    const classes = JSON.parse(localStorage.getItem("classes"));
    setGetClass(classes);
  }, []);

  console.log("studentData studentData",studentData)
  console.log("value",values)
  useEffect(() => {
    if (studentData) {
      setIsEdit(true);
      setSelectedClass(studentData.class);
      setSelectedSection(studentData.section); // Set section here as well
      setValues((prev) => ({
        ...studentData,
        fatherName: studentData?.udisePlusDetails?.father_name || "", //Use defensive check
        section: studentData?.section || "",
        studentImage: studentData?.studentImage || null,
        fatherImage: studentData?.fatherImage || null,
        motherImage: studentData?.motherImage || null,
        guardianImage: studentData?.guardianImage || null,
        DOB:   moment(studentData?.dateOfBirth).format("YYYY-MMM-DD") || null,
      }));
    }
  }, [studentData]);

  const schoolID = localStorage.getItem("SchoolID");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValues({
        ...values,
        studentImage: file,
      });
    }
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  const generateEmail = (name, contact) => {
    let emailPrefix = name.toLowerCase();
    emailPrefix = emailPrefix.replace(/[^a-z0-9]/g, "");
    const email = `${emailPrefix}${contact}@gmail.com`;
    return email;
  };
  
  const handleSaveClick = async () => {
    const requiredFields = [
      { key: "fullName", message: "Please Enter Name" },
      { key: "contact", message: "Please Enter Contact" },
      { key: "fatherName", message: "Please Enter Father Name" },
    ];
  
    let missingFields = [];
    for (const field of requiredFields) {
      if (!values?.[field.key]) {
        missingFields.push(field.message);
      }
    }
  
    if (missingFields.length > 0) {
      toast.warn(missingFields.join(", "));
      return;
    }
  
    if (!selectedClass) {
      toast.warn("Please Enter Class");
      return;
    }
  
    const contactRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    if (!contactRegex.test(values.contact)) {
      toast.warn("Please enter a valid contact number.");
      return;
    }
  
    // Use the generateEmail function
    const studentEmail = generateEmail(values.fullName, values.contact);
    const parentEmail = generateEmail(values.fatherName, values.contact);
  
    if (!isValidEmail(studentEmail)) {
      toast.warn("Please enter a valid student email format.");
      return;
    }
    if (!isValidEmail(parentEmail)) {
      toast.warn("Please enter a valid parent email format.");
      return;
    }
  
    setLoading(true);
    setIsLoader(true)
  
    try {
      const studentData = {
        schoolId: schoolID,
        studentFullName: values?.fullName || "",
        studentEmail: studentEmail, // Use generated email
        parentEmail: parentEmail,   // Use generated email
        studentPassword: values?.contact || "",
        parentPassword: values?.contact || "",
        studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
        studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
        studentGender: values?.gender || "",
        studentClass: selectedClass || "",
        studentSection: selectedSection || "",
        studentAddress: values?.address || "",
        studentContact: values?.contact || "",
        parentContact: values?.contact || "",
        fatherName: values?.fatherName || "",
        motherName: values?.motherName || "",
        guardianName: values?.guardianName || "",
        studentAdmissionNumber: values?.admissionNumber || "",
        studentRollNo: values?.rollNo || "",
        remarks: values?.remarks || "",
        transport: values?.transport || "",
      };
  
      const formDataToSend = new FormData();
  
      Object.entries(studentData).forEach(([key, value]) => {
        formDataToSend.append(key, String(value));
      });
  
      if (values.studentImage) {
        formDataToSend.append("studentImage", values.studentImage);
      }
      if (values.fatherImage) {
        formDataToSend.append("fatherImage", values.fatherImage);
      }
      if (values.motherImage) {
        formDataToSend.append("motherImage", values.motherImage);
      }
      if (values.guardianImage) {
        formDataToSend.append("guardianImage", values.guardianImage);
      }
  
      const response = await Admission(formDataToSend);
  
      if (response.success) {
        setIsLoader(false)
        setValues({
          admissionNumber: "",
          fullName: "",
          class: "",
          section: "",
          gender: "",
          DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
          fatherName: "",
          motherName: "",
          guardianName: "",
          contact: "",
          address: "",
          studentImage: null,
          motherImage: null,
          fatherImage: null,
          guardianImage: null,
          remarks: "",
        });
        toast.success("Admission successfully!");
        setReRender(true);
        setIsOpen(false);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error during admission:", error);
      if (error.response && error.response.status === 400) {
        toast.error("Invalid data. Please check your inputs.");
      } else if (error.response && error.response.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        console.log("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpDateClick = async () => {
    setIsLoader(true)
    setReRender(false);
    setLoading(true);
    const studentId = studentData?._id;
  
    try {
      const studentDataForUpdate = {
        schoolId: schoolID,
        parentId: values?.parentId,
        studentFullName: values?.fullName || "",
        studentEmail: `${values?.fullName}${values?.contact}@gmail.com` || "",
        studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
        studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
        studentGender: values?.gender || "",
        studentClass: selectedClass || "",
        studentSection: selectedSection || "",
        studentAddress: values?.address || "",
        studentContact: values?.contact || "",
        contact: values?.contact || "", // For parent compatibility
        fatherName: values?.fatherName || "",
        motherName: values?.motherName || "",
        guardianName: values?.guardianName || "",
        studentAdmissionNumber: values?.admissionNumber || "",
        remarks: values?.remarks || "", // Assuming this maps to udisePlusDetails or another field if needed
      };
  
      const formDataToSend = new FormData();
  
      Object.entries(studentDataForUpdate).forEach(([key, value]) => {
        formDataToSend.append(key, String(value));
      });
  
      // Conditionally append image files to FormData
      if (values.studentImage instanceof File) {
        formDataToSend.append("studentImage", values.studentImage);
      }
      if (values.fatherImage instanceof File) {
        formDataToSend.append("fatherImage", values.fatherImage);
      }
      if (values.motherImage instanceof File) {
        formDataToSend.append("motherImage", values.motherImage);
      }
      if (values.guardianImage instanceof File) {
        formDataToSend.append("guardianImage", values.guardianImage);
      }
  
      // Update API call to match editAdmission endpoint
      const response = await fetch(`https://eserver-i5sm.onrender.com/api/v1/thirdparty/admissions/${studentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth setup
        },
        body: formDataToSend,
      });
  
      const result = await response.json();
  
      if (result.success) {
        setIsLoader(false)
        setReRender(true);
        setIsOpen(false);
        toast.success("Update successfully!");
        setValues({
          admissionNumber: "",
          fullName: "",
          class: "",
          section: "",
          gender: "",
          DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
          fatherName: "",
          motherName: "",
          guardianName: "",
          contact: "",
          address: "",
          studentImage: null,
          motherImage: null,
          fatherImage: null,
          guardianImage: null,
          remarks: "",
        });
      } else {
        toast.error(result.message || "Failed to update admission");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      // toast.error("An error occurred during update.");
    } finally {
      setLoading(false);
    }}

  

  const [modalOpen, setModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImageSource, setCroppedImageSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState(null);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setValues((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Auto-format to YYYY-MM-DD if valid
    if (name === "dateOfBirth") {
      // Allow typing & validate date
      const formattedDate = moment(value, ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"], true);

      setValues({
        ...values,
        [name]: formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : value,
      });
    } else {
      setValues({ ...values, [name]: value });
    }
  };
  const handlePhotoChange = (e, photoType) => {
    const file = e.target.files?.[0];

    if (file) {
      setCurrentPhotoType(photoType);
      setValues((prev) => ({ ...prev, [photoType]: file }));
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const cancelCrop = useCallback(() => {
    setCroppedImageSource(null);
  }, [setCroppedImageSource]);

  const showCroppedImage = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(
        croppedImageSource,
        croppedAreaPixels
      );
      setCroppedImageSource(null);

      switch (currentPhotoType) {
        case "fatherImage":
          setValues((prev) => ({ ...prev, fatherImage: croppedImageUrl }));
          break;
        case "motherImage":
          setValues((prev) => ({ ...prev, motherImage: croppedImageUrl }));
          break;
        case "guardianImage":
          setValues((prev) => ({ ...prev, guardianImage: croppedImageUrl }));
          break;
        default:
          setValues((prev) => ({ ...prev, studentImage: croppedImageUrl }));
          break;
      }
      setCurrentPhotoType(null);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleMoreDetails = () => {
    setModalOpen(true);
  };

  const handleClassChange = (e) => {
    const selectedClassName = e.target.value;
    setSelectedClass(selectedClassName);
    setSelectedSection("");

    if (selectedClassName === "all") {
      setAvailableSections([]);
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

  if (croppedImageSource) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-4 w-full max-w-md">
          <div className="relative h-64 w-full">
            <Cropper
              image={croppedImageSource}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setCroppedImageSource(null)}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={showCroppedImage}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Crop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div class="selection:bg-[#2fa7db] selection:text-white">
        <div class=" flex justify-center ">
          <div class="flex-1 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] m-2">
            <div class="w-full bg-white  mx-auto overflow-hidden ">
              <div
                class="relative h-[130px] px-5 pt-1
               rounded-bl-4xl"
              >
                <h1 class="absolute top-0  text-xl font-semibold text-white pl-2">
                  Student Details
                </h1>
                <div className="flex justify-end  items-center mb-6">
                  <Button
                    name=" More Details"
                    color="#59b3da"
                    onClick={() => handleMoreDetails()}
                    className="text-[#ee582c] m-2"
                  />
                </div>
                <div className="flex ml-2 mb-6">
                  <div className="absolute top-5">
                    {values?.studentImage ? (
                      <img
                        src={
                          values.studentImage instanceof File
                            ? URL.createObjectURL(values.studentImage)
                            :  values.studentImage?.url 
                           
                        }
                       
                        alt="studentImage"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-[#ee582c]">NO IMAGE</span>
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-[#ee582c] text-white p-2 rounded-full cursor-pointer">
                      <Camera size={18} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div class="px-6 pb-8 bg-white rounded-tr-4xl ">
                <form class="" action="" method="POST">
                 
                  <div class="relative mt-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Student Name"
                      value={values?.fullName}
                      onChange={handleInputChange}
                      id="fullName"
                      className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
                    />
                    <label
                      for="fullName"
                      class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
                    >
                    Student Name
                    </label>
                  </div>
                  <div class="relative mt-4">
                    <input
                      type="text"
                      name="fatherName"
                      placeholder="Father Name"
                      value={values?.fatherName}
                      onChange={handleInputChange}
                      id="fatherName"
                      className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
                    />
                    <label
                      for="fatherName"
                      class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
                    >
                      Father Name
                    </label>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                    <FormControl
                      variant="standard"
                      sx={{
                        mt: 1,
                        width: "100%",
                        "& .MuiInputLabel-root": { color: "#ee582c" },
                        "& .MuiSelect-root": { color: "#2fa7db" },
                        "& .MuiSelect-icon": { color: "#ee582c" },
                        "&:before": { borderBottom: "2px solid #ee582c" },
                        "&:after": { borderBottom: "2px solid #ee582c" },
                      }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Class
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={selectedClass}
                        onChange={handleClassChange}
                        label="Class"
                        name="studentclass"
                        sx={{
                          color: "#2fa7db",
                          "& .MuiSelect-icon": { color: "#ee582c" },
                          "&:before": { borderBottom: "2px solid #ee582c" },
                          "&:after": { borderBottom: "2px solid #ee582c" },
                          "&:hover:not(.Mui-disabled, .Mui-error):before": {
                            borderBottom: "2px solid #ee582c",
                          },
                        }}
                      >
                        {getClass?.map((cls, index) => (
                          <MenuItem key={index} value={cls.className}>
                            {cls?.className}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="standard"
                      sx={{
                        mt: 1,
                        width: "100%",
                        "& .MuiInputLabel-root": { color: "#ee582c" },
                        "& .MuiSelect-root": { color: "#ee582c" },
                        "& .MuiSelect-icon": { color: "#ee582c" },
                        "&:before": { borderBottom: "2px solid #ee582c" },
                        "&:after": { borderBottom: "2px solid #ee582c" },
                      }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Section
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={selectedSection}
                        onChange={handleSectionChange}
                        label="Section"
                        name="studentSection"
                        sx={{
                          color: "#2fa7db",
                          "& .MuiSelect-icon": { color: "#ee582c" },
                          "&:before": { borderBottom: "2px solid #ee582c" },
                          "&:after": { borderBottom: "2px solid #ee582c" },
                          "&:hover:not(.Mui-disabled, .Mui-error):before": {
                            borderBottom: "2px solid #ee582c",
                          },
                        }}
                      >
                        {availableSections?.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <FormControl
                      variant="standard"
                      sx={{
                        mt: 1,
                        width: "100%",
                        "& .MuiInputLabel-root": { color: "#ee582c" },
                        "& .MuiSelect-root": { color: "#ee582c" },
                        "& .MuiSelect-icon": { color: "#ee582c" },
                        "&:before": { borderBottom: "2px solid #ee582c" },
                        "&:after": { borderBottom: "2px solid #ee582c" },
                      }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Gender
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={values?.gender}
                        onChange={handleInputChange}
                        label="Gender"
                        name="gender"
                        sx={{
                          color: "#2fa7db",
                          "& .MuiSelect-icon": { color: "#ee582c" },
                          "&:before": { borderBottom: "2px solid #ee582c" },
                          "&:after": { borderBottom: "2px solid #ee582c" },
                          "&:hover:not(.Mui-disabled, .Mui-error):before": {
                            borderBottom: "2px solid #ee582c",
                          },
                        }}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                    {
                      console.log("values?.dateOfBirth",values?.dateOfBirth)
                    }
                    <div class="relative mt-4 w-full">
                    {/* <input
  type="date"
  name="DOB"
  placeholder="Enter DOB"
  value={(values?.dateOfBirth ? moment(values?.dateOfBirth).format("YYYY-MM-DD") : values?.DOB )}
  onChange={handleInputChange}
  id="DOB"
  className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
/> */}

<input
        type="date"
        name="dateOfBirth"
        placeholder="Enter DOB (YYYY-MM-DD)"
        value={values.dateOfBirth}
        onChange={handleInputChange}
        id="DOB"
        className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-gray-400 focus:outline-none focus:border-rose-600"
      />      
                      <label
                        for="DOB"
                        class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
                      >
                        Enter DOB
                      </label>
                    </div>
                  </div>
                  




                  <div className="flex justify-center items-center gap-2 w-full mt-4">
                    
                    <div class="relative w-full">
                      <input
                        maxLength="3"
                        type="text"
                        name="rollNo"
                        placeholder="Roll Number"
                        value={values?.rollNo}
                        onChange={handleInputChange}
                        id="rollNo"
                        className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
                      />
                      <label
                        for="rollNo"
                        class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
                      >
                        Roll Number
                      </label>
                    </div>
                    <div class="relative  w-full">
                    <input
                      type="text"
                      maxlength="10"
                      name="contact"
                      placeholder="Contact No."
                      value={values?.contact}
                      onChange={handleInputChange}
                      id="contact"
                      pattern="[0-9]*" 
                      className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
                    />
                    <label
                      for="contact"
                      class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
                    >
                      Contact No.
                    </label>
                  </div>
                  </div>



                 
                  <div class="relative mt-4">
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter Address"
                      value={values?.address}
                      onChange={handleInputChange}
                      id="address"
                      className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
                    />
                    <label
                      for="address"
                      class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
                    >
                      Address
                    </label>
                  </div>
                </form>
              </div>
              <div className="px-4  shadow-xl bg-white ">
                {buttonLabel === "Save" ? (
                  <button
                    className="w-full bg-[#2fa7db] text-white  rounded-md mb-5 py-2 "
                    onClick={handleSaveClick}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : buttonLabel}
                  </button>
                ) : (
                  <button
                    className="w-full bg-[#2fa7db] text-white  rounded-md mb-14 py-2 "
                    onClick={handleUpDateClick}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : buttonLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`More Details`}>
        {croppedImageSource ? (
          <div className="relative w-full aspect-square">
            <Cropper
              image={croppedImageSource}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={cancelCrop}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Cancel Crop
              </button>
              <button
                onClick={showCroppedImage}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Crop Image
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 pb-2 min-w-[330px]">
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="transport"
              >
                Guardian Name:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="guardianName"
                name="guardianName"
                type="text"
                placeholder="Guardian Name"
                onChange={handleInputChange}
                value={values?.guardianName}
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="transport"
              >
                Mother Name:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="motherName"
                name="motherName"
                type="text"
                placeholder="Guardian Name"
                onChange={handleInputChange}
                value={values?.motherName}
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="transport"
              >
                Transport:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="transport"
                name="transport"
                type="text"
                placeholder="Transport"
                value={values?.transport}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="transport"
              >
                Remarks:
              </label>

              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="remarks"
                name="remarks"
                type="text"
                placeholder="Remarks"
                value={values?.remarks}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="transport"
                >
                  Father Photo:
                </label>
                {values?.fatherImage ? (
                  <img
                    src={
                      values.fatherImage instanceof File
                      ? URL.createObjectURL(values.fatherImage)
                      :  values.fatherImage?.url 
                     
                    }
                    alt="mother Image"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-[#ee582c]">NO IMAGE</span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                  <Camera size={16} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    name="fatherImage"
                    onChange={(e) => handlePhotoChange(e, "fatherImage")}
                  />
                </label>
              </div>
            </div>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="transport"
                >
                  Mother Photo:
                </label>
                {values?.motherImage ? (
                  <img
                    src={
                      values.motherImage instanceof File
                      ? URL.createObjectURL(values.motherImage)
                      :  values.motherImage?.url 
                    
                    }
                   
                    alt="mother Image"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-[#ee582c]">NO IMAGE</span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                  <Camera size={16} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    name="motherImage"
                    onChange={(e) => handlePhotoChange(e, "motherImage")}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="transport"
                >
                  Guardian Photo:
                </label>

                {values?.guardianImage ? (
                  <img
                    src={
                      values.guardianImage instanceof File
                      ? URL.createObjectURL(values.guardianImage)
                      :  values.guardianImage?.url 
                     
                    }
                  
                    alt="Guardian"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-[#ee582c]">NO IMAGE</span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                  <Camera size={16} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    name="guardianImage"
                    onChange={(e) => handlePhotoChange(e, "guardianImage")}
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default DynamicFormFileds;




// import React, { useState, useCallback, useEffect } from "react";
// import { Camera } from "lucide-react";
// import Cropper from "react-easy-crop";
// import getCroppedImg from "./getCroppedImg";
// import Modal from "../../Modal";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import Button from "../../utils/Button";
// import {
//   Admission,
//   thirdpartymystudents,
// } from "../../../Network/ThirdPartyApi";
// import { toast } from "react-toastify";
// import moment from "moment";
// import { useStateContext } from "../../../contexts/ContextProvider";

// function DynamicFormFileds(props) {
//    const { currentColor ,isLoader,setIsLoader} = useStateContext();
//   const [getClass, setGetClass] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [availableSections, setAvailableSections] = useState([]);
//   const { studentData, buttonLabel, setIsOpen, setReRender } = props;
//   const [isEdit, setIsEdit] = useState(false);
//   const [values, setValues] = useState({
//     admissionNumber: "",
//     rollNo: "",
//     fullName: "",
//     class: "",
//     section: "",
//     gender: "",
//     DOB: moment("1999-01-01").format("YYYY-MM-DD"),
//     // DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
//     fatherName: "",
//     motherName: "",
//     guardianName: "",
//     contact: "",
//     address: "",
//     studentImage: null,
//     motherImage: null,
//     fatherImage: null,
//     guardianImage: null,
//     transport: "",
//     remarks: "",
//   });
// console.log("values",values)
//   useEffect(() => {
//     const classes = JSON.parse(localStorage.getItem("classes"));
//     setGetClass(classes);
//   }, []);

//   console.log("studentData studentData",studentData)
//   console.log("value",values)
//   useEffect(() => {
//     if (studentData) {
//       setIsEdit(true);
//       setSelectedClass(studentData.class);
//       setSelectedSection(studentData.section); // Set section here as well
//       setValues((prev) => ({
//         ...studentData,
//         fatherName: studentData?.udisePlusDetails?.father_name || "", //Use defensive check
//         section: studentData?.section || "",
//         studentImage: studentData?.studentImage || null,
//         fatherImage: studentData?.fatherImage || null,
//         motherImage: studentData?.motherImage || null,
//         guardianImage: studentData?.guardianImage || null,
//         DOB:   moment(studentData?.dateOfBirth).format("YYYY-MMM-DD") || null,
//       }));
//     }
//   }, [studentData]);

//   const schoolID = localStorage.getItem("SchoolID");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setValues({
//         ...values,
//         studentImage: file,
//       });
//     }
//   };
//   const isValidEmail = (email) => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailRegex.test(email);
//   };
  
//   const generateEmail = (name, contact) => {
//     let emailPrefix = name.toLowerCase();
//     emailPrefix = emailPrefix.replace(/[^a-z0-9]/g, "");
//     const email = `${emailPrefix}${contact}@gmail.com`;
//     return email;
//   };
  
//   const handleSaveClick = async () => {
//     const requiredFields = [
//       { key: "fullName", message: "Please Enter Name" },
//       { key: "contact", message: "Please Enter Contact" },
//       { key: "fatherName", message: "Please Enter Father Name" },
//     ];
  
//     let missingFields = [];
//     for (const field of requiredFields) {
//       if (!values?.[field.key]) {
//         missingFields.push(field.message);
//       }
//     }
  
//     if (missingFields.length > 0) {
//       toast.warn(missingFields.join(", "));
//       return;
//     }
  
//     if (!selectedClass) {
//       toast.warn("Please Enter Class");
//       return;
//     }
  
//     const contactRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
//     if (!contactRegex.test(values.contact)) {
//       toast.warn("Please enter a valid contact number.");
//       return;
//     }
  
//     // Use the generateEmail function
//     const studentEmail = generateEmail(values.fullName, values.contact);
//     const parentEmail = generateEmail(values.fatherName, values.contact);
  
//     if (!isValidEmail(studentEmail)) {
//       toast.warn("Please enter a valid student email format.");
//       return;
//     }
//     if (!isValidEmail(parentEmail)) {
//       toast.warn("Please enter a valid parent email format.");
//       return;
//     }
  
//     setLoading(true);
//     setIsLoader(true)
  
//     try {
//       const studentData = {
//         schoolId: schoolID,
//         studentFullName: values?.fullName || "",
//         studentEmail: studentEmail, // Use generated email
//         parentEmail: parentEmail,   // Use generated email
//         studentPassword: values?.contact || "",
//         parentPassword: values?.contact || "",
//         studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
//         studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
//         studentGender: values?.gender || "",
//         studentClass: selectedClass || "",
//         studentSection: selectedSection || "",
//         studentAddress: values?.address || "",
//         studentContact: values?.contact || "",
//         parentContact: values?.contact || "",
//         fatherName: values?.fatherName || "",
//         motherName: values?.motherName || "",
//         guardianName: values?.guardianName || "",
//         studentAdmissionNumber: values?.admissionNumber || "",
//         studentRollNo: values?.rollNo || "",
//         remarks: values?.remarks || "",
//         transport: values?.transport || "",
//       };
  
//       const formDataToSend = new FormData();
  
//       Object.entries(studentData).forEach(([key, value]) => {
//         formDataToSend.append(key, String(value));
//       });
  
//       if (values.studentImage) {
//         formDataToSend.append("studentImage", values.studentImage);
//       }
//       if (values.fatherImage) {
//         formDataToSend.append("fatherImage", values.fatherImage);
//       }
//       if (values.motherImage) {
//         formDataToSend.append("motherImage", values.motherImage);
//       }
//       if (values.guardianImage) {
//         formDataToSend.append("guardianImage", values.guardianImage);
//       }
  
//       const response = await Admission(formDataToSend);
  
//       if (response.success) {
//         setIsLoader(false)
//         setValues({
//           admissionNumber: "",
//           fullName: "",
//           class: "",
//           section: "",
//           gender: "",
//           DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
//           fatherName: "",
//           motherName: "",
//           guardianName: "",
//           contact: "",
//           address: "",
//           studentImage: null,
//           motherImage: null,
//           fatherImage: null,
//           guardianImage: null,
//           remarks: "",
//         });
//         toast.success("Admission successfully!");
//         setReRender(true);
//         setIsOpen(false);
//       } else {
//         toast.error(response?.data?.message);
//       }
//     } catch (error) {
//       console.error("Error during admission:", error);
//       if (error.response && error.response.status === 400) {
//         toast.error("Invalid data. Please check your inputs.");
//       } else if (error.response && error.response.status === 500) {
//         toast.error("Server error. Please try again later.");
//       } else {
//         console.log("An unexpected error occurred.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleSaveClick = async () => {
//   //   const requiredFields = [
//   //     { key: "fullName", message: "Please Enter Name" },
//   //     // { key: "gender", message: "Please Enter Gender" },
//   //     // { key: "DOB", message: "Please Enter DOB" },
//   //     { key: "contact", message: "Please Enter Contact" },
//   //     { key: "fatherName", message: "Please Enter Father Name" },
//   //   ];

//   //   for (const field of requiredFields) {
//   //     if (!values?.[field.key]) {
//   //       toast.warn(field.message);
//   //       return;
//   //     }
//   //   }

//   //   if (!selectedClass) {
//   //     toast.warn("Please Enter Class");
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     const studentData = {
//   //       schoolId: schoolID,
//   //       studentFullName: values?.fullName || "",
//   //       studentEmail: `${values.fullName}${values.contact}@gmail.com` || "",
//   //       parentEmail: `${values.fatherName}${values.contact}@gmail.com` || "",
//   //       studentPassword: values?.contact || "",
//   //       parentPassword: values?.contact || "",
//   //       studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
//   //       studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
//   //       studentGender: values?.gender || "",
//   //       studentClass: selectedClass || "",
//   //       studentSection: selectedSection || "",
//   //       studentAddress: values?.address || "",
//   //       studentContact: values?.contact || "",
//   //       parentContact: values?.contact || "",
//   //       fatherName: values?.fatherName || "",
//   //       motherName: values?.motherName || "",
//   //       guardianName: values?.guardianName || "",
//   //       studentAdmissionNumber: values?.admissionNumber || "",
//   //       studentRollNo: values?.rollNo || "",
    
//   //       remarks: values?.remarks || "",
//   //       transport: values?.transport || "",
//   //     };

//   //     const formDataToSend = new FormData();

//   //     Object.entries(studentData).forEach(([key, value]) => {
//   //       formDataToSend.append(key, String(value));  // Ensure all values are strings
//   //     });

//   //     // Handle image fields separately and conditionally
//   //     if (values.studentImage) {
//   //       formDataToSend.append("studentImage", values.studentImage);
//   //     }
//   //     if (values.fatherImage) {
//   //       formDataToSend.append("fatherImage", values.fatherImage);
//   //     }
//   //     if (values.motherImage) {
//   //       formDataToSend.append("motherImage", values.motherImage);
//   //     }
//   //     if (values.guardianImage) {
//   //       formDataToSend.append("guardianImage", values.guardianImage);
//   //     }

//   //     const response = await Admission(formDataToSend);

//   //     if (response.success) {
//   //       setValues({
//   //         admissionNumber: "",
//   //         fullName: "",
//   //         class: "",
//   //         section: "",
//   //         gender: "",
//   //         DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
//   //         fatherName: "",
//   //         motherName: "",
//   //         guardianName: "",
//   //         contact: "",
//   //         address: "",
//   //         studentImage: null,
//   //         motherImage: null,
//   //         fatherImage: null,
//   //         guardianImage: null,
//   //         remarks: "",
//   //       });
//   //       toast.success("Admission successfully!");
//   //       setReRender(true);
//   //       setIsOpen(false);
//   //     } else {
//   //       toast.error(response?.data?.message);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error during admission:", error);
//   //     // toast.error("An error occurred during admission."); // User-friendly error
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleUpDateClick = async () => {
//     setIsLoader(true)
//     setReRender(false);
//     setLoading(true);
//     const studentId = studentData?._id;
  
//     try {
//       const studentDataForUpdate = {
//         schoolId: schoolID,
//         parentId: values?.parentId,
//         studentFullName: values?.fullName || "",
//         studentEmail: `${values?.fullName}${values?.contact}@gmail.com` || "",
//         studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
//         studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
//         studentGender: values?.gender || "",
//         studentClass: selectedClass || "",
//         studentSection: selectedSection || "",
//         studentAddress: values?.address || "",
//         studentContact: values?.contact || "",
//         contact: values?.contact || "", // For parent compatibility
//         fatherName: values?.fatherName || "",
//         motherName: values?.motherName || "",
//         guardianName: values?.guardianName || "",
//         studentAdmissionNumber: values?.admissionNumber || "",
//         remarks: values?.remarks || "", // Assuming this maps to udisePlusDetails or another field if needed
//       };
  
//       const formDataToSend = new FormData();
  
//       Object.entries(studentDataForUpdate).forEach(([key, value]) => {
//         formDataToSend.append(key, String(value));
//       });
  
//       // Conditionally append image files to FormData
//       if (values.studentImage instanceof File) {
//         formDataToSend.append("studentImage", values.studentImage);
//       }
//       if (values.fatherImage instanceof File) {
//         formDataToSend.append("fatherImage", values.fatherImage);
//       }
//       if (values.motherImage instanceof File) {
//         formDataToSend.append("motherImage", values.motherImage);
//       }
//       if (values.guardianImage instanceof File) {
//         formDataToSend.append("guardianImage", values.guardianImage);
//       }
  
//       // Update API call to match editAdmission endpoint
//       const response = await fetch(`https://eserver-i5sm.onrender.com/api/v1/thirdparty/admissions/${studentId}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth setup
//         },
//         body: formDataToSend,
//       });
  
//       const result = await response.json();
  
//       if (result.success) {
//         setIsLoader(false)
//         setReRender(true);
//         setIsOpen(false);
//         toast.success("Update successfully!");
//         setValues({
//           admissionNumber: "",
//           fullName: "",
//           class: "",
//           section: "",
//           gender: "",
//           DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
//           fatherName: "",
//           motherName: "",
//           guardianName: "",
//           contact: "",
//           address: "",
//           studentImage: null,
//           motherImage: null,
//           fatherImage: null,
//           guardianImage: null,
//           remarks: "",
//         });
//       } else {
//         toast.error(result.message || "Failed to update admission");
//       }
//     } catch (error) {
//       console.error("Error updating student:", error);
//       // toast.error("An error occurred during update.");
//     } finally {
//       setLoading(false);
//     }}

  

//   const [modalOpen, setModalOpen] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [croppedImageSource, setCroppedImageSource] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [currentPhotoType, setCurrentPhotoType] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handlePhotoChange = (e, photoType) => {
//     const file = e.target.files?.[0];

//     if (file) {
//       setCurrentPhotoType(photoType);
//       setValues((prev) => ({ ...prev, [photoType]: file }));
//     }
//   };

//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const cancelCrop = useCallback(() => {
//     setCroppedImageSource(null);
//   }, [setCroppedImageSource]);

//   const showCroppedImage = async () => {
//     try {
//       const croppedImageUrl = await getCroppedImg(
//         croppedImageSource,
//         croppedAreaPixels
//       );
//       setCroppedImageSource(null);

//       switch (currentPhotoType) {
//         case "fatherImage":
//           setValues((prev) => ({ ...prev, fatherImage: croppedImageUrl }));
//           break;
//         case "motherImage":
//           setValues((prev) => ({ ...prev, motherImage: croppedImageUrl }));
//           break;
//         case "guardianImage":
//           setValues((prev) => ({ ...prev, guardianImage: croppedImageUrl }));
//           break;
//         default:
//           setValues((prev) => ({ ...prev, studentImage: croppedImageUrl }));
//           break;
//       }
//       setCurrentPhotoType(null);
//     } catch (error) {
//       console.error("Error cropping image:", error);
//     }
//   };

//   const handleMoreDetails = () => {
//     setModalOpen(true);
//   };

//   const handleClassChange = (e) => {
//     const selectedClassName = e.target.value;
//     setSelectedClass(selectedClassName);
//     setSelectedSection("");

//     if (selectedClassName === "all") {
//       setAvailableSections([]);
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

//   if (croppedImageSource) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg p-4 w-full max-w-md">
//           <div className="relative h-64 w-full">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => setCroppedImageSource(null)}
//               className="px-4 py-2 bg-gray-200 rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={showCroppedImage}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md"
//             >
//               Crop
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div class="selection:bg-[#2fa7db] selection:text-white">
//         <div class=" flex justify-center ">
//           <div class="flex-1 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] m-2">
//             <div class="w-full bg-white  mx-auto overflow-hidden ">
//               <div
//                 class="relative h-[130px] px-5 pt-1
//                rounded-bl-4xl"
//               >
//                 <h1 class="absolute top-0  text-xl font-semibold text-white pl-2">
//                   Student Details
//                 </h1>
//                 <div className="flex justify-end  items-center mb-6">
//                   <Button
//                     name=" More Details"
//                     color="#59b3da"
//                     onClick={() => handleMoreDetails()}
//                     className="text-[#ee582c] m-2"
//                   />
//                 </div>
//                 <div className="flex ml-2 mb-6">
//                   <div className="absolute top-5">
//                     {values?.studentImage ? (
//                       <img
//                         src={
//                           values.studentImage instanceof File
//                             ? URL.createObjectURL(values.studentImage)
//                             :  values.studentImage?.url 
                           
//                         }
                       
//                         alt="studentImage"
//                         className="w-20 h-20 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                         <span className="text-[#ee582c]">NO IMAGE</span>
//                       </div>
//                     )}
//                     <label className="absolute bottom-0 right-0 bg-[#ee582c] text-white p-2 rounded-full cursor-pointer">
//                       <Camera size={18} />
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>
//               <div class="px-6 pb-8 bg-white rounded-tr-4xl ">
//                 <form class="" action="" method="POST">
                 
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fullName"
//                       placeholder="Student Name"
//                       value={values?.fullName}
//                       onChange={handleInputChange}
//                       id="fullName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fullName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                     Student Name
//                     </label>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fatherName"
//                       placeholder="Father Name"
//                       value={values?.fatherName}
//                       onChange={handleInputChange}
//                       id="fatherName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fatherName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Father Name
//                     </label>
//                   </div>

//                   <div className="flex justify-center items-center gap-2">
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" },
//                         "& .MuiSelect-root": { color: "#2fa7db" },
//                         "& .MuiSelect-icon": { color: "#ee582c" },
//                         "&:before": { borderBottom: "2px solid #ee582c" },
//                         "&:after": { borderBottom: "2px solid #ee582c" },
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Class
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         value={selectedClass}
//                         onChange={handleClassChange}
//                         label="Class"
//                         name="studentclass"
//                         sx={{
//                           color: "#2fa7db",
//                           "& .MuiSelect-icon": { color: "#ee582c" },
//                           "&:before": { borderBottom: "2px solid #ee582c" },
//                           "&:after": { borderBottom: "2px solid #ee582c" },
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c",
//                           },
//                         }}
//                       >
//                         {getClass?.map((cls, index) => (
//                           <MenuItem key={index} value={cls.className}>
//                             {cls?.className}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" },
//                         "& .MuiSelect-root": { color: "#ee582c" },
//                         "& .MuiSelect-icon": { color: "#ee582c" },
//                         "&:before": { borderBottom: "2px solid #ee582c" },
//                         "&:after": { borderBottom: "2px solid #ee582c" },
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Section
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         value={selectedSection}
//                         onChange={handleSectionChange}
//                         label="Section"
//                         name="studentSection"
//                         sx={{
//                           color: "#2fa7db",
//                           "& .MuiSelect-icon": { color: "#ee582c" },
//                           "&:before": { borderBottom: "2px solid #ee582c" },
//                           "&:after": { borderBottom: "2px solid #ee582c" },
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c",
//                           },
//                         }}
//                       >
//                         {availableSections?.map((item, index) => (
//                           <MenuItem key={index} value={item}>
//                             {item}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </div>
//                   <div className="flex justify-center items-center gap-2">
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" },
//                         "& .MuiSelect-root": { color: "#ee582c" },
//                         "& .MuiSelect-icon": { color: "#ee582c" },
//                         "&:before": { borderBottom: "2px solid #ee582c" },
//                         "&:after": { borderBottom: "2px solid #ee582c" },
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Gender
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         value={values?.gender}
//                         onChange={handleInputChange}
//                         label="Gender"
//                         name="gender"
//                         sx={{
//                           color: "#2fa7db",
//                           "& .MuiSelect-icon": { color: "#ee582c" },
//                           "&:before": { borderBottom: "2px solid #ee582c" },
//                           "&:after": { borderBottom: "2px solid #ee582c" },
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c",
//                           },
//                         }}
//                       >
//                         <MenuItem value="Male">Male</MenuItem>
//                         <MenuItem value="Female">Female</MenuItem>
//                         <MenuItem value="Other">Other</MenuItem>
//                       </Select>
//                     </FormControl>
//                     {
//                       console.log("values?.dateOfBirth",values?.dateOfBirth)
//                     }
//                     <div class="relative mt-4 w-full">
//                     <input
//   type="date"
//   name="DOB"
//   placeholder="Enter DOB"
//   value={(values?.dateOfBirth ? moment(values?.dateOfBirth).format("YYYY-MM-DD") : values?.DOB )}
//   onChange={handleInputChange}
//   id="DOB"
//   className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
// />

                    
//                       <label
//                         for="DOB"
//                         class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                       >
//                         Enter DOB
//                       </label>
//                     </div>
//                   </div>
                  




//                   <div className="flex justify-center items-center gap-2 w-full mt-4">
                    
//                     <div class="relative w-full">
//                       <input
//                         maxLength="3"
//                         type="text"
//                         name="rollNo"
//                         placeholder="Roll Number"
//                         value={values?.rollNo}
//                         onChange={handleInputChange}
//                         id="rollNo"
//                         className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                       />
//                       <label
//                         for="rollNo"
//                         class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                       >
//                         Roll Number
//                       </label>
//                     </div>
//                     <div class="relative  w-full">
//                     <input
//                       type="text"
//                       maxlength="10"
//                       name="contact"
//                       placeholder="Contact No."
//                       value={values?.contact}
//                       onChange={handleInputChange}
//                       id="contact"
//                       pattern="[0-9]*" 
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="contact"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Contact No.
//                     </label>
//                   </div>
//                   </div>



                 
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="address"
//                       placeholder="Enter Address"
//                       value={values?.address}
//                       onChange={handleInputChange}
//                       id="address"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="address"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Address
//                     </label>
//                   </div>
//                 </form>
//               </div>
//               <div className="px-4  shadow-xl bg-white ">
//                 {buttonLabel === "Save" ? (
//                   <button
//                     className="w-full bg-[#2fa7db] text-white  rounded-md mb-5 py-2 "
//                     onClick={handleSaveClick}
//                     disabled={loading}
//                   >
//                     {loading ? "Saving..." : buttonLabel}
//                   </button>
//                 ) : (
//                   <button
//                     className="w-full bg-[#2fa7db] text-white  rounded-md mb-14 py-2 "
//                     onClick={handleUpDateClick}
//                     disabled={loading}
//                   >
//                     {loading ? "Updating..." : buttonLabel}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`More Details`}>
//         {croppedImageSource ? (
//           <div className="relative w-full aspect-square">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
//               <button
//                 onClick={cancelCrop}
//                 className="bg-red-500 text-white py-2 px-4 rounded"
//               >
//                 Cancel Crop
//               </button>
//               <button
//                 onClick={showCroppedImage}
//                 className="bg-blue-500 text-white py-2 px-4 rounded"
//               >
//                 Crop Image
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="px-4 pb-2 min-w-[330px]">
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Guardian Name:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="guardianName"
//                 name="guardianName"
//                 type="text"
//                 placeholder="Guardian Name"
//                 onChange={handleInputChange}
//                 value={values?.guardianName}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Mother Name:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="motherName"
//                 name="motherName"
//                 type="text"
//                 placeholder="Guardian Name"
//                 onChange={handleInputChange}
//                 value={values?.motherName}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Transport:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="transport"
//                 name="transport"
//                 type="text"
//                 placeholder="Transport"
//                 value={values?.transport}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Remarks:
//               </label>

//               <textarea
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="remarks"
//                 name="remarks"
//                 type="text"
//                 placeholder="Remarks"
//                 value={values?.remarks}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Father Photo:
//                 </label>
//                 {values?.fatherImage ? (
//                   <img
//                     src={
//                       values.fatherImage instanceof File
//                       ? URL.createObjectURL(values.fatherImage)
//                       :  values.fatherImage?.url 
                     
//                     }
//                     alt="mother Image"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     name="fatherImage"
//                     onChange={(e) => handlePhotoChange(e, "fatherImage")}
//                   />
//                 </label>
//               </div>
//             </div>
//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Mother Photo:
//                 </label>
//                 {values?.motherImage ? (
//                   <img
//                     src={
//                       values.motherImage instanceof File
//                       ? URL.createObjectURL(values.motherImage)
//                       :  values.motherImage?.url 
                    
//                     }
                   
//                     alt="mother Image"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     name="motherImage"
//                     onChange={(e) => handlePhotoChange(e, "motherImage")}
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Guardian Photo:
//                 </label>

//                 {values?.guardianImage ? (
//                   <img
//                     src={
//                       values.guardianImage instanceof File
//                       ? URL.createObjectURL(values.guardianImage)
//                       :  values.guardianImage?.url 
                     
//                     }
                  
//                     alt="Guardian"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     name="guardianImage"
//                     onChange={(e) => handlePhotoChange(e, "guardianImage")}
//                   />
//                 </label>
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </>
//   );
// }

// export default DynamicFormFileds;

// import React, { useState, useCallback, useEffect } from "react";
// import { Camera } from "lucide-react";
// import Cropper from "react-easy-crop";
// import getCroppedImg from "./getCroppedImg";
// import Modal from "../../Modal";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import Button from "../../utils/Button";
// import {
//   Admission,
//   thirdpartymystudents,
// } from "../../../Network/ThirdPartyApi";
// import { toast } from "react-toastify";
// import moment from "moment";

// function DynamicFormFileds(props) {
//   const [getClass, setGetClass] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [availableSections, setAvailableSections] = useState([]);
//   const { studentData, buttonLabel, setIsOpen, setReRender } = props;
//   const [isEdit, setIsEdit] = useState(false);
//   const [values, setValues] = useState({
//     admissionNumber: "",
//     rollNo: "",
//     fullName: "",
//     class: "",
//     section: "",
//     gender: "",
//     DOB: moment("1999-01-01").format("YYYY-MM-DD"),
//     // DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
//     fatherName: "",
//     motherName: "",
//     guardianName: "",
//     contact: "",
//     address: "",
//     studentImage: null,
//     motherImage: null,
//     fatherImage: null,
//     guardianImage: null,
//     transport: "",
//     remarks: "",
//   });

//   useEffect(() => {
//     const classes = JSON.parse(localStorage.getItem("classes"));
//     setGetClass(classes);
//   }, []);

//   console.log("studentData studentData",studentData)
//   console.log("value",values)
//   useEffect(() => {
//     if (studentData) {
//       setIsEdit(true);
//       setSelectedClass(studentData.class);
//       setSelectedSection(studentData.section); // Set section here as well
//       setValues((prev) => ({
//         ...studentData,
//         fatherName: studentData?.udisePlusDetails?.father_name || "", //Use defensive check
//         section: studentData?.section || "",
//         studentImage: studentData?.studentImage || null,
//         fatherImage: studentData?.fatherImage || null,
//         motherImage: studentData?.motherImage || null,
//         guardianImage: studentData?.guardianImage || null,
//         DOB:   moment(studentData?.dateOfBirth).format("YYYY-MMM-DD") || null,
//       }));
//     }
//   }, [studentData]);

//   const schoolID = localStorage.getItem("SchoolID");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setValues({
//         ...values,
//         studentImage: file,
//       });
//     }
//   };

//   const handleSaveClick = async () => {
//     const requiredFields = [
//       { key: "fullName", message: "Please Enter Name" },
//       // { key: "gender", message: "Please Enter Gender" },
//       // { key: "DOB", message: "Please Enter DOB" },
//       { key: "contact", message: "Please Enter Contact" },
//       { key: "fatherName", message: "Please Enter Father Name" },
//     ];

//     for (const field of requiredFields) {
//       if (!values?.[field.key]) {
//         toast.warn(field.message);
//         return;
//       }
//     }

//     if (!selectedClass) {
//       toast.warn("Please Enter Class");
//       return;
//     }

//     setLoading(true);

//     try {
//       const studentData = {
//         schoolId: schoolID,
//         studentFullName: values?.fullName || "",
//         studentEmail: `${values.fullName}${values.contact}@gmail.com` || "",
//         parentEmail: `${values.fatherName}${values.contact}@gmail.com` || "",
//         studentPassword: values?.contact || "",
//         parentPassword: values?.contact || "",
//         studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
//         studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
//         studentGender: values?.gender || "",
//         studentClass: selectedClass || "",
//         studentSection: selectedSection || "",
//         studentAddress: values?.address || "",
//         studentContact: values?.contact || "",
//         parentContact: values?.contact || "",
//         fatherName: values?.fatherName || "",
//         motherName: values?.motherName || "",
//         guardianName: values?.guardianName || "",
//         studentAdmissionNumber: values?.admissionNumber || "",
//         studentRollNo: values?.rollNo || "",
//         // studentImage: values?.studentImage || "",  // Handled Below
//         // motherImage: values?.motherImage || "",    // Handled Below
//         // fatherImage: values?.fatherImage || "",    // Handled Below
//         // guardianImage: values?.guardianImage || "",// Handled Below
//         remarks: values?.remarks || "",
//         transport: values?.transport || "",
//       };

//       const formDataToSend = new FormData();

//       Object.entries(studentData).forEach(([key, value]) => {
//         formDataToSend.append(key, String(value));  // Ensure all values are strings
//       });

//       // Handle image fields separately and conditionally
//       if (values.studentImage) {
//         formDataToSend.append("studentImage", values.studentImage);
//       }
//       if (values.fatherImage) {
//         formDataToSend.append("fatherImage", values.fatherImage);
//       }
//       if (values.motherImage) {
//         formDataToSend.append("motherImage", values.motherImage);
//       }
//       if (values.guardianImage) {
//         formDataToSend.append("guardianImage", values.guardianImage);
//       }

//       const response = await Admission(formDataToSend);

//       if (response.success) {
//         setValues({
//           admissionNumber: "",
//           fullName: "",
//           class: "",
//           section: "",
//           gender: "",
//           DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
//           fatherName: "",
//           motherName: "",
//           guardianName: "",
//           contact: "",
//           address: "",
//           studentImage: null,
//           motherImage: null,
//           fatherImage: null,
//           guardianImage: null,
//           remarks: "",
//         });
//         toast.success("Admission successfully!");
//         setReRender(true);
//         setIsOpen(false);
//       } else {
//         toast.error(response?.data?.message);
//       }
//     } catch (error) {
//       console.error("Error during admission:", error);
//       // toast.error("An error occurred during admission."); // User-friendly error
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleUpDateClick = async () => {
//     setLoading(true);
//     const studentId = studentData?._id;
  
//     try {
//       const studentDataForUpdate = {
//         schoolId: schoolID,
//         parentId: values?.parentId,
//         studentFullName: values?.fullName || "",
//         studentEmail: `${values?.fullName}${values?.contact}@gmail.com` || "",
//         studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
//         studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
//         studentGender: values?.gender || "",
//         studentClass: selectedClass || "",
//         studentSection: selectedSection || "",
//         studentAddress: values?.address || "",
//         studentContact: values?.contact || "",
//         contact: values?.contact || "", // For parent compatibility
//         fatherName: values?.fatherName || "",
//         motherName: values?.motherName || "",
//         guardianName: values?.guardianName || "",
//         studentAdmissionNumber: values?.admissionNumber || "",
//         remarks: values?.remarks || "", // Assuming this maps to udisePlusDetails or another field if needed
//       };
  
//       const formDataToSend = new FormData();
  
//       Object.entries(studentDataForUpdate).forEach(([key, value]) => {
//         formDataToSend.append(key, String(value));
//       });
  
//       // Conditionally append image files to FormData
//       if (values.studentImage instanceof File) {
//         formDataToSend.append("studentImage", values.studentImage);
//       }
//       if (values.fatherImage instanceof File) {
//         formDataToSend.append("fatherImage", values.fatherImage);
//       }
//       if (values.motherImage instanceof File) {
//         formDataToSend.append("motherImage", values.motherImage);
//       }
//       if (values.guardianImage instanceof File) {
//         formDataToSend.append("guardianImage", values.guardianImage);
//       }
  
//       // Update API call to match editAdmission endpoint
//       const response = await fetch(`https://eserver-i5sm.onrender.com/api/v1/thirdparty/admissions/${studentId}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth setup
//         },
//         body: formDataToSend,
//       });
  
//       const result = await response.json();
  
//       if (result.success) {
//         // setReRender(true);
//         setIsOpen(false);
//         toast.success("Update successfully!");
//         setValues({
//           admissionNumber: "",
//           fullName: "",
//           class: "",
//           section: "",
//           gender: "",
//           DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
//           fatherName: "",
//           motherName: "",
//           guardianName: "",
//           contact: "",
//           address: "",
//           studentImage: null,
//           motherImage: null,
//           fatherImage: null,
//           guardianImage: null,
//           remarks: "",
//         });
//       } else {
//         toast.error(result.message || "Failed to update admission");
//       }
//     } catch (error) {
//       console.error("Error updating student:", error);
//       // toast.error("An error occurred during update.");
//     } finally {
//       setLoading(false);
//     }}

  

//   // const handleUpDateClick = async () => {
//   //   setLoading(true);
//   //   const studentId = studentData?._id;

//   //   try {
//   //     const studentDataForUpdate = {
//   //       schoolId: schoolID,
//   //       parentId: values?.parentId,
//   //       fullName: values?.fullName || "",
//   //       email: `${values?.fullName}${values?.contact}@gmail.com` || "",
//   //       studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
//   //       studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
//   //       gender: values?.gender || "",
//   //       class: selectedClass || "",
//   //       section: selectedSection || "",
//   //       studentAddress: values?.address || "",
//   //       studentContact: values?.contact || "",
//   //       contact: values?.contact || "",
//   //       fatherName: values?.fatherName || "",
//   //       motherName: values?.motherName || "",
//   //       guardianName: values?.guardianName || "",
//   //       admissionNumber: values?.admissionNumber || "",
//   //       // studentImage: values?.studentImage || "", // Handle with FormData
//   //       // motherImage: values?.motherImage || "",   // Handle with FormData
//   //       // fatherImage: values?.fatherImage || "",   // Handle with FormData
//   //       // guardianImage: values?.guardianImage || "",// Handle with FormData
//   //       guardianRemarks: values?.remarks || "",
//   //     };

//   //     const formDataToSend = new FormData();

//   //     Object.entries(studentDataForUpdate).forEach(([key, value]) => {
//   //        formDataToSend.append(key, String(value));  // Ensure all values are strings
//   //     });

//   //     // Conditionally append image files to FormData
//   //     if (values.studentImage instanceof File) {
//   //       formDataToSend.append("studentImage", values.studentImage);
//   //     }
//   //     if (values.fatherImage instanceof File) {
//   //       formDataToSend.append("fatherImage", values.fatherImage);
//   //     }
//   //     if (values.motherImage instanceof File) {
//   //       formDataToSend.append("motherImage", values.motherImage);
//   //     }
//   //     if (values.guardianImage instanceof File) {
//   //       formDataToSend.append("guardianImage", values.guardianImage);
//   //     }
//   //     const response = await thirdpartymystudents(studentId, formDataToSend);

//   //     if (response.success) {
//   //       setReRender(true);
//   //       setIsOpen(false);
//   //       toast.success("Update successfully!");
//   //       setValues({
//   //         admissionNumber: "",
//   //         fullName: "",
//   //         class: "",
//   //         section: "",
//   //         gender: "",
//   //         dob: "",
//   //         fatherName: "",
//   //         motherName: "",
//   //         guardianName: "",
//   //         contact: "",
//   //         address: "",
//   //         studentImage: null,
//   //         motherImage: null,
//   //         fatherImage: null,
//   //         guardianImage: null,
//   //         remarks: "",
//   //       });
//   //     } else {
//   //       toast.error(response?.message);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error updating student:", error);
//   //     toast.error("An error occurred during update."); //User-friendly error message.
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const [modalOpen, setModalOpen] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [croppedImageSource, setCroppedImageSource] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [currentPhotoType, setCurrentPhotoType] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handlePhotoChange = (e, photoType) => {
//     const file = e.target.files?.[0];

//     if (file) {
//       setCurrentPhotoType(photoType);
//       setValues((prev) => ({ ...prev, [photoType + "Image"]: file }));
//     }
//   };

//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const cancelCrop = useCallback(() => {
//     setCroppedImageSource(null);
//   }, [setCroppedImageSource]);

//   const showCroppedImage = async () => {
//     try {
//       const croppedImageUrl = await getCroppedImg(
//         croppedImageSource,
//         croppedAreaPixels
//       );
//       setCroppedImageSource(null);

//       switch (currentPhotoType) {
//         case "fatherImage":
//           setValues((prev) => ({ ...prev, fatherImage: croppedImageUrl }));
//           break;
//         case "motherImage":
//           setValues((prev) => ({ ...prev, motherImage: croppedImageUrl }));
//           break;
//         case "guardianImage":
//           setValues((prev) => ({ ...prev, guardianImage: croppedImageUrl }));
//           break;
//         default:
//           setValues((prev) => ({ ...prev, studentImage: croppedImageUrl }));
//           break;
//       }
//       setCurrentPhotoType(null);
//     } catch (error) {
//       console.error("Error cropping image:", error);
//     }
//   };

//   const handleMoreDetails = () => {
//     setModalOpen(true);
//   };

//   const handleClassChange = (e) => {
//     const selectedClassName = e.target.value;
//     setSelectedClass(selectedClassName);
//     setSelectedSection("");

//     if (selectedClassName === "all") {
//       setAvailableSections([]);
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

//   if (croppedImageSource) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg p-4 w-full max-w-md">
//           <div className="relative h-64 w-full">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => setCroppedImageSource(null)}
//               className="px-4 py-2 bg-gray-200 rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={showCroppedImage}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md"
//             >
//               Crop
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div class="selection:bg-[#2fa7db] selection:text-white">
//         <div class=" flex justify-center ">
//           <div class="flex-1 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] m-2">
//             <div class="w-full bg-white  mx-auto overflow-hidden ">
//               <div
//                 class="relative h-[130px] px-5 pt-1
//                rounded-bl-4xl"
//               >
//                 <h1 class="absolute top-0  text-xl font-semibold text-white pl-2">
//                   Student Details
//                 </h1>
//                 <div className="flex justify-end  items-center mb-6">
//                   <Button
//                     name=" More Details"
//                     color="#59b3da"
//                     onClick={() => handleMoreDetails()}
//                     className="text-[#ee582c] m-2"
//                   />
//                 </div>
//                 <div className="flex ml-2 mb-6">
//                   <div className="absolute top-5">
//                     {values?.studentImage ? (
//                       <img
//                         src={
//                           values.studentImage instanceof File
//                             ? URL.createObjectURL(values.studentImage)
//                             :  values.studentImage?.url 
//                             // ? values.studentImage?.url 
//                             // : ""
//                         }
//                         // src={
//                         //   typeof values.studentImage
//                         //     ? values.studentImage?.url
//                         //     : values.studentImage instanceof File
//                         //     ? URL.createObjectURL(values.studentImage)
//                         //     : ""
//                         // }
//                         // src={
//                         //   typeof values.studentImage === "string"
//                         //     ? values.studentImage
//                         //     : values.studentImage instanceof File
//                         //     ? URL.createObjectURL(values.studentImage)
//                         //     : ""
//                         // }
//                         alt="studentImage"
//                         className="w-20 h-20 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                         <span className="text-[#ee582c]">NO IMAGE</span>
//                       </div>
//                     )}
//                     <label className="absolute bottom-0 right-0 bg-[#ee582c] text-white p-2 rounded-full cursor-pointer">
//                       <Camera size={18} />
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>
//               <div class="px-6 pb-8 bg-white rounded-tr-4xl ">
//                 <form class="" action="" method="POST">
                 
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fullName"
//                       placeholder="Student Name"
//                       value={values?.fullName}
//                       onChange={handleInputChange}
//                       id="fullName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fullName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                     Student Name
//                     </label>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fatherName"
//                       placeholder="Father Name"
//                       value={values?.fatherName}
//                       onChange={handleInputChange}
//                       id="fatherName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fatherName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Father Name
//                     </label>
//                   </div>

//                   <div className="flex justify-center items-center gap-2">
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" },
//                         "& .MuiSelect-root": { color: "#2fa7db" },
//                         "& .MuiSelect-icon": { color: "#ee582c" },
//                         "&:before": { borderBottom: "2px solid #ee582c" },
//                         "&:after": { borderBottom: "2px solid #ee582c" },
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Class
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         value={selectedClass}
//                         onChange={handleClassChange}
//                         label="Class"
//                         name="studentclass"
//                         sx={{
//                           color: "#2fa7db",
//                           "& .MuiSelect-icon": { color: "#ee582c" },
//                           "&:before": { borderBottom: "2px solid #ee582c" },
//                           "&:after": { borderBottom: "2px solid #ee582c" },
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c",
//                           },
//                         }}
//                       >
//                         {getClass?.map((cls, index) => (
//                           <MenuItem key={index} value={cls.className}>
//                             {cls?.className}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" },
//                         "& .MuiSelect-root": { color: "#ee582c" },
//                         "& .MuiSelect-icon": { color: "#ee582c" },
//                         "&:before": { borderBottom: "2px solid #ee582c" },
//                         "&:after": { borderBottom: "2px solid #ee582c" },
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Section
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         value={selectedSection}
//                         onChange={handleSectionChange}
//                         label="Section"
//                         name="studentSection"
//                         sx={{
//                           color: "#2fa7db",
//                           "& .MuiSelect-icon": { color: "#ee582c" },
//                           "&:before": { borderBottom: "2px solid #ee582c" },
//                           "&:after": { borderBottom: "2px solid #ee582c" },
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c",
//                           },
//                         }}
//                       >
//                         {availableSections?.map((item, index) => (
//                           <MenuItem key={index} value={item}>
//                             {item}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </div>
//                   <div className="flex justify-center items-center gap-2">
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" },
//                         "& .MuiSelect-root": { color: "#ee582c" },
//                         "& .MuiSelect-icon": { color: "#ee582c" },
//                         "&:before": { borderBottom: "2px solid #ee582c" },
//                         "&:after": { borderBottom: "2px solid #ee582c" },
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Gender
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         value={values?.gender}
//                         onChange={handleInputChange}
//                         label="Gender"
//                         name="gender"
//                         sx={{
//                           color: "#2fa7db",
//                           "& .MuiSelect-icon": { color: "#ee582c" },
//                           "&:before": { borderBottom: "2px solid #ee582c" },
//                           "&:after": { borderBottom: "2px solid #ee582c" },
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c",
//                           },
//                         }}
//                       >
//                         <MenuItem value="Male">Male</MenuItem>
//                         <MenuItem value="Female">Female</MenuItem>
//                         <MenuItem value="Other">Other</MenuItem>
//                       </Select>
//                     </FormControl>
//                     {
//                       console.log("values?.dateOfBirth",values?.dateOfBirth)
//                     }
//                     <div class="relative mt-4 w-full">
//                     <input
//   type="date"
//   name="DOB"
//   placeholder="Enter DOB"
//   value={(values?.dateOfBirth ? moment(values?.dateOfBirth).format("YYYY-MM-DD") : values?.DOB )}
//   onChange={handleInputChange}
//   id="DOB"
//   className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
// />

//                       {/* <input
//                         type="date"
//                         name="DOB"
//                         placeholder="Enter DOB"
//                         value={values?.DOB ||  moment(values?.dateOfBirth).format("YYYY-MM-DD")}
//                         onChange={handleInputChange}
//                         id="DOB"
//                         className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                       /> */}
//                       <label
//                         for="DOB"
//                         class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                       >
//                         Enter DOB
//                       </label>
//                     </div>
//                   </div>
                  




//                   <div className="flex justify-center items-center gap-2 w-full mt-4">
//                     {/* <div class="relative w-full">
//                       <input
//                         type="text"
//                         name="admissionNumber"
//                         maxLength="6"
//                         value={values?.admissionNumber}
//                         onChange={handleInputChange}
//                         id="admissionNumber"
//                         className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                         placeholder="admissionNumber"
//                       />
//                       <label
//                         for="admissionNumber"
//                         class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                       >
//                         Admission No.
//                       </label>
//                     </div> */}

//                     <div class="relative w-full">
//                       <input
//                         maxLength="3"
//                         type="text"
//                         name="rollNo"
//                         placeholder="Roll Number"
//                         value={values?.rollNo}
//                         onChange={handleInputChange}
//                         id="rollNo"
//                         className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                       />
//                       <label
//                         for="rollNo"
//                         class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                       >
//                         Roll Number
//                       </label>
//                     </div>
//                     <div class="relative  w-full">
//                     <input
//                       type="number"
//                       maxlength="10"
//                       name="contact"
//                       placeholder="Contact No."
//                       value={values?.contact}
//                       onChange={handleInputChange}
//                       id="contact"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="contact"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Contact No.
//                     </label>
//                   </div>
//                   </div>



                 
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="address"
//                       placeholder="Enter Address"
//                       value={values?.address}
//                       onChange={handleInputChange}
//                       id="address"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="address"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Address
//                     </label>
//                   </div>
//                 </form>
//               </div>
//               <div className="px-4  shadow-xl bg-white ">
//                 {buttonLabel === "Save" ? (
//                   <button
//                     className="w-full bg-[#2fa7db] text-white  rounded-md mb-5 py-2 "
//                     onClick={handleSaveClick}
//                     disabled={loading}
//                   >
//                     {loading ? "Saving..." : buttonLabel}
//                   </button>
//                 ) : (
//                   <button
//                     className="w-full bg-[#2fa7db] text-white  rounded-md mb-14 py-2 "
//                     onClick={handleUpDateClick}
//                     disabled={loading}
//                   >
//                     {loading ? "Updating..." : buttonLabel}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`More Details`}>
//         {croppedImageSource ? (
//           <div className="relative w-full aspect-square">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
//               <button
//                 onClick={cancelCrop}
//                 className="bg-red-500 text-white py-2 px-4 rounded"
//               >
//                 Cancel Crop
//               </button>
//               <button
//                 onClick={showCroppedImage}
//                 className="bg-blue-500 text-white py-2 px-4 rounded"
//               >
//                 Crop Image
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="px-4 pb-2 min-w-[330px]">
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Guardian Name:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="guardianName"
//                 name="guardianName"
//                 type="text"
//                 placeholder="Guardian Name"
//                 onChange={handleInputChange}
//                 value={values?.guardianName}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Transport:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="transport"
//                 name="transport"
//                 type="text"
//                 placeholder="Transport"
//                 value={values?.transport}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Remarks:
//               </label>

//               <textarea
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="remarks"
//                 name="remarks"
//                 type="text"
//                 placeholder="Remarks"
//                 value={values?.remarks}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Father Photo:
//                 </label>
//                 {values?.fatherImage ? (
//                   <img
//                     src={
//                       values.fatherImage instanceof File
//                       ? URL.createObjectURL(values.fatherImage)
//                       :  values.fatherImage?.url 
//                       // typeof values.fatherImage
//                       //   ? values.fatherImage?.url
//                       //   : values.fatherImage instanceof File
//                       //   ? URL.createObjectURL(values.fatherImage)
//                       //   : ""
//                     // src={
//                     //   typeof values.fatherImage === "string"
//                     //     ? values.fatherImage
//                     //     : values.fatherImage instanceof File
//                     //     ? URL.createObjectURL(values.fatherImage)
//                     //     : ""
//                     }
//                     alt="mother Image"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     name="fatherImage"
//                     onChange={(e) => handlePhotoChange(e, "fatherImage")}
//                   />
//                 </label>
//               </div>
//             </div>
//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Mother Photo:
//                 </label>
//                 {values?.motherImage ? (
//                   <img
//                     src={
//                       values.motherImage instanceof File
//                       ? URL.createObjectURL(values.motherImage)
//                       :  values.motherImage?.url 
//                       // typeof values.motherImage
//                       //   ? values.motherImage?.url
//                       //   : values.motherImage instanceof File
//                       //   ? URL.createObjectURL(values.motherImage)
//                       //   : ""
//                     }
//                     // src={
//                     //   typeof values.motherImage === "string"
//                     //     ? values.motherImage
//                     //     : values.motherImage instanceof File
//                     //     ? URL.createObjectURL(values.motherImage)
//                     //     : ""
//                     // }
//                     alt="mother Image"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     name="motherImage"
//                     onChange={(e) => handlePhotoChange(e, "motherImage")}
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Guardian Photo:
//                 </label>

//                 {values?.guardianImage ? (
//                   <img
//                     src={
//                       values.guardianImage instanceof File
//                       ? URL.createObjectURL(values.guardianImage)
//                       :  values.guardianImage?.url 
//                       // typeof values.guardianImage
//                       //   ? values.guardianImage?.url
//                       //   : values.guardianImage instanceof File
//                       //   ? URL.createObjectURL(values.guardianImage)
//                       //   : ""
//                     }
//                     // src={
//                     //   typeof values.guardianImage === "string"
//                     //     ? values.guardianImage
//                     //     : values.guardianImage instanceof File
//                     //     ? URL.createObjectURL(values.guardianImage)
//                     //     : ""
//                     // }
//                     alt="Guardian"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     name="guardianImage"
//                     onChange={(e) => handlePhotoChange(e, "guardianImage")}
//                   />
//                 </label>
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </>
//   );
// }

// export default DynamicFormFileds;





// import React, { useState, useCallback, useEffect } from "react";
// import { Camera } from "lucide-react";
// import Cropper from "react-easy-crop";
// import getCroppedImg from "./getCroppedImg";

// import Modal from "../../Modal";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import Button from "../../utils/Button";
// import {
//   Admission,
//   thirdpartymystudents,
// } from "../../../Network/ThirdPartyApi";
// import { toast } from "react-toastify";
// import moment from "moment";

// function DynamicFormFileds(props) {
//   const [getClass, setGetClass] = useState([]);

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [availableSections, setAvailableSections] = useState([]);
//   const { studentData, buttonLabel, setIsOpen, setReRender } = props;
//   console.log("studentData", studentData);
//   useEffect(() => {
//     setSelectedClass(studentData?.class);
//   }, [studentData]);
//   const [isEdit, setIsEdit] = useState(false);
//   const [values, setValues] = useState({
//     admissionNumber: "",
//     rollNo: "",
//     fullName: "",
//     class: "",
//     section: "",
//     gender: "",
//     DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
//     fatherName: "",
//     motherName: "",
//     guardianName: "",
//     contact: "",
//     address: "",
//     studentImage: null,
//     motherImage: null,
//     fatherImage: null,
//     guardianImage: null,
//     transport: "",
//     remarks: "",
//   });

//   useEffect(() => {
//     const classes = JSON.parse(localStorage.getItem("classes"));
//     setGetClass(classes);
//   }, []);
//   useEffect(() => {
//     // Getclasses()
//     setIsEdit(true);
//     setValues((preV) => ({
//       ...studentData,
//       fatherName: studentData?.udisePlusDetails?.father_name,
//       section: studentData?.section,
//       studentImage: studentData?.studentImage || null, // Ensure it's null if no image
//       fatherImage: studentData?.fatherImage || null,
//       motherImage: studentData?.motherImage || null,
//       guardianImage: studentData?.guardianImage || null,
//     }));
//   }, [studentData]);
//   const schoolID = localStorage.getItem("SchoolID");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setValues({
//         ...values,
//         studentImage: file,
//       });
//     }
//   };

//   const handleSaveClick = async () => {
//     const requiredFields = [
//       { key: "fullName", message: "Please Enter Name" },
//       { key: "gender", message: "Please Enter Gender" },
//       { key: "DOB", message: "Please Enter DOB" },
//       { key: "contact", message: "Please Enter Contact" },
//       { key: "fatherName", message: "Please Enter Father Name" },
   
//     ];
//     for (const field of requiredFields) {
//       if (!values?.[field.key]) {
//         toast.warn(field.message);
//         return;
//       }
//     }
//     if(!selectedClass){
//       toast.warn("Please Enter Class")
//       return
//     }
 
//     setLoading(true);
//     try {
//       const studentData = {
//         schoolId: schoolID,
//         studentFullName: values?.fullName || "",
//         studentEmail: `${values.fullName}${values.contact}@gmail.com` || "", // Add these fields as needed
//         parentEmail: `${values.fatherName}${values.contact}@gmail.com` || "", // Add these fields as needed
//         studentPassword: values?.contact || "",
//         parentPassword: values?.contact || "",
//         studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
//         studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
//         studentGender: values?.gender || "",
//         studentClass: selectedClass || "",
//         studentSection: selectedSection || "",
//         studentAddress: values?.address || "",
//         studentContact: values?.contact || "",
//         parentContact: values?.contact || "",
//         fatherName: values?.fatherName || "",
//         motherName: values?.motherName || "",
//         guardianName: values?.guardianName || "",
//         studentAdmissionNumber: values?.admissionNumber || "",
//         studentRollNo: values?.rollNo || "",
//         studentImage: values?.studentImage || "",
//         motherImage: values?.motherImage || "",
//         fatherImage: values?.fatherImage || "",
//         guardianImage: values?.guardianImage || "",
//         remarks: values?.remarks || "",
//         transport: values?.transport || "",
//       };

//       const formDataToSend = new FormData();
//       Object.entries(studentData).forEach(([key, value]) => {
//         // Handle multiple image fields
//         if (
//           [
//             "studentImage",
//             "guardianImage",
//             "fatherImage",
//             "motherImage",
//           ].includes(key) &&
//           value
//         ) {
//           formDataToSend.append(key, value);
//         } else {
//           // Convert all other values to strings and append
//           formDataToSend.append(key, String(value));
//         }
//       });

//       const response = await Admission(formDataToSend);
//       console.log("response", response);

//       if (response.success) {
//         toast.success("Admission successfully!");
//         setReRender(true);
//       } else {
//         toast.error(response?.data?.message);
//       }
//     } catch (error) {
//       console.log("error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("values",values)
//   const handleUpDateClick = async () => {
//     setLoading(true);
//     const studentId = studentData?._id;
  
//     try {
//       const studentData = {
//         schoolId: schoolID,
//         parentId: values?.parentId,
//         fullName: values?.fullName || "",
//         email: `${values?.fullName}${values?.contact}@gmail.com` || "",
//         studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
//         studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
//         gender: values?.gender || "",
//         class: selectedClass || "",
//         section: selectedSection || "",
//         studentAddress: values?.address || "",
//         studentContact: values?.contact || "",
//         contact: values?.contact || "",
//         fatherName: values?.fatherName || "",
//         motherName: values?.motherName || "",
//         guardianName: values?.guardianName || "",
//         admissionNumber: values?.admissionNumber || "",
//         studentImage: values?.studentImage || "",
//         motherImage: values?.motherImage || "",
//         fatherImage: values?.fatherImage || "",
//         guardianImage: values?.guardianImage || "",
//         // studentImage: values?.studentImage instanceof File ? values?.studentImage : "",
//         // motherImage: values?.motherImage instanceof File ? values?.motherImage : "",
//         // fatherImage: values?.fatherImage instanceof File ? values?.fatherImage : "",
//         // guardianImage: values?.guardianImage instanceof File ? values?.guardianImage : "",
//         guardianRemarks: values?.remarks || "",
//       };
  
//       console.log("studentData", studentData);
  
//       const formDataToSend = new FormData();
  
//       Object.entries(studentData).forEach(([key, value]) => {
   
//       if (
//         [
//           "studentImage",
//           "guardianImage",
//           "fatherImage",
//           "motherImage",
//         ].includes(key) &&
//         value
//       ) {
//         formDataToSend.append(key, value);
//       } else {
//         // Convert all other values to strings and append
//         formDataToSend.append(key, String(value));
//       }
//     });

//       console.log("formDataToSend",formDataToSend)
  
//       const response = await thirdpartymystudents(studentId, formDataToSend);
  
//       if (response.success) {
//         setReRender(true);
//         setIsOpen(false);
//         toast.success("Update successfully!");
//         setValues({
//           admissionNumber: "",
//           fullName: "",
//           class: "",
//           section: "",
//           gender: "",
//           dob: "",
//           fatherName: "",
//           motherName: "",
//           guardianName: "",
//           contact: "",
//           address: "",
//           studentImage: null,
//           motherImage: null,
//           fatherImage: null,
//           guardianImage: null,
//           remarks: "",
//         });
//       } else {
//         toast.error(response?.message);
//       }
//     } catch (error) {
//       console.error("Error updating student:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const [modalOpen, setModalOpen] = useState(false);

//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [croppedImageSource, setCroppedImageSource] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [currentPhotoType, setCurrentPhotoType] = useState(null); // new state

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handlePhotoChange = (e, photoType) => {
//     const file = e.target.files?.[0];

//     if (file) {
     
//       setCurrentPhotoType(photoType); // Set the type (father, mother, guardian)
//       setValues((prev) => ({ ...prev, [photoType + "Image"]: file }));
  
//     }
//   };
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);
//   const cancelCrop = useCallback(() => {
//     setCroppedImageSource(null);
//   }, [setCroppedImageSource]);

//   const showCroppedImage = async () => {
//     try {
//       const croppedImageUrl = await getCroppedImg(
//         croppedImageSource,
//         croppedAreaPixels
//       );
//       setCroppedImageSource(null);
//       switch (currentPhotoType) {
//         case "father":
//           setValues((prev) => ({ ...prev, fatherImage: croppedImageUrl }));
//           break;
//         case "mother":
//           setValues((prev) => ({ ...prev, motherImage: croppedImageUrl }));
//           break;
//         case "guardian":
//           setValues((prev) => ({ ...prev, guardianImage: croppedImageUrl }));
//           break;
//         default:
//           setValues((prev) => ({ ...prev, studentImage: croppedImageUrl })); // Main photo
//           break;
//       }
//       setCurrentPhotoType(null);
//     } catch (error) {
//       console.error("Error cropping image:", error);
//     }
//   };

//   const handleMoreDetails = () => {
//     setModalOpen(true);
//   };

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

 
//   if (croppedImageSource) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg p-4 w-full max-w-md">
//           <div className="relative h-64 w-full">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => setCroppedImageSource(null)}
//               className="px-4 py-2 bg-gray-200 rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={showCroppedImage}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md"
//             >
//               Crop
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div class="selection:bg-[#2fa7db] selection:text-white">
//         <div class=" flex justify-center ">
//           <div class="flex-1 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] m-2">
//             <div class="w-full bg-white  mx-auto overflow-hidden ">
//               <div
//                 class="relative h-[130px] px-5 pt-1 
            
//                rounded-bl-4xl"
//               >
//                 <h1 class="absolute top-0  text-xl font-semibold text-white pl-2">
//                   Student Details
//                 </h1>
//                 <div className="flex justify-end  items-center mb-6">
//                   <Button
//                     name=" More Details"
//                     color="#59b3da"
//                     onClick={() => handleMoreDetails()}
//                     className="text-[#ee582c] m-2"
//                   />
//                 </div>
//                 <div className="flex ml-2 mb-6">
//                   <div className="absolute top-5">
//                     {values?.studentImage ? (
//                       <img
//                         src={
//                           typeof values.studentImage === "string"
//                             ? values.studentImage
//                             : values.studentImage instanceof File
//                             ? URL.createObjectURL(values.studentImage)
//                             : ""
//                         }
//                         alt="studentImage"
//                         className="w-20 h-20 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                         <span className="text-[#ee582c]">NO IMAGE</span>
//                       </div>
//                     )}
                   
//                     <label className="absolute bottom-0 right-0 bg-[#ee582c] text-white p-2 rounded-full cursor-pointer">
//                       <Camera size={18} />
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         // onChange={(e) => handlePhotoChange(e, "student")}
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>
//               <div class="px-6 pb-8 bg-white rounded-tr-4xl ">
//                 <form class="" action="" method="POST">
//                   <div className="flex justify-center items-center gap-2 w-full">
//                     <div class="relative w-full">
//                       <input
//                         type="text"
//                         name="admissionNumber"
//                         maxLength="6"
//                         value={values?.admissionNumber}
//                         onChange={handleInputChange}
//                         id="admissionNumber"
//                         className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                         placeholder="admissionNumber"
//                       />
//                       <label
//                         for="admissionNumber"
//                         class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                       >
//                         Admission No.
//                       </label>
//                     </div>

//                     <div class="relative w-full">
//                       <input
//                         maxLength="3"
//                         type="text"
//                         name="rollNo"
//                         placeholder="Enter Roll Number"
//                         value={values?.rollNo}
//                         onChange={handleInputChange}
//                         id="rollNo"
//                         className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                       />
//                       <label
//                         for="rollNo"
//                         class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                       >
//                         Enter Roll Number
//                       </label>
//                     </div>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fullName"
//                       placeholder="Enter Student Name"
//                       value={values?.fullName}
//                       onChange={handleInputChange}
//                       id="fullName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fullName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Student Name
//                     </label>
//                   </div>

//                   <div className="flex justify-center items-center gap-2">
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         // minWidth: 120,
//                         //  width:300

//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                         "& .MuiSelect-root": { color: "#2fa7db" }, // Selected text color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Class
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         // value={values?.class}
//                         // onChange={handleInputChange}
//                         value={selectedClass}
//                         onChange={handleClassChange}
//                         label="Class"
//                         name="studentclass"
//                         sx={{
//                           color: "#2fa7db", // Selected text color
//                           "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                           "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                           "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c", // Hover border color
//                           },
//                         }}
//                       >
//                         {getClass?.map((cls, index) => (
//                           <MenuItem key={index} value={cls.className}>
//                             {" "}
//                             {cls?.className}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         // minWidth: 120,
//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                         "& .MuiSelect-root": { color: "#ee582c" }, // Selected text color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Section
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         // value={values?.section}
//                         // onChange={handleInputChange}
//                         value={selectedSection}
//                         onChange={handleSectionChange}
//                         label="Section"
//                         name="studentSection"
//                         sx={{
//                           color: "#2fa7db", // Selected text color
//                           "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                           "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                           "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c", // Hover border color
//                           },
//                         }}
//                       >
//                         {availableSections?.map((item, index) => (
//                           <MenuItem key={index} value={item}>
//                             {" "}
//                             {item}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </div>
//                   <div className="flex justify-center items-center gap-2">
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         // minWidth: 120,

//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                         "& .MuiSelect-root": { color: "#ee582c" }, // Selected text color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Gender
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         value={values?.gender}
//                         onChange={handleInputChange}
//                         label="Gender"
//                         name="gender"
//                         sx={{
//                           color: "#2fa7db", // Selected text color
//                           // backgroundColor: "black", // Background color
//                           "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                           "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                           "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c", // Hover border color
//                           },
//                         }}
//                       >
//                         <MenuItem value="Male">Male</MenuItem>
//                         <MenuItem value="Female">Female</MenuItem>
//                         <MenuItem value="Other">Other</MenuItem>
//                       </Select>
//                     </FormControl>
//                     <div class="relative mt-4 w-full">
//                       <input
//                         type="date"
//                         name="DOB"
//                         placeholder="Enter DOB"
//                         value={values?.DOB}
//                         onChange={handleInputChange}
//                         id="DOB"
//                         className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                       />
//                       <label
//                         for="DOB"
//                         class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                       >
//                         Enter DOB
//                       </label>
//                     </div>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fatherName"
//                       placeholder="Enter Father Name"
//                       value={values?.fatherName}
//                       onChange={handleInputChange}
//                       id="fatherName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fatherName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Father Name
//                     </label>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       maxlength="10"
//                       name="contact"
//                       placeholder="Contact No."
//                       value={values?.contact}
//                       onChange={handleInputChange}
//                       id="contact"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="contact"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Contact No.
//                     </label>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="address"
//                       placeholder="Enter Address"
//                       value={values?.address}
//                       onChange={handleInputChange}
//                       id="address"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="address"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Address
//                     </label>
//                   </div>
//                 </form>
//               </div>
//               <div className="px-4  shadow-xl bg-white ">
//                 {buttonLabel === "Save" ? (
//                   <button
//                     className="w-full bg-[#2fa7db] text-white  rounded-md mb-5 py-2 "
//                     onClick={handleSaveClick}
//                     // onClick={ handleSaveClick}
//                     disabled={loading}
//                   >
//                     {loading ? "Saving..." : buttonLabel}
//                   </button>
//                 ) : (
//                   <button
//                     className="w-full bg-[#2fa7db] text-white  rounded-md mb-14 py-2 "
//                     onClick={handleUpDateClick}
//                     disabled={loading}
//                   >
//                     {loading ? "Updating..." : buttonLabel}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`More Details`}>
//         {croppedImageSource ? (
//           <div className="relative w-full aspect-square">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
//               <button
//                 onClick={cancelCrop}
//                 className="bg-red-500 text-white py-2 px-4 rounded"
//               >
//                 Cancel Crop
//               </button>
//               <button
//                 onClick={showCroppedImage}
//                 className="bg-blue-500 text-white py-2 px-4 rounded"
//               >
//                 Crop Image
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="px-4 pb-2 min-w-[330px]">
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Guardian Name:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="guardianName"
//                 name="guardianName"
//                 type="text"
//                 placeholder="Guardian Name"
//                 onChange={handleInputChange}
//                 value={values?.guardianName}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Transport:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="transport"
//                 name="transport"
//                 type="text"
//                 placeholder="Transport"
//                 value={values?.transport}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Remarks:
//               </label>

//               <textarea
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="remarks"
//                 name="remarks"
//                 type="text"
//                 placeholder="Remarks"
//                 value={values?.remarks}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Father Photo:
//                 </label>
//                 {values?.fatherImage ? (
//                   <img
//                     src={
//                       typeof values.fatherImage === "string"
//                         ? values.fatherImage
//                         : values.fatherImage instanceof File
//                         ? URL.createObjectURL(values.fatherImage)
//                         : ""
//                     }
//                     alt="mother Image"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
               
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     name="father"
//                     onChange={(e) => handlePhotoChange(e, "father")}
//                   />
//                 </label>
//               </div>
//             </div>
//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Mother Photo: 
//                 </label>
//                 {values?.motherImage ? (
//                   <img
//                     src={
//                       typeof values.motherImage === "string"
//                         ? values.motherImage
//                         : values.motherImage instanceof File
//                         ? URL.createObjectURL(values.motherImage)
//                         : ""
//                     }
//                     alt="mother Image"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
              
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     name="mother"
//                     onChange={(e) => handlePhotoChange(e, "mother")}
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Guardian Photo:
//                 </label>
               
//                 {values?.guardianImage ? (
//                   <img
//                     src={
//                       typeof values.guardianImage === "string"
//                         ? values.guardianImage
//                         : values.guardianImage instanceof File
//                         ? URL.createObjectURL(values.guardianImage)
//                         : ""
//                     }
//                     alt="Guardian"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     name="guardian"
//                     onChange={(e) => handlePhotoChange(e, "guardian")}
//                   />
//                 </label>
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </>
//   );
// }

// export default DynamicFormFileds;

// import React, { useState, useCallback, useEffect } from "react";
// import { Camera } from "lucide-react";
// import Cropper from "react-easy-crop";
// import getCroppedImg from "./getCroppedImg";

// import Modal from "../../Modal";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import Button from "../../utils/Button";
// import { Admission, thirdpartymystudents } from "../../../Network/ThirdPartyApi";
// import { toast } from "react-toastify";
// import moment from "moment";

// function DynamicFormFileds(props) {
//   const [getClass, setGetClass] = useState([]);

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [availableSections, setAvailableSections] = useState([]);
//   const { studentData, buttonLabel, setIsOpen, setReRender } = props;
//   console.log("studentData", studentData);
//   useEffect(() => {
//     setSelectedClass(studentData?.class);
//   }, [studentData]);
//   const [isEdit, setIsEdit] = useState(false);
//   const [values, setValues] = useState({
//     admissionNumber: "",
//     rollNo: "",
//     fullName: "",
//     class: "",
//     section: "",
//     gender: "",
//     DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
//     fatherName: "",
//     motherName: "",
//     guardianName: "",
//     contact: "",
//     address: "",
//     studentImage: null,
//     motherImage: null,
//     fatherImage: null,
//     guardianImage: null,
//     transport: "",
//     remarks: "",
//   });

//   useEffect(() => {
//     const classes = JSON.parse(localStorage.getItem("classes"));
//     setGetClass(classes);
//   }, []);
//   useEffect(() => {
//     // Getclasses()
//     setIsEdit(true);
//     setValues(studentData);
//     setValues((preV) => ({
//       ...preV,
//       fatherName: studentData?.udisePlusDetails?.father_name,
//       section: studentData?.section,
//     }));
//   }, [studentData]);
//   const schoolID = localStorage.getItem("SchoolID");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setValues({
//         ...values,
//         studentImage: file,
//       });
//     }
//   };

//   const handleSaveClick = async () => {
//     setLoading(true);
//     try {
//       const studentData = {
//         schoolId: schoolID,
//         studentFullName: values?.fullName || "",
//         studentEmail: `${values.fullName}${values.contact}@gmail.com` || "", // Add these fields as needed
//         parentEmail: `${values.fatherName}${values.contact}@gmail.com` || "", // Add these fields as needed
//         studentPassword: values?.contact || "",
//         parentPassword: values?.contact || "",
//         studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
//         studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
//         studentGender: values?.gender || "",
//         studentClass: selectedClass || "",
//         studentSection: selectedSection || "",
//         studentAddress: values?.address || "",
//         studentContact: values?.contact || "",
//         parentContact: values?.contact || "",
//         fatherName: values?.fatherName || "",
//         motherName: values?.motherName || "",
//         guardianName: values?.guardianName || "",
//         studentAdmissionNumber: values?.admissionNumber || "",
//         studentRollNo: values?.rollNo || "",
//         studentImage: values?.studentImage || "",
//         motherImage: values?.motherImage || "",
//         fatherImage: values?.fatherImage || "",
//         guardianImage: values?.guardianImage || "",
//         guardianName: values?.guardianName || "",
//         remarks: values?.remarks || "",
//         transport: values?.transport || "",
//       };

//       const formDataToSend = new FormData();
//       Object.entries(studentData).forEach(([key, value]) => {
//         // Handle multiple image fields
//         if (
//           ["studentImage", "guardianImage", "fatherImage", "motherImage"].includes(
//             key
//           ) &&
//           value
//         ) {
//           formDataToSend.append(key, value);
//         } else {
//           // Convert all other values to strings and append
//           formDataToSend.append(key, String(value));
//         }
//       });

//       const response = await Admission(formDataToSend);
//       console.log("response", response);

//       if (response.success) {
//         toast.success("Admission successfully!");
//         setReRender(true);
//       } else {
//         toast.error(response?.data?.message);
//       }
//     } catch (error) {
//       console.log("error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpDateClick = async () => {
//     setLoading(true);
//     const studentId = studentData?._id;
//     try {
//       const studentData = {
//         schoolId: schoolID,
//         fullName: values?.fullName || "",
//         email: `${values?.fullName}${values?.contact}@gmail.com` || "", // Add these fields as needed
//         studentDateOfBirth: moment(values?.DOB).format("DD-MMM-YYYY") || "",
//         studentJoiningDate: moment(new Date()).format("DD-MMM-YYYY") || "",
//         gender: values?.gender || "",
//         class: selectedClass || "",
//         section: selectedSection || "",
//         studentAddress: values?.address || "",
//         studentContact: values?.contact || "",
//         contact: values?.contact || "",
//         fatherName: values?.fatherName || "",
//         motherName: values?.motherName || "",
//         guardianName: values?.guardianName || "",
//         admissionNumber: values?.admissionNumber || "",
//         studentImage: values?.studentImage || "",
//         motherImage: values?.motherImage || "",
//         fatherImage: values?.fatherImage || "",
//         guardianImage: values?.guardianImage || "",
//         guardianRemarks: values?.remarks || "",
//       };

//       const formDataToSend = new FormData();
//       Object.entries(studentData).forEach(([key, value]) => {
//         // Handle multiple image fields
//         if (
//           ["studentImage", "guardianImage", "fatherImage", "motherImage"].includes(
//             key
//           ) &&
//           value
//         ) {
//           formDataToSend.append(key, value);
//         } else {
//           // Convert all other values to strings and append
//           formDataToSend.append(key, String(value));
//         }
//       });
//       const response = await thirdpartymystudents(studentId, formDataToSend);
//       if (response.success) {
//         setReRender(true);
//         setIsOpen(false);
//         toast.success("Update successfully!");
//         setValues({
//           admissionNumber: "",
//           fullName: "",
//           class: "",
//           section: "",
//           gender: "",
//           dob: "",
//           fatherName: "",
//           motherName: "",
//           guardianName: "",
//           contact: "",
//           address: "",
//           studentImage: null,
//           motherImage: null,
//           fatherImage: null,
//           guardianImage: null,
//           remarks: "",
//         });
//       } else {
//         toast.error(response?.message);
//       }
//     } catch (error) {
//       console.log("error", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const [modalOpen, setModalOpen] = useState(false);

//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [croppedImageSource, setCroppedImageSource] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [currentPhotoType, setCurrentPhotoType] = useState(null); // new state

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handlePhotoChange = (e, photoType) => {
//     const file = e.target.files?.[0];

//     if (file) {
//       // setValues((prev)=>{
//       //   ...prev,
//       //   [photoType]:file,
//       // })
//       setCurrentPhotoType(photoType); // Set the type (father, mother, guardian)
//       setValues((prev) => ({ ...prev, [photoType + "Image"]: file }));
//       // const reader = new FileReader();
//       // reader.onload = () => {
//       //   setCroppedImageSource(reader.result); // set the cropped image source to reader result for cropping purpose
//       // };
//       // reader.readAsDataURL(file);
//     }
//   };
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);
//   const cancelCrop = useCallback(() => {
//     setCroppedImageSource(null);
//   }, [setCroppedImageSource]);

//   const showCroppedImage = async () => {
//     try {
//       const croppedImageUrl = await getCroppedImg(
//         croppedImageSource,
//         croppedAreaPixels
//       );
//       setCroppedImageSource(null);
//       switch (currentPhotoType) {
//         case "father":
//           setValues((prev) => ({ ...prev, fatherImage: croppedImageUrl }));
//           break;
//         case "mother":
//           setValues((prev) => ({ ...prev, motherImage: croppedImageUrl }));
//           break;
//         case "guardian":
//           setValues((prev) => ({ ...prev, guardianImage: croppedImageUrl }));
//           break;
//         default:
//           setValues((prev) => ({ ...prev, studentImage: croppedImageUrl })); // Main photo
//           break;
//       }
//       setCurrentPhotoType(null);
//     } catch (error) {
//       console.error("Error cropping image:", error);
//     }
//   };

//   const handleMoreDetails = () => {
//     setModalOpen(true);
//   };

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

//   if (croppedImageSource) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg p-4 w-full max-w-md">
//           <div className="relative h-64 w-full">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => setCroppedImageSource(null)}
//               className="px-4 py-2 bg-gray-200 rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={showCroppedImage}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md"
//             >
//               Crop
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div class="selection:bg-[#2fa7db] selection:text-white">
//         <div class=" flex justify-center ">
//           <div class="flex-1 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] m-2">
//             <div class="w-full bg-white  mx-auto overflow-hidden ">
//               <div
//                 class="relative h-[130px] px-5 pt-1

//                rounded-bl-4xl"
//               >
//                 <h1 class="absolute top-0  text-xl font-semibold text-white pl-2">
//                   Student Details
//                 </h1>
//                 <div className="flex justify-end  items-center mb-6">
//                   <Button
//                     name=" More Details"
//                     color="#59b3da"
//                     onClick={() => handleMoreDetails()}
//                     className="text-[#ee582c] m-2"
//                   />
//                 </div>
//                 <div className="flex ml-2 mb-6">
//                   <div className="absolute top-5">
//                     {values?.studentImage ? (
//                       <img
//                         src={
//                           typeof values.studentImage === "string"
//                             ? values.studentImage
//                             : URL.createObjectURL(values?.studentImage)
//                         }
//                         // src={values?.photo}
//                         alt="Student"
//                         className="w-20 h-20 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
//                         <span className="text-[#ee582c] text-sm">
//                           NO IMAGE
//                         </span>
//                       </div>
//                     )}
//                     <label className="absolute bottom-0 right-0 bg-[#ee582c] text-white p-2 rounded-full cursor-pointer">
//                       <Camera size={18} />
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         // onChange={(e) => handlePhotoChange(e, "student")}
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>
//               <div class="px-6 pb-8 bg-white rounded-tr-4xl ">
//                 <form class="" action="" method="POST">
//                   <div className="flex justify-center items-center gap-2 w-full">
//                     <div class="relative w-full">
//                       <input
//                         type="text"
//                         name="admissionNumber"
//                         maxLength="6"
//                         value={values?.admissionNumber}
//                         onChange={handleInputChange}
//                         id="admissionNumber"
//                         className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                         placeholder="admissionNumber"
//                       />
//                       <label
//                         for="admissionNumber"
//                         class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                       >
//                         Admission No.
//                       </label>
//                     </div>

//                     <div class="relative w-full">
//                       <input
//                         maxLength="3"
//                         type="text"
//                         name="rollNo"
//                         placeholder="Enter Roll Number"
//                         value={values?.rollNo}
//                         onChange={handleInputChange}
//                         id="rollNo"
//                         className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                       />
//                       <label
//                         for="rollNo"
//                         class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                       >
//                         Enter Roll Number
//                       </label>
//                     </div>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fullName"
//                       placeholder="Enter Student Name"
//                       value={values?.fullName}
//                       onChange={handleInputChange}
//                       id="fullName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fullName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Student Name
//                     </label>
//                   </div>

//                   <div className="flex justify-center items-center gap-2">
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         // minWidth: 120,
//                         //  width:300

//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                         "& .MuiSelect-root": { color: "#2fa7db" }, // Selected text color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Class
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         // value={values?.class}
//                         // onChange={handleInputChange}
//                         value={selectedClass}
//                         onChange={handleClassChange}
//                         label="Class"
//                         name="studentclass"
//                         sx={{
//                           color: "#2fa7db", // Selected text color
//                           "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                           "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                           "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c", // Hover border color
//                           },
//                         }}
//                       >
//                         {getClass?.map((cls, index) => (
//                           <MenuItem key={index} value={cls.className}>
//                             {" "}
//                             {cls?.className}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         // minWidth: 120,
//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                         "& .MuiSelect-root": { color: "#ee582c" }, // Selected text color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Section
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         // value={values?.section}
//                         // onChange={handleInputChange}
//                         value={selectedSection}
//                         onChange={handleSectionChange}
//                         label="Section"
//                         name="studentSection"
//                         sx={{
//                           color: "#2fa7db", // Selected text color
//                           "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                           "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                           "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c", // Hover border color
//                           },
//                         }}
//                       >
//                         {availableSections?.map((item, index) => (
//                           <MenuItem key={index} value={item}>
//                             {" "}
//                             {item}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </div>
//                   <div className="flex justify-center items-center gap-2">
//                     <FormControl
//                       variant="standard"
//                       sx={{
//                         mt: 1,
//                         // minWidth: 120,

//                         width: "100%",
//                         "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                         "& .MuiSelect-root": { color: "#ee582c" }, // Selected text color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                       }}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         Gender
//                       </InputLabel>
//                       <Select
//                         labelId="demo-simple-select-standard-label"
//                         id="demo-simple-select-standard"
//                         value={values?.gender}
//                         onChange={handleInputChange}
//                         label="Gender"
//                         name="gender"
//                         sx={{
//                           color: "#2fa7db", // Selected text color
//                           // backgroundColor: "black", // Background color
//                           "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                           "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                           "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                           "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                             borderBottom: "2px solid #ee582c", // Hover border color
//                           },
//                         }}
//                       >
//                         <MenuItem value="Male">Male</MenuItem>
//                         <MenuItem value="Female">Female</MenuItem>
//                         <MenuItem value="Other">Other</MenuItem>
//                       </Select>
//                     </FormControl>
//                     <div class="relative mt-4 w-full">
//                       <input
//                         type="date"
//                         name="DOB"
//                         placeholder="Enter DOB"
//                         value={values?.DOB}
//                         onChange={handleInputChange}
//                         id="DOB"
//                         className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                       />
//                       <label
//                         for="DOB"
//                         class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                       >
//                         Enter DOB
//                       </label>
//                     </div>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fatherName"
//                       placeholder="Enter Father Name"
//                       value={values?.fatherName}
//                       onChange={handleInputChange}
//                       id="fatherName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fatherName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Father Name
//                     </label>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       maxlength="10"
//                       name="contact"
//                       placeholder="Contact No."
//                       value={values?.contact}
//                       onChange={handleInputChange}
//                       id="contact"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="contact"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Contact No.
//                     </label>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="address"
//                       placeholder="Enter Address"
//                       value={values?.address}
//                       onChange={handleInputChange}
//                       id="address"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="address"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Address
//                     </label>
//                   </div>
//                 </form>
//               </div>
//               <div className="px-4  shadow-xl bg-white ">
//                 {buttonLabel === "Save" ? (
//                   <button
//                     className="w-full bg-[#2fa7db] text-white  rounded-md mb-5 py-2 "
//                     onClick={handleSaveClick}
//                     // onClick={ handleSaveClick}
//                     disabled={loading}
//                   >
//                     {loading ? "Saving..." : buttonLabel}
//                   </button>
//                 ) : (
//                   <button
//                     className="w-full bg-[#2fa7db] text-white  rounded-md mb-14 py-2 "
//                     onClick={handleUpDateClick}
//                     disabled={loading}
//                   >
//                     {loading ? "Updating..." : buttonLabel}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`More Details`}>
//         {croppedImageSource ? (
//           <div className="relative w-full aspect-square">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
//               <button
//                 onClick={cancelCrop}
//                 className="bg-red-500 text-white py-2 px-4 rounded"
//               >
//                 Cancel Crop
//               </button>
//               <button
//                 onClick={showCroppedImage}
//                 className="bg-blue-500 text-white py-2 px-4 rounded"
//               >
//                 Crop Image
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="px-4 pb-2 min-w-[330px]">
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Guardian Name:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="guardianName"
//                 name="guardianName"
//                 type="text"
//                 placeholder="Guardian Name"
//                 onChange={handleInputChange}
//                 value={values?.guardianName}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Transport:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="transport"
//                 name="transport"
//                 type="text"
//                 placeholder="Transport"
//                 value={values?.transport}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Remarks:
//               </label>

//               <textarea
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="remarks"
//                 name="remarks"
//                 type="text"
//                 placeholder="Remarks"
//                 value={values?.remarks}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Father Photo:
//                 </label>
//                 {values?.fatherImage ? (
//                   <img
//                     src={
//                       typeof values.fatherImage === "string"
//                         ? values.fatherImage
//                         : URL?.createObjectURL(values?.fatherImage)
//                     }
//                     alt="Father"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     name="father"
//                     onChange={(e) => handlePhotoChange(e, "father")}
//                   />
//                 </label>
//               </div>
//             </div>
//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Mother Photo:
//                 </label>
//                 {values?.motherImage ? (
//                   <img
//                     src={
//                       typeof values.motherImage === "string"
//                         ? values.motherImage
//                         : URL?.createObjectURL(values?.motherImage)
//                     }
//                     alt="Mother"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     name="mother"
//                     onChange={(e) => handlePhotoChange(e, "mother")}
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Guardian Photo:
//                 </label>
//                 {values?.guardianImage ? (
//                   <img
//                     src={
//                       typeof values.guardianImage === "string"
//                         ? values?.guardianImage
//                         : URL.createObjectURL(values?.guardianImage)
//                     }
//                     alt="Guardian"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                   <span className="text-[#ee582c]">NO IMAGE</span>
//                 </div>
//               )}
//               <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                 <Camera size={16} />
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/*"
//                   name="guardian"
//                   onChange={(e) => handlePhotoChange(e, "guardian")}
//                 />
//               </label>
//             </div>
//           </div>
//         </div>
//       )}
//     </Modal>
//   </>
// );
// }

// export default DynamicFormFileds;

// import React, { useState, useCallback, useEffect } from "react";
// import { Camera } from "lucide-react";
// import Cropper from "react-easy-crop";
// import getCroppedImg from "./getCroppedImg";

// import Modal from "../../Modal";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import Button from "../../utils/Button";
// import { Admission, thirdpartymystudents } from "../../../Network/ThirdPartyApi";
// import { toast } from "react-toastify";
// import moment from "moment";

// function DynamicFormFileds(props) {
//     const [getClass, setGetClass] = useState([]);

//     const [selectedClass, setSelectedClass] = useState("");
//     const [selectedSection, setSelectedSection] = useState("");
//     const [availableSections, setAvailableSections] = useState([]);
//     const {studentData,buttonLabel,setIsOpen,setReRender} = props;
//  console.log("studentData",studentData)
//  useEffect(()=>{
//   setSelectedClass(studentData?.class)
//  },[studentData])
//     const [isEdit,setIsEdit]=useState(false)
//     const [values, setValues] = useState({
//       admissionNumber: '',
//         rollNo:'',
//         fullName: '',
//         class: '',
//         section: '',
//         gender:'',
//         DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
//         fatherName: '',
//         motherName: '',
//         guardianName: '',
//         contact: '',
//         address: '',
//         studentImage: null,
//         motherImage: null,
//         fatherImage: null,
//         guardianImage: null,
//         transport:"",
//         remarks:"",

//     });

// useEffect(()=>{
//   const classes = JSON.parse(localStorage.getItem("classes"));
// setGetClass(classes)
// },[])
//     useEffect(()=>{
//       // Getclasses()
//         setIsEdit(true)
//         setValues(studentData)
//         setValues((preV)=>(
//           {
//             ...preV,
//             fatherName:studentData?.udisePlusDetails?.father_name,
//             section:studentData?.section
//           }
//         ))
//     },[studentData])
//   const schoolID = localStorage.getItem("SchoolID");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setValues({
//         ...values,
//         studentImage: file,
//       });
//     }
//   };

//      const handleSaveClick = async () => {

//                 setLoading(true);
//                 try {

//                     const studentData = {
//                         schoolId: schoolID,
//                         studentFullName: values?.fullName || "" ,
//                         studentEmail:  `${values.fullName}${values.contact}@gmail.com` || "" , // Add these fields as needed
//                         parentEmail:  `${values.fatherName}${values.contact}@gmail.com` || "" , // Add these fields as needed
//                         studentPassword: values?.contact || "" ,
//                         parentPassword: values?.contact || "" ,
//                         studentDateOfBirth:moment(values?.DOB).format("DD-MMM-YYYY") || "" ,
//                         studentJoiningDate: moment(new Date()).format('DD-MMM-YYYY') || "" ,
//                         studentGender: values?.gender || "" ,
//                         studentClass: selectedClass || "" ,
//                         studentSection: selectedSection || "" ,
//                         studentAddress: values?.address || "" ,
//                         studentContact: values?.contact || "" ,
//                         parentContact:  values?.contact || "" ,
//                         fatherName: values?.fatherName || "" ,
//                         motherName: values?.motherName || "" ,
//                         guardianName:values?.guardianName || "" ,
//                         studentAdmissionNumber: values?.admissionNumber || "" ,
//                         studentRollNo: values?.rollNo || "" ,
//                         studentImage:values?.studentImage || "" ,
//                         motherImage:values?.motherImage || "" ,
//                         fatherImage:values?.fatherImage || "" ,
//                         guardianImage:values?.guardianImage || "" ,
//                         guardianName:values?.guardianName || "" ,
//                         remarks:values?.remarks || "" ,
//                         transport:values?.transport || "" ,
//                     };

//                     const formDataToSend = new FormData();
//                     Object.entries(studentData).forEach(([key, value]) => {
//                       // Handle multiple image fields
//                       if (["studentImage", "guardianImage", "fatherImage", "motherImage"].includes(key) && value) {
//                         if (Array.isArray(value)) {
//                           // If the value is an array (multiple images), append each image with a unique key
//                           value.forEach((file, index) => {
//                             formDataToSend.append(`${key}[${index}]`, file);
//                           });
//                         } else {
//                           // If it's a single image, append it directly
//                           formDataToSend.append(key, value);
//                         }
//                       } else {
//                         // Convert all other values to strings and append
//                         formDataToSend.append(key, String(value));
//                       }
//                     });
//                     // Object.entries(studentData).forEach(([key, value]) => {
//                     //     // Check if the value is a file, then append it, otherwise convert it to string.
//                     //     if (key === "studentImage" && value) {
//                     //         formDataToSend.append(key, value);  // Append the file object directly
//                     //     }
//                     //      else {
//                     //         formDataToSend.append(key, String(value)); //convert all other values to string
//                     //     }

//                     // });

//                     const response = await Admission(formDataToSend);
//                     console.log("response",response)
//                     // const response = await Admission(studentData);

//                     if (response.success) {
//         //               setValues({
//         //                 admissionNumber: '',
//         // rollNo:'',
//         // fullName: '',
//         // class: '',
//         // section: '',
//         // gender:'',
//         // DOB: moment("01-01-2010").format("DD-MMM-YYYY"),
//         // fatherName: '',
//         // motherName: '',
//         // guardianName: '',
//         // contact: '',
//         // address: '',
//         // studentImage: null,
//         // motherImage: null,
//         // fatherImage: null,
//         // guardianImage: null,
//         // remarks:''
//         // transport:''

//         //               })
//                         toast.success("Admission successfully!");
//                         setReRender(true)

//                     }
//                     else{
//                       toast.error(response?.data?.message)
//                       // toast.error("error")
//                     }
//                 } catch (error) {
//                     console.log("error",error);
//                 } finally {
//                     setLoading(false);
//                 }
//             };

//      const handleUpDateClick = async () => {
//                 setLoading(true);
//                 const studentId=studentData?._id
//                 try {

//                     const studentData = {
//                         schoolId: schoolID,
//                         fullName: values?.fullName || "",
//                         email:  `${values?.fullName}${values?.contact}@gmail.com` || "", // Add these fields as needed
//                         studentDateOfBirth:moment(values?.DOB).format("DD-MMM-YYYY") || "",
//                         studentJoiningDate: moment(new Date()).format('DD-MMM-YYYY') || "",
//                         gender: values?.gender || "",
//                         class:selectedClass || "",
//                         section: selectedSection || "",
//                         studentAddress: values?.address || "",
//                         studentContact: values?.contact || "",
//                         contact:  values?.contact || "",
//                         fatherName: values?.fatherName || "",
//                         motherName: values?.motherName || "",
//                         guardianName:values?.guardianName || "",
//                         admissionNumber: values?.admissionNumber || "",
//                         studentImage:values?.studentImage || "",
//                         motherImage:values?.motherImage || "",
//                         fatherImage:values?.fatherImage || "",
//                         guardianImage:values?.guardianImage || "",
//                         guardianRemarks:values?.remarks || "",
//                     };
//                     const response = await thirdpartymystudents(studentId,studentData);
//                     if (response.success) {
//                       setReRender(true)
//                       setIsOpen(false)
//                         toast.success("Update successfully!");
//                         setValues({
//                           admissionNumber: '',
//                             fullName: '',
//                             class: '',
//                             section: '',
//                             gender:'',
//                             dob: '',
//                             fatherName: '',
//                             motherName: '',
//                             guardianName: '',
//                             contact: '',
//                             address: '',
//                             studentImage: null,
//                             motherImage: null,
//                             fatherImage: null,
//                             guardianImage: null,
//                             remarks:''
//                         })
//                     }
//                     else{
//                         toast.error(response?.message)
//                     }
//                 } catch (error) {
//                     console.log("error",error);
//                 } finally {
//                     setLoading(false);
//                 }
//             };
//   const [modalOpen, setModalOpen] = useState(false);

//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [croppedImageSource, setCroppedImageSource] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [currentPhotoType, setCurrentPhotoType] = useState(null); // new state

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handlePhotoChange = (e, photoType) => {
//     const file = e.target.files?.[0];

//     if (file) {
//       setCurrentPhotoType(photoType); // Set the type (father, mother, guardian)
//       const reader = new FileReader();
//       reader.onload = () => {
//         setCroppedImageSource(reader.result); // set the cropped image source to reader result for cropping purpose
//       };
//       reader.readAsDataURL(file);
//     }
//   };
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);
//   const cancelCrop = useCallback(() => {
//     setCroppedImageSource(null);
//   }, [setCroppedImageSource]);

//   const showCroppedImage = async () => {
//     try {
//       const croppedImageUrl = await getCroppedImg(
//         croppedImageSource,
//         croppedAreaPixels
//       );
//       setCroppedImageSource(null);
//       switch (currentPhotoType) {
//         case "father":
//           setValues((prev) => ({ ...prev, fatherImage: croppedImageUrl }));
//           break;
//         case "mother":
//           setValues((prev) => ({ ...prev, motherImage: croppedImageUrl }));
//           break;
//         case "guardian":
//           setValues((prev) => ({ ...prev, guardianImage: croppedImageUrl }));
//           break;
//         default:
//           setValues((prev) => ({ ...prev, studentImage: croppedImageUrl })); // Main photo
//           break;
//       }
//       setCurrentPhotoType(null);
//     } catch (error) {
//       console.error("Error cropping image:", error);
//     }
//   };

//   const handleMoreDetails = () => {
//     setModalOpen(true);
//   };

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

//   if (croppedImageSource) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg p-4 w-full max-w-md">
//           <div className="relative h-64 w-full">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => setCroppedImageSource(null)}
//               className="px-4 py-2 bg-gray-200 rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={showCroppedImage}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md"
//             >
//               Crop
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div class="selection:bg-[#2fa7db] selection:text-white">
//         <div class=" flex justify-center ">
//           <div class="flex-1 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] m-2">
//             <div class="w-full bg-white  mx-auto overflow-hidden ">
//               <div class="relative h-[130px] px-5 pt-1

//                rounded-bl-4xl"

//               >
//                 <h1 class="absolute top-0  text-xl font-semibold text-white pl-2">
//                   Student Details
//                 </h1>
//                 <div className="flex justify-end  items-center mb-6">
//                   <Button
//                     name=" More Details"
//                     color="#59b3da"
//                     onClick={() => handleMoreDetails()}
//                     className="text-[#ee582c] m-2"
//                   />
//                 </div>
//                 <div className="flex ml-2 mb-6"

//                 >
//                   <div className="absolute top-5">
//                     {values?.studentImage ? (
//                       <img
//                       src={URL.createObjectURL(values.studentImage)}
//                         // src={values?.photo}
//                         alt="Student"
//                         className="w-20 h-20 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
//                         <span className="text-[#ee582c] text-sm">NO IMAGE</span>
//                       </div>
//                     )}
//                     <label className="absolute bottom-0 right-0 bg-[#ee582c] text-white p-2 rounded-full cursor-pointer">
//                       <Camera size={18} />
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept="image/*"

//                         onChange={handleImageChange}
//                         // onChange={(e) => handlePhotoChange(e, "student")}
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>
//               <div class="px-6 pb-8 bg-white rounded-tr-4xl ">
//                 <form class="" action="" method="POST">
//                  <div className="flex justify-center items-center gap-2 w-full">
//                  <div class="relative w-full">
//                     <input
//                       type="text"
//                       name="admissionNumber"
//                       maxLength="6"
//                       value={values?.admissionNumber}
//                       onChange={handleInputChange}
//                       id="admissionNumber"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                       placeholder="admissionNumber"
//                     />
//                     <label
//                       for="admissionNumber"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Admission No.
//                     </label>
//                   </div>

//                   <div class="relative w-full">
//                     <input
//                     maxLength="3"
//                       type="text"
//                       name="rollNo"
//                       placeholder="Enter Roll Number"
//                       value={values?.rollNo}
//                       onChange={handleInputChange}
//                       id="rollNo"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="rollNo"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Roll Number
//                     </label>
//                   </div>
//                  </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fullName"
//                       placeholder="Enter Student Name"
//                       value={values?.fullName}
//                       onChange={handleInputChange}
//                       id="fullName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fullName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Student Name
//                     </label>
//                   </div>

//                  <div className="flex justify-center items-center gap-2">
//                  <FormControl
//                     variant="standard"
//                     sx={{
//                       mt: 1,
//                       // minWidth: 120,
//                       //  width:300

//                       width: "100%",
//                       "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                       "& .MuiSelect-root": { color: "#2fa7db" }, // Selected text color
//                       "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                       "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                       "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                     }}
//                   >
//                     <InputLabel id="demo-simple-select-standard-label">
//                       Class
//                     </InputLabel>
//                     <Select
//                       labelId="demo-simple-select-standard-label"
//                       id="demo-simple-select-standard"
//                       // value={values?.class}
//                       // onChange={handleInputChange}
//                       value={selectedClass}
//                       onChange={handleClassChange}
//                       label="Class"
//                       name="studentclass"
//                       sx={{
//                         color: "#2fa7db", // Selected text color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                         "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                           borderBottom: "2px solid #ee582c", // Hover border color
//                         },
//                       }}
//                     >
//                       {getClass?.map((cls, index) => (
//                       <MenuItem
//                       value={cls.className}

//                       >{ cls?.className}</MenuItem>
//                       ))}

//                     </Select>
//                   </FormControl>
//                   <FormControl
//                     variant="standard"
//                     sx={{
//                       mt: 1,
//                       // minWidth: 120,
//                       width: "100%",
//                       "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                       "& .MuiSelect-root": { color: "#ee582c" }, // Selected text color
//                       "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                       "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                       "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                     }}
//                   >
//                     <InputLabel id="demo-simple-select-standard-label">
//                       Section
//                     </InputLabel>
//                     <Select
//                       labelId="demo-simple-select-standard-label"
//                       id="demo-simple-select-standard"
//                       // value={values?.section}
//                       // onChange={handleInputChange}
//                       value={selectedSection}
//                       onChange={handleSectionChange}
//                       label="Section"
//                       name="studentSection"
//                       sx={{
//                         color: "#2fa7db", // Selected text color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                         "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                           borderBottom: "2px solid #ee582c", // Hover border color
//                         },
//                       }}
//                     >
//                        {availableSections?.map((item, index) => (
//                       <MenuItem key={index} value={item}> {item}</MenuItem>
//                        ))}
//                     </Select>
//                   </FormControl>
//                  </div>
//                  <div className="flex justify-center items-center gap-2">
//                  <FormControl
//                     variant="standard"
//                     sx={{
//                       mt: 1,
//                       // minWidth: 120,

//                       width: "100%",
//                       "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                       "& .MuiSelect-root": { color: "#ee582c" }, // Selected text color
//                       "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                       "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                       "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                     }}
//                   >
//                     <InputLabel id="demo-simple-select-standard-label">
//                       Gender
//                     </InputLabel>
//                     <Select
//                       labelId="demo-simple-select-standard-label"
//                       id="demo-simple-select-standard"
//                       value={values?.gender}
//                       onChange={handleInputChange}
//                       label="Gender"
//                       name="gender"
//                       sx={{
//                         color: "#2fa7db", // Selected text color
//                         // backgroundColor: "black", // Background color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                         "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                           borderBottom: "2px solid #ee582c", // Hover border color
//                         },
//                       }}
//                     >

//                       <MenuItem value="Male">Male</MenuItem>
//                       <MenuItem value="Female">Female</MenuItem>
//                       <MenuItem value="Other">Other</MenuItem>
//                     </Select>
//                   </FormControl>
//                   <div class="relative mt-4 w-full">
//                     <input
//                       type="date"
//                       name="DOB"
//                       placeholder="Enter DOB"
//                       value={values?.DOB}
//                       onChange={handleInputChange}
//                       id="DOB"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="DOB"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter DOB
//                     </label>
//                   </div>
//                  </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fatherName"
//                       placeholder="Enter Father Name"
//                       value={values?.fatherName}
//                       onChange={handleInputChange}
//                       id="fatherName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fatherName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Father Name
//                     </label>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       maxlength="10"
//                       name="contact"
//                       placeholder="Contact No."
//                       value={values?.contact}
//                       onChange={handleInputChange}
//                       id="contact"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="contact"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Contact No.
//                     </label>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="address"
//                       placeholder="Enter Address"
//                       value={values?.address}
//                       onChange={handleInputChange}
//                       id="address"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#2fa7db] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="address"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Address
//                     </label>
//                   </div>

//                 </form>

//               </div>
//               <div className='px-4  shadow-xl bg-white '>
//                 {
//                     buttonLabel==="Save"?(
//                         <button
//                         className="w-full bg-[#2fa7db] text-white  rounded-md mb-5 py-2 "
//                         onClick={  handleSaveClick}
//                         // onClick={ handleSaveClick}
//                         disabled={loading}
//                       >
//                         {loading ? "Saving..." : buttonLabel}
//                       </button>
//                     ):(  <button
//                         className="w-full bg-[#2fa7db] text-white  rounded-md mb-14 py-2 "
//                         onClick={handleUpDateClick}
//                         disabled={loading}
//                     >
//                         {loading ? 'Updating...' : buttonLabel}

//                     </button>)
//                 }

//           </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`More Details`}>
//         {croppedImageSource ? (
//           <div className="relative w-full aspect-square">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
//               <button
//                 onClick={cancelCrop}
//                 className="bg-red-500 text-white py-2 px-4 rounded"
//               >
//                 Cancel Crop
//               </button>
//               <button
//                 onClick={showCroppedImage}
//                 className="bg-blue-500 text-white py-2 px-4 rounded"
//               >
//                 Crop Image
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="px-4 pb-2 min-w-[330px]">
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Guardian Name:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="guardianName"
//                 name="guardianName"
//                 type="text"
//                 placeholder="Guardian Name"
//                 onChange={handleInputChange}
//                 value={values?.guardianName}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Transport:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="transport"
//                 name="transport"
//                 type="text"
//                 placeholder="Transport"
//                 value={values?.transport}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Remarks:
//               </label>

//               <textarea
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="remarks"
//                 name="remarks"
//                 type="text"
//                 placeholder="Remarks"
//                 value={values?.remarks}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Father Photo:
//                 </label>
//                 {values?.fatherImage ? (
//                   <img
//                     src={values?.fatherImage}
//                     alt="Student"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={(e) => handlePhotoChange(e, "father")}
//                   />
//                 </label>
//               </div>
//             </div>
//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Mother Photo:
//                 </label>
//                 {values?.motherImage ? (
//                   <img
//                     src={values?.motherImage}
//                     alt="Student"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={(e) => handlePhotoChange(e, "mother")}
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Guardian Photo:
//                 </label>
//                 {values?.guardianImage ? (
//                   <img
//                     src={values?.guardianImage}
//                     alt="Student"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={(e) => handlePhotoChange(e, "guardian")}
//                   />
//                 </label>
//               </div>
//             </div>

//           </div>
//         )}
//       </Modal>
//     </>
//   );
// }

// export default DynamicFormFileds;

// import React, { useState, useCallback, useEffect } from "react";
// import { X, Calendar, Camera } from "lucide-react";
// import Cropper from "react-easy-crop";
// import getCroppedImg from "./getCroppedImg";
// // import { Admission } from '../Network/ThirdPartyApi';

// import Modal from "../../Modal";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import Button from "../../utils/Button";
// import { Admission, thirdpartyclasses, thirdpartymystudents } from "../../../Network/ThirdPartyApi";
// import { toast } from "react-toastify";
// import moment from "moment";

// function DynamicFormFileds(props) {
//     const [getClass, setGetClass] = useState([]);

//     const [selectedClass, setSelectedClass] = useState("");
//     const [selectedSection, setSelectedSection] = useState("");
//     const [availableSections, setAvailableSections] = useState([]);
//     const {studentData,buttonLabel,setIsOpen,setReRender} = props;
//  console.log("studentData",studentData)
//  useEffect(()=>{
//   setSelectedClass(studentData?.class)
//  },[studentData])
//     const [isEdit,setIsEdit]=useState(false)
//     const [values, setValues] = useState({
//         admissionNo: '',
//         rollNo:'',
//         fullName: '',
//         class: '',
//         section: '',
//         gender:'',
//         dob: '',
//         fatherName: '',
//         motherName: '',
//         guardianName: '',
//         contact: '',
//         address: '',
//         photo: null,
//         motherPhoto: null,
//         fatherPhoto: null,
//         guardianPhoto: null,
//         remarks:''
//     });

//       // const Getclasses = async () => {
//       //   try {
//       //     const response = await thirdpartyclasses(SchoolID);
//       //     if (response.success) {
//       //       let classes = response.classList;
//       //       setGetClass(classes.sort((a, b) => a - b)); // Add "All Classes" option
//       //     } else {
//       //       console.log("error", response?.message);
//       //     }
//       //   } catch (error) {
//       //     console.log("error", error);
//       //   }
//       // };

// useEffect(()=>{
//   const classes = JSON.parse(localStorage.getItem("classes"));
// setGetClass(classes)
// },[])
//     useEffect(()=>{
//       // Getclasses()
//         setIsEdit(true)
//         setValues(studentData)
//     },[studentData])
//   const schoolID = localStorage.getItem("SchoolID");

// // function DynamicFormFileds({ student, setValues }) {

//      const handleSaveClick = async () => {
//                 setLoading(true);
//                 try {

//                     const studentData = {
//                         schoolId: schoolID,
//                         studentFullName: values?.fullName,
//                         studentEmail:  `${values.name}${values.contact}@gmail.com`, // Add these fields as needed
//                         parentEmail:  `${values.fatherName}${values.contact}@gmail.com`, // Add these fields as needed
//                         studentPassword: values?.contact,
//                         parentPassword: values?.contact,
//                         studentDateOfBirth: '01-01-2000',
//                         studentJoiningDate: moment(new Date()).format('YYYY-MM-DD'),
//                         studentGender: values?.gender,
//                         studentClass: selectedClass,
//                         studentSection: selectedSection,
//                         studentAddress: values?.address,
//                         studentContact: values?.contact,
//                         parentContact:  values?.contact,
//                         fatherName: values?.fatherName,
//                         motherName: values?.motherName,
//                         guardianName:values?.guardianName,
//                         studentAdmissionNumber: values?.admissionNo,
//                         studentPhoto:values?.photo,
//                         motherPhoto:values?.motherPhoto,
//                         fatherPhoto:values?.fatherPhoto,
//                         guardianPhoto:values?.guardianPhoto,
//                         guardianRemarks:values?.remarks,
//                     };

//                     const response = await Admission(studentData);

//                     if (response.success) {
//                         toast.success("Admission completed successfully!");
//                         setReRender(true)
//                         setValues({
//                             admissionNo: '',
//                             fullName: '',
//                             class: '',
//                             section: '',
//                             gender:'',
//                             dob: '',
//                             fatherName: '',
//                             motherName: '',
//                             guardianName: '',
//                             contact: '',
//                             address: '',
//                             photo: null,
//                             motherPhoto: null,
//                             fatherPhoto: null,
//                             guardianPhoto: null,
//                             remarks:''
//                         })
//                     }
//                     else{
//                       toast.error(response?.message)
//                     }
//                 } catch (error) {
//                     console.log("error",error);
//                 } finally {
//                     setLoading(false);
//                 }
//             };
//             console.log("selectedClass,",selectedClass)
//      const handleUpDateClick = async () => {
//                 setLoading(true);
//                 const studentId=studentData?._id
//                 try {

//                     const studentData = {
//                         schoolId: schoolID,
//                         fullName: values?.fullName,
//                         email:  `${values?.name}${values?.contact}@gmail.com`, // Add these fields as needed
//                         dateOfBirth: '2000-02-11',
//                         joiningDate: "2025-02-11",
//                         gender: values?.gender,
//                         class:selectedClass,
//                         section: selectedSection,
//                         studentAddress: values?.address,
//                         studentContact: values?.contact,
//                         contact:  values?.contact,
//                         fatherName: values?.fatherName,
//                         motherName: values?.motherName,
//                         guardianName:values?.guardianName,
//                         admissionNumber: values?.admissionNo,
//                         studentPhoto:values?.photo,
//                         motherPhoto:values?.motherPhoto,
//                         fatherPhoto:values?.fatherPhoto,
//                         guardianPhoto:values?.guardianPhoto,
//                         guardianRemarks:values?.remarks,
//                     };

//                     const response = await thirdpartymystudents(studentId,studentData);

//                     if (response.success) {
//                       setReRender(true)
//                       setIsOpen(false)
//                         toast.success("Update successfully!");
//                         setValues({
//                             admissionNo: '',
//                             fullName: '',
//                             class: '',
//                             section: '',
//                             gender:'',
//                             dob: '',
//                             fatherName: '',
//                             motherName: '',
//                             guardianName: '',
//                             contact: '',
//                             address: '',
//                             photo: null,
//                             motherPhoto: null,
//                             fatherPhoto: null,
//                             guardianPhoto: null,
//                             remarks:''
//                         })
//                     }
//                     else{
//                         toast.error(response?.message)
//                     }
//                 } catch (error) {
//                     console.log("error",error);
//                 } finally {
//                     setLoading(false);
//                 }
//             };
//   const [modalOpen, setModalOpen] = useState(false);

//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [croppedImageSource, setCroppedImageSource] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [currentPhotoType, setCurrentPhotoType] = useState(null); // new state

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handlePhotoChange = (e, photoType) => {
//     const file = e.target.files?.[0];

//     if (file) {
//       setCurrentPhotoType(photoType); // Set the type (father, mother, guardian)
//       const reader = new FileReader();
//       reader.onload = () => {
//         setCroppedImageSource(reader.result); // set the cropped image source to reader result for cropping purpose
//       };
//       reader.readAsDataURL(file);
//     }
//   };
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);
//   const cancelCrop = useCallback(() => {
//     setCroppedImageSource(null);
//   }, [setCroppedImageSource]);

//   const showCroppedImage = async () => {
//     try {
//       const croppedImageUrl = await getCroppedImg(
//         croppedImageSource,
//         croppedAreaPixels
//       );
//       setCroppedImageSource(null);
//       switch (currentPhotoType) {
//         case "father":
//           setValues((prev) => ({ ...prev, fatherPhoto: croppedImageUrl }));
//           break;
//         case "mother":
//           setValues((prev) => ({ ...prev, motherPhoto: croppedImageUrl }));
//           break;
//         case "guardian":
//           setValues((prev) => ({ ...prev, guardianPhoto: croppedImageUrl }));
//           break;
//         default:
//           setValues((prev) => ({ ...prev, photo: croppedImageUrl })); // Main photo
//           break;
//       }
//       setCurrentPhotoType(null);
//     } catch (error) {
//       console.error("Error cropping image:", error);
//     }
//   };

//   const handleMoreDetails = () => {
//     setModalOpen(true);
//   };

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

//   if (croppedImageSource) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg p-4 w-full max-w-md">
//           <div className="relative h-64 w-full">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => setCroppedImageSource(null)}
//               className="px-4 py-2 bg-gray-200 rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={showCroppedImage}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md"
//             >
//               Crop
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div class="selection:bg-[#2fa7db] selection:text-white">
//         <div class="min-h-screen bg-red-400  flex justify-center mb-10">
//           <div class="flex-1">
//             <div class="w-full bg-white  mx-auto overflow-hidden">
//               <div class="relative h-[180px] bg-[#2fa7db] rounded-bl-4xl">
//                 <h1 class="absolute top-0  text-xl font-semibold text-white pl-2">
//                   Student Details
//                 </h1>
//                 <div className="flex justify-end  items-center mb-6">
//                   <Button
//                     name=" More Details"
//                     color="#59b3da"
//                     onClick={() => handleMoreDetails()}
//                     className="text-[#ee582c] m-2"
//                   />
//                 </div>
//                 <div className="flex ml-2 mb-6">
//                   <div className="absolute top-10">
//                     {values?.photo ? (
//                       <img
//                         src={values?.photo}
//                         alt="Student"
//                         className="w-20 h-20 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
//                         <span className="text-[#ee582c] text-sm">NO IMAGE</span>
//                       </div>
//                     )}
//                     <label className="absolute bottom-0 right-0 bg-[#ee582c] text-white p-2 rounded-full cursor-pointer">
//                       <Camera size={18} />
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={(e) => handlePhotoChange(e, "student")}
//                       />
//                     </label>
//                   </div>
//                 </div>

//                 <svg
//                   class="absolute bottom-0 "
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 1440 320"
//                 >
//                   <path
//                     fill="#ffffff"
//                     fill-opacity="1"
//                     d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,122.7C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
//                   ></path>
//                 </svg>
//               </div>
//               <div class="px-6 pt-4 pb-8 bg-white rounded-tr-4xl">
//                 <form class="" action="" method="POST">
//                   <div class="relative ">
//                     <input
//                       type="text"
//                       name="admissionNumber"
//                       value={values?.admissionNo}
//                       onChange={handleInputChange}
//                       id="admissionNumber"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#ee582c] placeholder-transparent focus:outline-none focus:border-rose-600"
//                       placeholder="admissionNumber"
//                     />
//                     <label
//                       for="admissionNumber"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Admission No.
//                     </label>
//                   </div>

//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="rollNo"
//                       placeholder="Enter Roll Number"
//                       value={values?.rollNo}
//                       onChange={handleInputChange}
//                       id="rollNo"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#ee582c] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="rollNo"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Roll Number
//                     </label>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fullName"
//                       placeholder="Enter Student Name"
//                       value={values?.fullName}
//                       onChange={handleInputChange}
//                       id="fullName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#ee582c] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fullName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Student Name
//                     </label>
//                   </div>

//                   {/* <div className="flex flex-col space-y-1 mt-[2px]">
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
//           </div> */}
//                   <FormControl
//                     variant="standard"
//                     sx={{
//                       mt: 1,
//                       minWidth: 120,
//                       //  width:300
//                       width: "100%",
//                       "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                       "& .MuiSelect-root": { color: "#ee582c" }, // Selected text color
//                       "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                       "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                       "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                     }}
//                   >
//                     <InputLabel id="demo-simple-select-standard-label">
//                       Class
//                     </InputLabel>
//                     <Select
//                       labelId="demo-simple-select-standard-label"
//                       id="demo-simple-select-standard"
//                       // value={values?.class}
//                       // onChange={handleInputChange}
//                       value={selectedClass}
//                       onChange={handleClassChange}
//                       label="Class"
//                       name="studentclass"
//                       sx={{
//                         color: "#ee582c", // Selected text color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                         "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                           borderBottom: "2px solid #ee582c", // Hover border color
//                         },
//                       }}
//                     >
//                       {getClass?.map((cls, index) => (
//                       <MenuItem
//                       value={cls.className}

//                       >{ cls?.className}</MenuItem>
//                       ))}

//                     </Select>
//                   </FormControl>
//                   <FormControl
//                     variant="standard"
//                     sx={{
//                       mt: 1,
//                       minWidth: 120,
//                       width: "100%",
//                       "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                       "& .MuiSelect-root": { color: "#ee582c" }, // Selected text color
//                       "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                       "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                       "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                     }}
//                   >
//                     <InputLabel id="demo-simple-select-standard-label">
//                       Section
//                     </InputLabel>
//                     <Select
//                       labelId="demo-simple-select-standard-label"
//                       id="demo-simple-select-standard"
//                       // value={values?.section}
//                       // onChange={handleInputChange}
//                       value={selectedSection}
//                       onChange={handleSectionChange}
//                       label="Section"
//                       name="studentSection"
//                       sx={{
//                         color: "#ee582c", // Selected text color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                         "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                           borderBottom: "2px solid #ee582c", // Hover border color
//                         },
//                       }}
//                     >
//                        {availableSections?.map((item, index) => (
//                       <MenuItem key={index} value={item}> {item}</MenuItem>
//                        ))}
//                     </Select>
//                   </FormControl>
//                   <FormControl
//                     variant="standard"
//                     sx={{
//                       mt: 1,
//                       minWidth: 120,
//                       //  width:300
//                       width: "100%",
//                       "& .MuiInputLabel-root": { color: "#ee582c" }, // Label color
//                       "& .MuiSelect-root": { color: "#ee582c" }, // Selected text color
//                       "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                       "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                       "&:after": { borderBottom: "2px solid #ee582c" }, // Botto
//                     }}
//                   >
//                     <InputLabel id="demo-simple-select-standard-label">
//                       Gender
//                     </InputLabel>
//                     <Select
//                       labelId="demo-simple-select-standard-label"
//                       id="demo-simple-select-standard"
//                       value={values?.gender}
//                       onChange={handleInputChange}
//                       label="Gender"
//                       name="gender"
//                       sx={{
//                         color: "#ee582c", // Selected text color
//                         // backgroundColor: "black", // Background color
//                         "& .MuiSelect-icon": { color: "#ee582c" }, // Dropdown arrow color
//                         "&:before": { borderBottom: "2px solid #ee582c" }, // Bottom border before focus
//                         "&:after": { borderBottom: "2px solid #ee582c" }, // Bottom border after focus
//                         "&:hover:not(.Mui-disabled, .Mui-error):before": {
//                           borderBottom: "2px solid #ee582c", // Hover border color
//                         },
//                       }}
//                     >

//                       <MenuItem value="Male">Male</MenuItem>
//                       <MenuItem value="Female">Female</MenuItem>
//                       <MenuItem value="Other">Other</MenuItem>
//                     </Select>
//                   </FormControl>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="fatherName"
//                       placeholder="Enter Father Name"
//                       value={values?.fatherName}
//                       onChange={handleInputChange}
//                       id="fatherName"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#ee582c] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="fatherName"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Father Name
//                     </label>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="contact"
//                       placeholder="Contact No."
//                       value={values?.contact}
//                       onChange={handleInputChange}
//                       id="contact"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#ee582c] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="contact"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Contact No.
//                     </label>
//                   </div>
//                   <div class="relative mt-4">
//                     <input
//                       type="text"
//                       name="address"
//                       placeholder="Enter Address"
//                       value={values?.address}
//                       onChange={handleInputChange}
//                       id="address"
//                       className="peer h-10 w-full border-b-2 border-[#ee582c] text-[#ee582c] placeholder-transparent focus:outline-none focus:border-rose-600"
//                     />
//                     <label
//                       for="address"
//                       class="absolute left-0 -top-3.5 text-[#ee582c] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#ee582c] peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[#ee582c] peer-focus:text-sm"
//                     >
//                       Enter Address
//                     </label>
//                   </div>
//                 </form>

//               </div>
//               <div className='px-4  shadow-xl bg-white '>
//                 {
//                     buttonLabel==="Save"?(
//                         <button
//                         className="w-full bg-[#2fa7db] text-white  rounded-md mb-5 py-2 "
//                         onClick={  handleSaveClick}
//                         // onClick={ handleSaveClick}
//                         disabled={loading}
//                       >
//                         {loading ? "Saving..." : buttonLabel}
//                       </button>
//                     ):(  <button
//                         className="w-full bg-[#2fa7db] text-white  rounded-md mb-14 py-2 "
//                         onClick={handleUpDateClick}
//                         disabled={loading}
//                     >
//                         {loading ? 'Updating...' : buttonLabel}

//                     </button>)
//                 }

//           </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={`More Details`}>
//         {croppedImageSource ? (
//           <div className="relative w-full aspect-square">
//             <Cropper
//               image={croppedImageSource}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
//               <button
//                 onClick={cancelCrop}
//                 className="bg-red-500 text-white py-2 px-4 rounded"
//               >
//                 Cancel Crop
//               </button>
//               <button
//                 onClick={showCroppedImage}
//                 className="bg-blue-500 text-white py-2 px-4 rounded"
//               >
//                 Crop Image
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="px-4 pb-2 min-w-[330px]">
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Guardian Name:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="guardianName"
//                 name="guardianName"
//                 type="text"
//                 placeholder="Guardian Name"
//                 onChange={handleInputChange}
//                 value={values?.guardianName}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Transport:
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="transport"
//                 name="transport"
//                 type="text"
//                 placeholder="Transport"
//                 value={values?.transport}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="transport"
//               >
//                 Remarks:
//               </label>

//               <textarea
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="remarks"
//                 name="remarks"
//                 type="text"
//                 placeholder="Remarks"
//                 value={values?.remarks}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Father Photo:
//                 </label>
//                 {values?.fatherPhoto ? (
//                   <img
//                     src={values?.fatherPhoto}
//                     alt="Student"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={(e) => handlePhotoChange(e, "father")}
//                   />
//                 </label>
//               </div>
//             </div>
//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Mother Photo:
//                 </label>
//                 {values?.motherPhoto ? (
//                   <img
//                     src={values?.motherPhoto}
//                     alt="Student"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={(e) => handlePhotoChange(e, "mother")}
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <label
//                   className="block text-gray-700 text-sm font-bold mb-2"
//                   htmlFor="transport"
//                 >
//                   Guardian Photo:
//                 </label>
//                 {values?.guardianPhoto ? (
//                   <img
//                     src={values?.guardianPhoto}
//                     alt="Student"
//                     className="w-24 h-24 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-[#ee582c]">NO IMAGE</span>
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                   <Camera size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={(e) => handlePhotoChange(e, "guardian")}
//                   />
//                 </label>
//               </div>
//             </div>

//           </div>
//         )}
//       </Modal>
//     </>
//   );
// }

// export default DynamicFormFileds;

// import React, { useState, useCallback } from 'react';
// import { X, Calendar, Camera } from 'lucide-react';
// import Cropper from 'react-easy-crop';
// import getCroppedImg from './getCroppedImg';
// // import { Admission } from '../Network/ThirdPartyApi';

// import Modal from '../../Modal';

// function DynamicFormFileds({ student ,setValues}) {
//     const schoolID = localStorage.getItem("SchoolID");
//     const [modalOpen, setModalOpen] = useState(false);

//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//     const [croppedImageSource, setCroppedImageSource] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [currentPhotoType, setCurrentPhotoType] = useState(null); // new state

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setValues(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handlePhotoChange = (e, photoType) => {
//         const file = e.target.files?.[0];

//         if (file) {
//             setCurrentPhotoType(photoType);  // Set the type (father, mother, guardian)
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setCroppedImageSource(reader.result); // set the cropped image source to reader result for cropping purpose
//             };
//             reader.readAsDataURL(file);
//         }
//     };
//     const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//         setCroppedAreaPixels(croppedAreaPixels);
//     }, []);
//     const cancelCrop = useCallback(() => {
//         setCroppedImageSource(null);
//     }, [setCroppedImageSource]);

//     const showCroppedImage = async () => {
//         try {
//             const croppedImageUrl = await getCroppedImg(croppedImageSource, croppedAreaPixels);
//             setCroppedImageSource(null);
//             switch (currentPhotoType) {
//                 case 'father':
//                     setValues(prev => ({ ...prev, fatherPhoto: croppedImageUrl }));
//                     break;
//                 case 'mother':
//                     setValues(prev => ({ ...prev, motherPhoto: croppedImageUrl }));
//                     break;
//                 case 'guardian':
//                     setValues(prev => ({ ...prev, guardianPhoto: croppedImageUrl }));
//                     break;
//                 default:
//                     setValues(prev => ({ ...prev, photo: croppedImageUrl })); // Main photo
//                     break;
//             }
//             setCurrentPhotoType(null);

//         } catch (error) {
//             console.error("Error cropping image:", error);
//         }
//     };

//     const handleMoreDetails = () => {
//         setModalOpen(true);
//     }
//     if (croppedImageSource) {
//         return (

//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//                 <div className="bg-white rounded-lg p-4 w-full max-w-md">
//                     <div className="relative h-64 w-full">
//                         <Cropper
//                             image={croppedImageSource}
//                             crop={crop}
//                             zoom={zoom}
//                             aspect={1}
//                             onCropChange={setCrop}
//                             onZoomChange={setZoom}
//                             onCropComplete={onCropComplete}
//                         />
//                     </div>
//                     <div className="flex justify-end gap-2 mt-4">
//                         <button
//                             onClick={() => setCroppedImageSource(null)}
//                             className="px-4 py-2 bg-gray-200 rounded-md"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={showCroppedImage}
//                             className="px-4 py-2 bg-blue-500 text-white rounded-md"
//                         >
//                             Crop
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="w-full max-w-md bg-white rounded-lg p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-semibold">Student Details</h2>
//                     <button
//                         onClick={() => handleMoreDetails()}
//                         className="text-gray-500">
//                         More Details
//                     </button>
//                 </div>

//                 <div className="flex justify-center mb-6">
//                     <div className="relative">
//                         {student.photo ? (
//                             <img
//                                 src={student.photo}
//                                 alt="Student"
//                                 className="w-24 h-24 rounded-full object-cover"
//                             />
//                         ) : (
//                             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                                 <span className="text-gray-400">NO IMAGE</span>
//                             </div>
//                         )}
//                         <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                             <Camera size={16} />
//                             <input
//                                 type="file"
//                                 className="hidden"
//                                 accept="image/*"
//                                 onChange={(e) => handlePhotoChange(e, 'student')}
//                             />
//                         </label>
//                     </div>
//                 </div>
//                 <div className="space-y-4">
//                     <input
//                         type="text"
//                         name="admissionNo"
//                         placeholder="Enter Admission No."
//                         className="w-full px-3 py-2 border rounded-md"
//                         value={student.admissionNo}
//                         onChange={handleInputChange}
//                     />

//                     <input
//                         type="text"
//                         name="rollNo"
//                         placeholder="Enter Roll Number"
//                         className="w-full px-3 py-2 border rounded-md"
//                         value={student.rollNo}
//                         onChange={handleInputChange}
//                     />

//                     <input
//                         type="text"
//                         name="name"
//                         placeholder="Enter Student Name"
//                         className="w-full px-3 py-2 border rounded-md"
//                         value={student.name}
//                         onChange={handleInputChange}
//                         required
//                     />

//                     <select
//                         name="class"
//                         className="w-full px-3 py-2 border rounded-md text-gray-600"
//                         value={student.class}
//                         onChange={handleInputChange}
//                     >
//                         <option value="">Select Class</option>
//                         <option value="1">Class 1</option>
//                         <option value="2">Class 2</option>
//                         <option value="3">Class 3</option>
//                     </select>

//                     <select
//                         name="section"
//                         className="w-full px-3 py-2 border rounded-md text-gray-600"
//                         value={student.section}
//                         onChange={handleInputChange}
//                     >
//                         <option value="">Select Section</option>
//                         <option value="A">Section A</option>
//                         <option value="B">Section B</option>
//                         <option value="C">Section C</option>
//                     </select>
//                     <select
//                         name="gender"
//                         className="w-full px-3 py-2 border rounded-md text-gray-600"
//                         value={student.gender}
//                         onChange={handleInputChange}
//                     >
//                         <option value="">Select Gender</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="other">Other</option>
//                     </select>

//                     <div className="relative">
//                         <input
//                             type="date"
//                             name="dob"
//                             placeholder='DOB'
//                             className="w-full px-3 py-2 border rounded-md"
//                             value={student.dob}
//                             onChange={handleInputChange}
//                         />
//                         <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
//                     </div>

//                     <input
//                         type="text"
//                         name="fatherName"
//                         placeholder="Enter Father Name"
//                         className="w-full px-3 py-2 border rounded-md"
//                         value={student.fatherName}
//                         onChange={handleInputChange}
//                     />

//                     <input
//                         type="text"
//                         name="contact"
//                         placeholder="Contact No."
//                         className="w-full px-3 py-2 border rounded-md"
//                         value={student.contact}
//                         onChange={handleInputChange}
//                     />

//                     <input
//                         type="text"
//                         name="address"
//                         placeholder="Enter Address"
//                         className="w-full px-3 py-2 border rounded-md"
//                         value={student.address}
//                         onChange={handleInputChange}
//                     />

//                 </div>

//             </div>
//             <Modal
//                 isOpen={modalOpen}
//                 setIsOpen={setModalOpen}
//                 title={`More Details`}
//             >

//                 {croppedImageSource ? (
//                     <div className='relative w-full aspect-square'>
//                         <Cropper
//                             image={croppedImageSource}
//                             crop={crop}
//                             zoom={zoom}
//                             aspect={1}
//                             onCropChange={setCrop}
//                             onZoomChange={setZoom}
//                             onCropComplete={onCropComplete}
//                         />
//                         <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4'>
//                             <button
//                                 onClick={cancelCrop}
//                                 className='bg-red-500 text-white py-2 px-4 rounded'>
//                                 Cancel Crop
//                             </button>
//                             <button
//                                 onClick={showCroppedImage}
//                                 className='bg-blue-500 text-white py-2 px-4 rounded'>
//                                 Crop Image
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className='px-4 pb-2'>
//                         <div className="mb-2">
//                             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
//                                 Guardian Name:
//                             </label>
//                             <input
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 id="guardianName"
//                                 name="guardianName"
//                                 type="text"
//                                 placeholder="Guardian Name"
//                                 onChange={handleInputChange}
//                                 value={student.guardianName}
//                             />
//                         </div>
//                         <div className="mb-2">
//                             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
//                                 Transport:
//                             </label>
//                             <input
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 id="transport"
//                                 name="transport"
//                                 type="text"
//                                 placeholder="Transport"
//                                 value={student.transport}
//                                 onChange={handleInputChange}
//                             />

//                         </div>
//                         <div className="mb-2">
//                             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
//                             Remarks:
//                             </label>

//                             <textarea
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 id="remarks"
//                                 name="remarks"
//                                 type="text"
//                                 placeholder="Remarks"
//                                 value={student.remarks}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         <div className="flex justify-center mb-6">
//                             <div className="relative">
//                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
//                                     Father Photo:
//                                 </label>
//                                 {student.fatherPhoto ? (
//                                     <img
//                                         src={student.fatherPhoto}
//                                         alt="Student"
//                                         className="w-24 h-24 rounded-full object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                                         <span className="text-gray-400">NO IMAGE</span>
//                                     </div>
//                                 )}
//                                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                                     <Camera size={16} />
//                                     <input
//                                         type="file"
//                                         className="hidden"
//                                         accept="image/*"
//                                         onChange={(e) => handlePhotoChange(e, 'father')}
//                                     />
//                                 </label>
//                             </div>
//                         </div>
//                         <div className="flex justify-center mb-6">
//                             <div className="relative">
//                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
//                                     Mother Photo:
//                                 </label>
//                                 {student.motherPhoto ? (
//                                     <img
//                                         src={student.motherPhoto}
//                                         alt="Student"
//                                         className="w-24 h-24 rounded-full object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                                         <span className="text-gray-400">NO IMAGE</span>
//                                     </div>
//                                 )}
//                                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                                     <Camera size={16} />
//                                     <input
//                                         type="file"
//                                         className="hidden"
//                                         accept="image/*"
//                                         onChange={(e) => handlePhotoChange(e, 'mother')}
//                                     />
//                                 </label>
//                             </div>
//                         </div>

//                         <div className="flex justify-center mb-6">
//                             <div className="relative">
//                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transport">
//                                     Guardian Photo:
//                                 </label>
//                                 {student.guardianPhoto ? (
//                                     <img
//                                         src={student.guardianPhoto}
//                                         alt="Student"
//                                         className="w-24 h-24 rounded-full object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
//                                         <span className="text-gray-400">NO IMAGE</span>
//                                     </div>
//                                 )}
//                                 <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
//                                     <Camera size={16} />
//                                     <input
//                                         type="file"
//                                         className="hidden"
//                                         accept="image/*"
//                                         onChange={(e) => handlePhotoChange(e, 'guardian')}
//                                     />
//                                 </label>
//                             </div>
//                         </div>

//                     </div>
//                 )}
//             </Modal>
//         </>
//     );
// }

// export default DynamicFormFileds;

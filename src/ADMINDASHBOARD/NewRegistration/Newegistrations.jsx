import React, { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../contexts/ContextProvider.js";
import DynamicDataTable from "./DataTable.jsx";
import NoDataFound from "../../NoDataFound.jsx";
import Loading from "../../Loading.jsx";
import RegForm from "./RegForm.jsx";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { StudentDeleteRegistrations, StudentgetRegistrations, StudentApproveAdmissions } from "../../Network/AdminApi.js"; // Import your Approve Admissions API
import { useReactToPrint } from 'react-to-print';
import { Modal } from "@mui/material";

import { Box } from "@mui/material";
import { AiFillDelete, AiFillEye, AiFillPrinter, AiOutlineShareAlt } from 'react-icons/ai';
import Button from "../../Dynamic/utils/Button.jsx";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Table from "../../Dynamic/Table.jsx";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs .jsx";
const uploadPDF = async (pdfBlob) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate a successful upload and return a dummy URL
            const dummyURL = "https://example.com/your-uploaded-pdf.pdf"; // Replace with your URL
            resolve(dummyURL);
        }, 1500); // Simulate upload delay
    });
};

const MobileRegistrationCard = ({ student, onClose, handleDelete }) => {
    const schoolName = sessionStorage.getItem("schoolName");
    const schoolimage = sessionStorage.getItem("image");
    const schoolAddress = sessionStorage.getItem("schooladdress");
    const schoolContact = sessionStorage.getItem("contact");

    // Ref for printing
    const componentPDF = useRef();

    // State to track if printing is in progress
    const [isPrinting, setIsPrinting] = useState(false);

    // Handle print (unchanged - keeps the default print option)
    const handlePrint = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: `Registration_${student.registrationNumber}`,
        onAfterPrint: () => toast.success("PDF Downloaded Successfully!"),
    });

    // Handle WhatsApp Share of PDF
    const handleWhatsAppSharePDF = async () => {
        const element = componentPDF.current;

        if (!element) {
            console.error("Component not found for PDF generation.");
            toast.error("Failed to generate PDF for sharing.");
            return;
        }

        try {
            const canvas = await html2canvas(element, {
                useCORS: true, // Required if images are from different domains
                scale: 2      // Increase scale for higher resolution
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');  // Portrait, millimeters, A4 size
            const imgWidth = 210;  // A4 width
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Keep aspect ratio
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            const pdfBlob = pdf.output('blob'); // Create a Blob from the PDF
            toast.info("Uploading PDF..."); // Show a message during upload
            const pdfURL = await uploadPDF(pdfBlob); // Await the upload and get the URL
            if (!pdfURL) {
                toast.error("Failed to upload PDF.");
                return;
            }

            toast.success("PDF uploaded successfully!");
            const message = `*${schoolName} Registration Details*\n\n*Registration Number:* ${student.registrationNumber}\n*Student's Name:* ${student.studentFullName}\n*Guardian's Name:* ${student.guardianName}\n*Email:* ${student.studentEmail}\n*Gender:* ${student.gender}\n*Class:* ${student.registerClass}\n*Mobile:* ${student.mobileNumber}\n*Address:* ${student.studentAddress}\n\n${schoolName} - ${schoolAddress} - Contact: ${schoolContact}\n\nCheck out this registration receipt: ${pdfURL}`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');

        } catch (error) {
            console.error("Error generating or sharing PDF:", error);
            toast.error("Error sharing PDF.");
        }
    };

    return (
        <Modal
            open={true}
            onClose={onClose}
            aria-labelledby="mobile-registration-modal"
            aria-describedby="mobile-registration-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%', // Mobile ke liye width 90% rakhi hai
                    maxWidth: 350, // Maximum width ko aur chhota kiya
                    bgcolor: 'background.paper',
                    border: '1px solid #000', // Border thickness reduced
                    boxShadow: 24,
                    p: 1, // Padding aur bhi reduce kiya
                    overflowY: 'auto', // Scrolling enable hai
                    maxHeight: '90vh', // Maximum height to fit within the screen
                }}
            >
                <div ref={componentPDF} style={{ width: "100%" }}>
                    <div className="max-w-2xl mx-auto p-1 border border-black bg-yellow-100 mt-2">
                        <div className="relative">

                            <div className="absolute top-0 left-0 flex justify-between h-[60px] w-[60px] object-cover">
                                <img
                                    className="w-full h-full"
                                    src={schoolimage}
                                    alt="school logo"
                                />
                            </div>

                            <div className="absolute top-0 right-0 text-sm">
                                <span>Reg.No. {student?.registrationNumber}</span>
                            </div>
                        </div>
                        <div className="text-center font-bold text-md mb-2 w-[80%] mx-auto mt-4">
                            {schoolName}
                            <p className="text-xs text-gray-700">{schoolAddress}</p>
                            <p className="text-xs text-gray-700">Mobile No. : {schoolContact}</p>
                            <div className="text-center text-xs mb-2">Registration Receipt</div>
                        </div>
                        <div className="mb-2">
                            <div className="flex justify-between border-b-1 border-black border-dashed text-xs">
                                <span>Reg. Date : {student?.formattedDate}</span>
                                <span>Session : 2024-25</span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 text-xs">
                            <span>Student's Name : {student?.studentFullName}</span>
                            <span>Guardian's Name : {student?.guardianName}</span>
                            <span>Email: {student?.studentEmail}</span>
                            <span>Gender: {student?.gender}</span>
                            <span>Class : {student?.registerClass}</span>
                            <span>Mob : {student?.mobileNumber}</span>
                            <span>Address : {student?.studentAddress}</span>
                        </div>

                        {/* Payment Details Table */}
                        <div className="my-2">
                            <table className="w-full mb-2 text-xs">
                                <thead>
                                    <tr>
                                        <th className="border border-black p-1">Sr. No.</th>
                                        <th className="border border-black p-1">Particulars</th>
                                        <th className="border border-black p-1">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-1 text-center">1</td>
                                        <td className="border border-black p-1 text-center">
                                            Admission Fee
                                        </td>
                                        <td className="border border-black p-1 text-center">
                                            {student?.amount}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end mb-2 text-xs">
                            <span>{student?.amount}/-</span>
                        </div>

                        {/* Signatures */}
                        <div className="flex justify-between mb-2 my-4 text-xs">
                            <span>Signature of Centre Head</span>
                            <span>Signature of Student</span>
                        </div>

                        {/* Footer Note */}
                        <div className="text-center text-[10px]">
                            All above mentioned Amount once paid are non-refundable in any case
                            whatsoever.
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-2 flex justify-between gap-3">
                    <Button name="Print" onClick={handlePrint} width="full" />
                    <Button name="Share PDF" onClick={handleWhatsAppSharePDF} width="full" />
                    <Button name="Close" onClick={onClose} width="full" color="#607093" />
                </div>
            </Box>
        </Modal>
    );
};

const Newegistrations = () => {
    const authToken = Cookies.get("token");

    const { currentColor, setIsLoader } = useStateContext();
    const [registrationData, setRegistrationData] = useState([]);
    const isMobile = window.innerWidth <= 768;
    const tableRef = useRef();
    const [selectedRegistration, setSelectedRegistration] = useState(null); // For mobile modal

    // NEW: State to hold selected registration numbers
    const [selectedRegistrations, setSelectedRegistrations] = useState([]);

    // NEW: State to track if all are selected
    const [selectAll, setSelectAll] = useState(false);

    const getREg = async () => {
        setIsLoader(true)
        const response = await StudentgetRegistrations();

        if (response.success) {
            setIsLoader(false)
            setRegistrationData([]);
            setRegistrationData(response?.data || []);
           
        } else {

            toast.error(response.message)
           
        }
    };

    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);

        if (!selectAll) {
            // Select all
            const allRegistrationNumbers = registrationData?.map((student) => student.registrationNumber);
            setSelectedRegistrations(allRegistrationNumbers);
        } else {
            // Unselect all
            setSelectedRegistrations([]);
        }
    };

    const THEAD = [
        {
            id: "select", label: (
                <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
            )
        }, // New column for checkbox
        { id: "SN", label: "S No." },
        { id: "registrationNumber", label: "Registration No" },
        { id: "studentFullName", label: "Name" },
        { id: "guardianName", label: "Father Name" },
        { id: "gender", label: "Gender" },
        { id: "registerClass", label: "Class" },
        { id: "mobileNumber", label: "Contact" },
        { id: "amount", label: "Reg. Fee" },
        { id: "action", label: "Action" },
    ];

    const handleCheckboxChange = (registrationNumber) => {
        setSelectedRegistrations((prevSelected) => {
            if (prevSelected.includes(registrationNumber)) {
                return prevSelected.filter((regNum) => regNum !== registrationNumber); // Unselect
            } else {
                return [...prevSelected, registrationNumber]; // Select
            }
        });
    };

    const tBody = registrationData?.map((val, ind) => ({
        select: (
            <input
                type="checkbox"
                checked={selectedRegistrations.includes(val.registrationNumber)}
                onChange={() => handleCheckboxChange(val.registrationNumber)}
            />
        ),
        "SN": ind + 1,
        registrationNumber: <span className="text-red-700 font-semibold">{val.registrationNumber}</span>,
        studentFullName: val.studentFullName,
        guardianName: val.guardianName,
        gender: val.gender,
        registerClass: val.registerClass,
        mobileNumber: val.mobileNumber,
        amount: val.amount,
        feeStatus: val.feeStatus,
        action: <span onClick={() => setSelectedRegistration(val)} className="cursor-pointer">
            <AiFillEye className="text-[25px] text-green-700" />
        </span>
    }));

    useEffect(() => {
        getREg();
    }, []);

    // Update selectAll when registrationData or selectedRegistrations changes
    useEffect(() => {
        if (registrationData?.length > 0) {
            setSelectAll(selectedRegistrations.length === registrationData?.length);
        } else {
            setSelectAll(false);
        }
    }, [registrationData, selectedRegistrations]);

    const handlePrint = useReactToPrint({
        content: () => tableRef.current,
    });

    const handleDelete = async (registrationNumber) => {
        const ConfirmToast = ({ closeToast }) => (
            <div style={{ marginTop: '100px' }}>
                <p>Are you sure you want to delete this student?</p>
                <button
                    className="text-red-700 font-bold text-xl"
                    onClick={async () => {
                        try {
                            // setLoading(true);
                            setIsLoader(true)
                            const response = await StudentDeleteRegistrations(registrationNumber);
                          
                            if (response) {
                                setIsLoader(false)
                                // setLoading(false);
                                getREg();
                            }
                        } catch (error) {
                            console.log(error);
                        } finally {
                            closeToast(); // Close the toast after the operation
                        }
                    }}
                    style={{ marginRight: "10px" }}
                >
                    Yes
                </button>
                <button onClick={closeToast} className="text-green-800 text-xl">
                    No
                </button>
            </div>
        );

        toast(<ConfirmToast />);
    };

    const handleApproveAdmissions = async () => {
        if (selectedRegistrations.length === 0) {
            toast.warn("Please select at least one registration to approve.");
            return;
        }

        const payload = {
            students: registrationData
                .filter(student => selectedRegistrations.includes(student.registrationNumber))
                .map(student => ({
                    registrationNumber: student.registrationNumber,
                    studentFullName: student.studentFullName,
                    guardianName: student.guardianName,
                    gender: student.gender,
                    registerClass: student.registerClass,
                    mobileNumber: student.mobileNumber,
                    amount: student.amount,
                    studentEmail: student.studentEmail,
                    studentAddress: student.studentAddress,
                    // Add other student details here as needed
                })),
        };
//         const payload = {
//             registrationNumbers: selectedRegistrations, // Send the array of registration numbers
//         };

        // try {
        //     setIsLoader(true);
        //     const response = await StudentApproveAdmissions(payload);

        //     if (response.success) {
        //         toast.success(response.message);
        //         getREg(); // Refresh the registration data
        //         setSelectedRegistrations([]); // Clear selections
        //         setSelectAll(false); // Uncheck the select all checkbox
        //     } else {
        //         toast.error(response.message);
        //     }
        // } catch (error) {
        //     console.error("Error approving admissions:", error);
        //     toast.error("Failed to approve admissions. Please try again.");
        // } finally {
        //     setIsLoader(false);
        // }
    };

    const renderMobileCards = () => {
        return (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {registrationData?.map((student, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-4 relative transition-transform hover:scale-105 cursor-pointer"
                    >
                        <div className="absolute top-2 right-2 flex space-x-2 gap-2">
                            <input
                                type="checkbox"
                                checked={selectedRegistrations.includes(student.registrationNumber)}
                                onChange={() => handleCheckboxChange(student.registrationNumber)}
                            />
                            <span onClick={() => setSelectedRegistration(student)}>
                                <AiFillEye className="text-[25px] text-green-700" />
                            </span>
                            <span onClick={() => handleDelete(student.registrationNumber)}>
                                <AiFillDelete className="text-[25px] text-red-800" />
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            {student.studentFullName}
                        </h3>
                        <p>
                            <strong>Reg No:</strong> {student.registrationNumber}
                        </p>
                        <p>
                            <strong>Guardian Name:</strong> {student.guardianName}
                        </p>
                        <p>
                            <strong>Email:</strong> {student.studentEmail}
                        </p>
                        <p>
                            <strong>Class:</strong>{student.registerClass}
                        </p>
                        <p>
                            <strong>Mobile:</strong>{student.mobileNumber}
                        </p>
                        <p>
                            <strong>Address:</strong>{student.studentAddress}
                        </p>
                    </div>
                ))}
            </div>
        );
    };
    const BreadItem=[
        {
          title:"Registration",
          link:"/registration"
        }
      ]
    return (
        <div className="mx-auto px-3 md:h-[86.5vh]">
              {/* <div class="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div class="mr-6">
          <h1 class="text-3xl font-semibold mb-2">Dashboard</h1>
          <h2 class="text-gray-600 ml-0.5">Mobile UX/UI Design course</h2>
        </div>
        <div class="flex flex-wrap items-start justify-end -mb-3">
          <button class="inline-flex px-5 py-3 text-blue-600 hover:text-blue-700 focus:text-blue-700 hover:bg-blue-100 focus:bg-blue-100 border border-blue-600 rounded-md mb-3">
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="flex-shrink-0 h-5 w-5 -ml-1 mt-0.5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Manage dashboard
          </button>
          <button class="inline-flex px-5 py-3 text-white bg-blue-600 hover:bg-purple-700 focus:bg-blue-700 rounded-md ml-6 mb-3">
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create new dashboard
          </button>
        </div>
      </div> */}
             <Breadcrumbs BreadItem={BreadItem} />
            {/* <h1
                className="text-xl text-center font-bold uppercase"
                style={{ color: currentColor }}
            >
                Registration
            </h1> */}

            <div className="flex gap-1 md:flex-row ">
                <div className="mb-1 md:mb-0">
                    <RegForm />
                </div>
                <div className="">
                <Button
                name="Approve Admissions"
                onClick={handleApproveAdmissions}
                width="fit-content"
                color="green"
            />
                </div>
            </div>

            {/* Approve Admissions Button */}
            
            

            <div ref={tableRef}>
                {isMobile ? (
                    <>
                        {registrationData && registrationData?.length > 0 ? (
                            renderMobileCards()
                        ) : (
                            <NoDataFound />
                        )}

                    </>
                ) : (
                    registrationData && registrationData?.length > 0 ? (
                        <Table
                            isSearch={true}
                            tHead={THEAD}
                            tBody={tBody} />

                    ) : (
                        <NoDataFound />
                    )
                )}
                {selectedRegistration && (
                    <MobileRegistrationCard
                        student={selectedRegistration}
                        onClose={() => setSelectedRegistration(null)}
                        handleDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
};

export default Newegistrations;


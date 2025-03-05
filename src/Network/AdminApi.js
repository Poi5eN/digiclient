


import { apiUrls } from './ApiEndpoints';
import makeApiRequest from './makeApiRequest'; // Provide the correct path



// Class Start
export const login = async (payload) => {
  try {
    const option = {
      method: "POST",
      payloadData: payload// Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls.login}`, option);
    return data;
  } catch (error) {
    console.error(error, "Something Went Wrong");
  }
};
export const adminRoutecreateClass = async (payload) => {
  try {
    const option = {
      method: "POST",
      payloadData: payload// Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls.adminRoutecreateClass}`, option);
    return data;
  } catch (error) {
    console.error(error, "Something Went Wrong");
  }
};
export const adminapproveAdmissions = async (payload) => {
  try {
    const option = {
      method: "POST",
      payloadData: payload// Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls.adminRouteapproveAdmissions}`, option);
    return data;
  } catch (error) {
    console.error(error, "Something Went Wrong");
  }
};

// Class End
// Registration Start


export const StudentgetRegistrations = async () => {
  try {
    const option = {
      method: "GET", // Ensure the method is GET
    };
    const data = await makeApiRequest(apiUrls?.getRegistrations, option);
    return data;
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error; // Re-throw the error to allow the component to handle it.
  }
};
export const getAllTeachers = async () => {
  try {
    const option = {
      method: "GET", // Ensure the method is GET
    };
    const data = await makeApiRequest(apiUrls?.getTeachers, option);
    return data;
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error; // Re-throw the error to allow the component to handle it.
  }
};





export const getAllStudents = async () => {
  try {
    const option = {
      method: "GET", // Ensure the method is GET
    };
    const data = await makeApiRequest(apiUrls?.getAllStudents, option);
    return data;
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error; // Re-throw the error to allow the component to handle it.
  }
};
export const adminpendingAdmissions = async () => {
  try {
    const option = {
      method: "GET", // Ensure the method is GET
    };
    const data = await makeApiRequest(apiUrls?.adminRoutependingAdmissions, option);
    return data;
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error; // Re-throw the error to allow the component to handle it.
  }
};
export const getStudentAndParent = async (email) => {
  try {
    const option = {
      method: "GET", // Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls?.getStudentAndParent}/${email}`, option);
    return data;
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error; // Re-throw the error to allow the component to handle it.
  }
};


export const StudentCreateRegistrations = async (payload) => {
  try {
    const option = {
      method: "POST",
      payloadData: payload// Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls.createRegistrations}`, option);
    return data;
  } catch (error) {
    console.error(error, "Something Went Wrong");
  }
};

export const StudentDeleteRegistrations = async (registrationNumber) => {
  console.log("registrationNumber",registrationNumber)
  try {
    const option = {
      method: "delete",
      // payloadData: payload// Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls.deleteRegistrations}/${registrationNumber}`, option);
    return data;
  } catch (error) {
    console.error(error, "Something Went Wrong");
  }
};
export const createBulkRegistrations = async (payload) => {
  try {
    const option = {
      method: "POST",
      payloadData: payload// Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls.adminRoutecreateBulkRegistrations}`, option);
    return data;
  } catch (error) {
    console.error(error, "Something Went Wrong");
  }
};



// Registration End

// Admission Start 
export const LastYearStudents = async () => {

  try {
    const option = {
      method: "GET", // Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls.getLastYearStudent}`, option);
    return data;
  } catch (error) {
    console.error(error, "Something Went Wrong");
  }
};
export const adminThirdPartystudents = async () => {

  try {
    const option = {
      method: "GET", // Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls.adminRouteThirdPartystudents}/filter?schoolId=076e7a68-9190-4616-8bab-3247ab55ac91`, option);
    return data;
  } catch (error) {
    console.error(error, "Something Went Wrong");
  }
};
export const createBulkStudentParent = async (payload) => {
  try {
    const option = {
      method: "POST",
      payloadData: payload// Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls.adminRoutecreateBulkStudentParent}`, option);
    return data;
  } catch (error) {
    console.error(error, "Something Went Wrong");
  }
};

export const createStudentParent = async (payload) => {
  console.log("payload",payload)
  try {
    const option = {
      method: "POST",
      payloadData: payload// Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls.createStudentParent}`, option);
    return data;
  } catch (error) {
    console.error(error, "Something Went Wrong");
  }
};


export const editStudentParent = async (_id,payload) => {
  try {
    const option = {
      method: "put", // Ensure the method is GET
      payloadData: payload
    };
    const data = await makeApiRequest(`${apiUrls?.editStudentParent}/${_id}`, option);
    return data;
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error; // Re-throw the error to allow the component to handle it.
  }
};	

// Admission End 

export const AdminGetAllClasses = async () => {
  try {
    const option = {
      method: "GET", // Ensure the method is GET
    };
    const data = await makeApiRequest(`${apiUrls.getAllClasses}`, option);
    return data;
  } catch (error) {
    console.error(error, "Something Went Wrong");
  }
};
import React, { useCallback, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import isTokenExpired from "./jwt";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const userRole = sessionStorage.getItem("userRole");

  const memoizedIsTokenExpired = useCallback(() => isTokenExpired(), []);

  useEffect(() => {
    if (token && memoizedIsTokenExpired()) {
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [token, memoizedIsTokenExpired]);

  if (!token || isTokenExpired() || !userRole) {
    // Clear storage if token exists but role is missing
    if (token && !userRole) {
      localStorage.clear();
      sessionStorage.clear();
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;



// import React, { useEffect } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import isTokenExpired from './jwt';

// const ProtectedRoute = () => {
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (token) {
//       const expired = isTokenExpired(token);
//       if (expired) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("userRole");
//       }
//     }
//   }, [token]);

//   // Token nahi hai ya expired hai to login page pe le jao
//   if (!token || isTokenExpired(token)) {
//     return <Navigate to="/login" />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;





// import React, { useEffect, useState } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import isTokenExpired from './jwt';

// const ProtectedRoute = () => {
//   const [isExpired, setIsExpired] = useState(false);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (token) {
//       const expired = isTokenExpired();
//       setIsExpired(expired);

//       if (expired) {
//         localStorage.clear();
//         // localStorage.removeItem("token"); // Sirf token delete karo
//       }
//     } else {
//       setIsExpired(true); // Token nahi hai to expired maan lo
//     }
//   }, [token]);

//   if (isExpired) {
//     return <Navigate to="/login" />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;




// import React, { useEffect } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import isTokenExpired from './jwt';
// // import { isTokenExpired } from './jwt'; // Assuming your isTokenExpired function is in jwt.js

// const ProtectedRoute = () => {

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (token && isTokenExpired()) {
     
//       localStorage.clear();
//       localStorage.removeItem("token");
//       // No need to set any state, just force a re-render by calling setState or use navigate
//     }
//   }, [token]);

//   if (!token || (token && isTokenExpired())) {
//     localStorage.clear();
//     return <Navigate to="/login" />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;



// import React from 'react'
// import { Navigate, Outlet } from 'react-router-dom'

// const ProtectedRoute = () => {
//  const token=   localStorage.getItem("token")
//  const userRole= sessionStorage.getItem("userRole");
// return token ? <Outlet /> : <Navigate to="/login" />;

// }

// export default ProtectedRoute
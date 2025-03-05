import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      <Navigate to="/login" />
    }
  }, [token]);

  if (token) {
    return <Navigate to={`/${userRole }`} />;
    // return <Navigate to={`/${userRole || "dashboard"}`} />;
  }

  return <Outlet />;
};

export default PublicRoute;



// import React, { useEffect } from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const PublicRoute = () => {
//   const token = localStorage.getItem("token");
//   const userRole = sessionStorage.getItem("userRole");

//   // Token check aur cleanup logic
//   useEffect(() => {
//     if (!token) {
//       localStorage.clear();
//       sessionStorage.clear();
//     }
//   }, [token]);

//   // Redirect condition: userRole valid ho aur token exist kare
//   if (token) {
//     return <Navigate to={`/${userRole || ""}`} />;
//   }

//   return <Outlet />;
// };

// export default PublicRoute;




// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const PublicRoute = () => {
//     const token = localStorage.getItem("token");
//   const userRole= sessionStorage.getItem("userRole");

//     return token ? <Navigate to={`/${userRole}`} /> : <Outlet />;
//     // return token ? <Navigate to="/" /> : <Outlet />;
// };

// export default PublicRoute;
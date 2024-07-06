import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation, useNavigate, Navigate } from "react-router-dom";
import Crypto from "./pages/Crypto";
import Stocks from "./pages/Stocks";

// Define a type guard to check if a performance entry is of type PerformanceNavigationTiming
function isNavigationTiming(entry: PerformanceEntry): entry is PerformanceNavigationTiming {
  return entry.entryType === "navigation";
}

const routes = [
  {
    element: <Stocks />,
    path: "/",
  },
  {
    element: <Stocks />,
    path: "/:symbol",
  },
  {
    element: <Crypto />,
    path: "/crypto/:symbol",
  },
  {
    element: <Crypto />,
    path: "/crypto",
  },
];

const App: React.FC = () => {
  const pathToRegex = (path: string) => {
    return new RegExp(`^${path.replace(/:\w+/g, "\\w+")}$`);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const initialRender = useRef(true); // useRef to track initial render

  useEffect(() => {
    // Check if the current location matches any of the defined routes
    const isValidPath = routes.some(route =>
      pathToRegex(route.path).test(location.pathname)
    );

    console.log(isValidPath,'uuuuuuuuuuuu');
    
    // Redirect to main page only on refresh and if path is not valid
    if (!isValidPath && !initialRender.current) {
      console.log('lllllllll');
      
      navigate("/");
    }

    // Update initialRender after first render
    initialRender.current = false;
  }, [location.pathname, navigate]);

  return (
    <Routes>
      {routes.map((route, i) => (
        <Route element={route.element} path={route.path} key={i} />
      ))}
      {/* 404 route - This will match any unmatched route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;

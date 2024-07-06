import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate, Navigate } from "react-router-dom";
import Crypto from "./pages/Crypto";
import Stocks from "./pages/Stocks";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [validPath, setValidPath] = useState(true);

  useEffect(() => {
    console.log('mmmmmmmmmmmmm');
    
    const checkValidPath = async () => {
      try {
        const response = await fetch(window.location.href);
        if (!response.ok) {
          console.log('pppppppppppppp');
          
          setValidPath(false);
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking path:", error);
        setValidPath(false);
        navigate("/");
      }
    };

    checkValidPath();
  }, [location.pathname, navigate]);

  return (
    <Routes>
      {routes.map((route, i) => (
        <Route element={route.element} path={route.path} key={i} />
      ))}
      {!validPath && <Route path="*" element={<Navigate to="/" />} />}
    </Routes>
  );
};

export default App;

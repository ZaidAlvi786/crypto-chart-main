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
  const [isValidPath, setIsValidPath] = useState(true);

  useEffect(() => {
    console.log("mmmmmmmmmmmmm");
    console.log(location,'iiiiiiiiqqqqqqqqqqqq');
    
    const pathToRegex = (path: string) => {
      return new RegExp(`^${path.replace(/:\w+/g, "\\w+")}$`);
    };

    const isPathValid = routes.some(route => pathToRegex(route.path).test(location.pathname));

    console.log(isPathValid, 'Path Validity Check');
    if (!isPathValid) {
      console.log("pppppppppppppp");
      setIsValidPath(false);
      navigate("/");
    } else {
      setIsValidPath(true);
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      {routes.map((route, i) => (
        <Route element={route.element} path={route.path} key={i} />
      ))}
      {!isValidPath && <Route path="*" element={<Navigate to="/" />} />}
    </Routes>
  );
};

export default App;

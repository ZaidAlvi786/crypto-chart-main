import { Route, Routes } from "react-router-dom";
import Crypto from "./pages/Crypto";
import Stocks from "./pages/Stocks";

const routes = [
  {
    element: <Stocks />,
    route: "/",
  },
  {
    element: <Stocks />,
    route: "/:symbol",
  },
  {
    element: <Crypto />,
    route: "/crypto/:symbol",
  },
  {
    element: <Crypto />,
    route: "/crypto",
  },
];
function App() {
  return (
    <Routes>
      {routes.map((route, i) => (
        <Route element={route.element} path={route.route} key={i} />
      ))}
    </Routes>
  );
}

export default App;

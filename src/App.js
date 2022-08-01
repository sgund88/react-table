import Home from "./page/Home";
import { useDispatch } from "react-redux";
import { fetchAllEmployees } from "./redux/thunk";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllEmployees());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;

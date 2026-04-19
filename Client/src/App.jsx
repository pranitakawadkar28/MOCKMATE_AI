import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "./features/auth/authThunks";
import AppRouter from "./routes/AppRouter";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe()); // cookie hai toh user restore hoga
  }, []);

  return <AppRouter />;
};

export default App;
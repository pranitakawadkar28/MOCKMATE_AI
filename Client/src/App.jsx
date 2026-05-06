import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "./features/auth/authThunks";
import AppRouter from "./routes/AppRouter";

const App = () => {
  const dispatch = useDispatch();

useEffect(() => {
    dispatch(getMe())
}, []);

  return <AppRouter />;
};

export default App;
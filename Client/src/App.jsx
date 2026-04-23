import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "./features/auth/authThunks";
import AppRouter from "./routes/AppRouter";

const App = () => {
  const dispatch = useDispatch();

  // App.jsx me temporarily add karo
useEffect(() => {
    dispatch(getMe()).then((res) => {
        console.log(res.payload)
    });
}, []);

  return <AppRouter />;
};

export default App;
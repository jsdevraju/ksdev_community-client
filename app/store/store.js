import { configureStore } from "@reduxjs/toolkit";
import auth, { login } from "../redux/authSlice";
import room from "../redux/roomSlice";
import friends from "../redux/friendSlice";
import chat from "../redux/messageSlice";
import { Provider } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";

//Create Our Store
export const store = configureStore({
  reducer: {
    auth,
    friends,
    chat,
    room
  },
  middleware:(getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck:false
  }),
  devTools: process.env.NODE_ENV !== "production",
});
//State Provider To Provide store state in our application
const StoreProvider = ({ children }) => {
  const router = useRouter();
  //checking if user logged in or not
  useEffect(() => {
    const myFunc = () => {
      const user = localStorage.getItem("user");
      if (user) store.dispatch(login(JSON.parse(user)));
    };
    myFunc();
  }, []);

  //automatic logout user when token is invalid
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      const res = error.response;
      //Checking token is expire or not if token expire return automatic logout and return login page
      if (res?.data?.message?.includes("invalid token") || res.status == 401) {
        return new Promise((response, reject) => {
          axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/logout`)
            .then(({ data }) => {
              store.dispatch(login(data));
              localStorage.clear();
              router.push("/login");
            })
            .catch((err) => {
              console.log(err);
              reject(error);
            });
        });
      }
      return Promise.reject(error);
    }
  );

  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;

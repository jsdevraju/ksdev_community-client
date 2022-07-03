import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import {Loader} from "../Loader/Loader";

const Privet = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      setLoading(false);
    } else if (!user?.token) {
      dispatch(login(user));
      router.push("/login");
    }
  }, []);
  return <>{loading ? <Loader /> : children}</>;
};

export default Privet;
import styles from "../styles/Login.module.css";
import { Input } from "../app/components/Input/Input";
import { Button } from "../app/components/Button/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader } from '../app/components/Loader/Loader'
import { useDispatch, useSelector } from "react-redux";
import { login } from "../app/redux/authSlice";
import { useEffect } from "react";
import Meta from '../app/components/Meta/Meta'


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() =>{
    if(token) router.push('/dashboard')
  }, [token])

  //When User Try to login fire this function
  const handleLogin = async (e) =>{
    e.preventDefault();
    if(!email || !password) return toast.error("All fields are require");
    if(password.length < 8) return toast.error("Password must be 8 characters");
    setLoading(true)
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        email,
        password
      });
      setLoading(false)
      toast.success("Login Successfully")
      dispatch(login(data));
      localStorage.setItem("user", JSON.stringify(data))
      router.push('/dashboard')
    } catch (error) {
      setLoading(false)
      if(error?.response?.data?.message) return toast.error(error?.response.data?.message);
      else return toast.error('Invalid Email')
    }
  }

  if(loading) return <Loader />

  return (
    <>
    <Meta title={"Ksdev community - Login"} />
      <section className={styles.login}>
        <div className={styles.loginBox}>
          <div className={styles.wrapper}>
            <h1 className="title">Welcome Back</h1>
            <p className="smText">Lorem ipsum dolor sit amet.</p>
            <form className={styles.form} onSubmit={handleLogin}>
              <div className={styles.formControl}>
                <label htmlFor="email">Email Or Phone Number</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                />
              </div>
              <div className={styles.formControl}>
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <Button
                type="submit"
                className="app_btn"
                style={{
                  width: "100%",
                }}
              >
                Login
              </Button>
            </form>
            <div className={styles.footer}>
              <p>Need Account ? <span onClick={() => router.push("/register")}>Register</span></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;

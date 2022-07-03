import styles from "../styles/Login.module.css";
import { Input } from "../app/components/Input/Input";
import { Button } from "../app/components/Button/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Loader } from '../app/components/Loader/Loader'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { login } from "../app/redux/authSlice";
import { useEffect } from "react";
import Meta from "../app/components/Meta/Meta";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { token }  = useSelector((state) => state.auth);


  useEffect(() =>{
    if(token) router.push('/dashboard')
  }, [token])

  //When User Try to login fire this function
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !username)
      return toast.error("All fields are require");
    if (password.length < 8)
      return toast.error("Password must be 8 characters");
    if (username.length < 3 || username.length > 12)
      return toast.error("username at least 3 charts and large then 12");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          username,
          email,
          password,
        }
      );
      setLoading(false);
      dispatch(login(data));
      toast.success("Login Successfully")
      localStorage.setItem("user", JSON.stringify(data));
      router.push('/dashboard')
    } catch (error) {
      setLoading(false);
      console.log(error)
      if (error?.response?.data?.message)
        return toast.error(error?.response.data?.message);
        else return toast.error("Invalid Email");
    }
  };

  if (loading) return <Loader />;

  return (
    <>
    <Meta title={"Ksdev community - Register"} />
      <section className={styles.login}>
        <div className={styles.loginBox}>
          <div className={styles.wrapper}>
            <h1 className="title">Create An Account</h1>
            <form className={styles.form} onSubmit={handleRegister}>
              <div className={styles.formControl}>
                <label htmlFor="username">Username</label>
                <Input
                  type="username"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>
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
              <p
                className={styles.forgot}
                onClick={() => router.push("/login")}
              >
                Already have an account?
              </p>
              <Button
                type="submit"
                className="app_btn"
                style={{
                  width: "100%",
                }}
              >
                Register
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;

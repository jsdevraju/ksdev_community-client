import { Bars } from "react-loader-spinner";

export const Loader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Bars
      heigth="50"
      width="50"
      color="#5865f2"
      ariaLabel="loading-indicator"
    />
  </div>
);

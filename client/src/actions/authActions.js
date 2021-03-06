import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";
// Register actionCreator
export const registerUser = (userData, history) => dispatch => {
  // 返回的 Action 会由 Redux 自动发出
  axios
    .post("/api/users/register", userData)
    .then(res => console.log(res.data))
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login -获取用户token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // 保存到localstorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      //set token to auth header
      setAuthToken(token);
      // decode token to get user data
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//设置当前用户
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// logout
export const logoutUser = () => dispatch => {
  //移除token
  localStorage.removeItem("jwtToken");
  //移除auth header
  setAuthToken(false);
  //设置currentuser为{} isAuthenticated false  回到初始state
  dispatch(setCurrentUser({}));
};

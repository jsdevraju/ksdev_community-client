import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token:"",
    user:""
}

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        login:(state, {payload}) =>{
            return { ...state, token:payload?.token, user:payload?.user}
        }
    }
})

export const { login } = authSlice.actions;
export default authSlice.reducer;
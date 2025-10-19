import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../lib_api'
export const fetchMe = createAsyncThunk('auth/me', async()=>{ const {data}=await api.get('/auth/me'); return data.user })
export const login = createAsyncThunk('auth/login', async(payload,{rejectWithValue})=>{ try{ const {data}=await api.post('/auth/login', payload); return data.user }catch(e){ return rejectWithValue(e.response?.data?.message||'Login failed') } })
export const register = createAsyncThunk('auth/register', async(payload,{rejectWithValue})=>{ try{ const {data}=await api.post('/auth/register', payload); return data.message }catch(e){ return rejectWithValue(e.response?.data?.message||'Register failed') } })
export const logout = createAsyncThunk('auth/logout', async()=>{ await api.post('/auth/logout'); return null })
const slice = createSlice({ name:'auth', initialState:{ user:null, status:'idle', error:null }, reducers:{}, extraReducers: b=>{ b.addCase(fetchMe.fulfilled,(s,a)=>{s.user=a.payload}).addCase(login.fulfilled,(s,a)=>{s.user=a.payload;s.error=null}).addCase(login.rejected,(s,a)=>{s.error=a.payload}).addCase(register.fulfilled,()=>{}).addCase(logout.fulfilled,(s)=>{s.user=null}) } })
export default slice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../lib_api'
export const fetchProducts = createAsyncThunk('products/list', async()=>{ const {data}=await api.get('/products'); return data })
export const fetchProduct = createAsyncThunk('products/item', async(id)=>{ const {data}=await api.get(`/products/${id}`); return data })
const slice = createSlice({ name:'products', initialState:{ list:[], current:null }, reducers:{}, extraReducers:b=>{ b.addCase(fetchProducts.fulfilled,(s,a)=>{s.list=a.payload}).addCase(fetchProduct.fulfilled,(s,a)=>{s.current=a.payload}) } })
export default slice.reducer

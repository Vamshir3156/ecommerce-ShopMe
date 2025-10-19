import { createSlice } from '@reduxjs/toolkit'
const slice = createSlice({ name:'cart', initialState:{ items:[] }, reducers:{ addToCart:(s,{payload})=>{ const idx=s.items.findIndex(i=>i.id===payload.id); if(idx>=0) s.items[idx].qty += payload.qty||1; else s.items.push({ ...payload, qty: payload.qty||1 }) }, removeFromCart:(s,{payload})=>{ s.items=s.items.filter(i=>i.id!==payload) }, updateQty:(s,{payload})=>{ const it=s.items.find(i=>i.id===payload.id); if(it) it.qty=payload.qty }, clearCart:(s)=>{ s.items=[] } } })
export const { addToCart, removeFromCart, updateQty, clearCart } = slice.actions
export default slice.reducer

import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import cartReducer from './slices/cartSlice.js'
import productReducer from './slices/productSlice.js'
export default configureStore({ reducer:{ auth:authReducer, cart:cartReducer, products:productReducer } })

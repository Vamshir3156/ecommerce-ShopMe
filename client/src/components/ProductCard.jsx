import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
export default function ProductCard({p}){ const d=useDispatch(); return (<div className='card group'><Link to={`/product/${p.id}`}><img src={p.image} alt={p.title} className='w-full h-48 object-cover rounded-md'/><div className='mt-3'><h3 className='font-semibold group-hover:underline'>{p.title}</h3><p className='text-sm text-gray-500'>{p.category} · ⭐ {p.rating}</p><p className='text-lg font-bold mt-1'>${p.price.toFixed(2)}</p></div></Link><button className='btn btn-primary w-full mt-4' onClick={()=>d(addToCart({id:p.id,title:p.title,price:p.price}))}>Add to cart</button></div>) }

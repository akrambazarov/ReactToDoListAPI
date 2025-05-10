import React from 'react'
import Edit from '../Icons/edit'
import Delete from '../Icons/delete'
import Button from './button'

const Cart = ({title, desc, statUser, status, onStatusChange, onDelete,onEdit}) => {
  return (
    <div className="bg-[#fff9e0] p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{desc}</p>
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <Button 
          icon={<Edit/>} 
          className=""
          onClick={onEdit}/>
          <Button 
            icon={<Delete/>} 
            className="hover:text-red-500 transition-colors"
            onClick={onDelete}
          />
        </div>
        <div className="flex items-center">
          <span className={`mr-2 ${statUser === 'Done' ? 'text-red-500' : ''}`}>
            {statUser}
          </span>
          <input 
            type="checkbox" 
            checked={status} 
            onChange={onStatusChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
          />
        </div>
      </div>
    </div>
  )
}

export default Cart
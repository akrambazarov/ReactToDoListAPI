import { use, useEffect, useState } from 'react'
import { Formik, validateYupSchema } from 'formik';
import * as Yup from 'yup';
import './App.css'
import Plus from './assets/Icons/plus';
import Button from './assets/components/button';
import Cart from './assets/components/cart';
import Close from './assets/Icons/close';
import axios from 'axios';
function App() {
const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
const [editDesc, setEditDesc] = useState('');
  const [hideShowTask,setHideShowTask] = useState(false);
  const [EditModal,setEditModal] = useState(false);
  const [idx, setIdx] = useState(null);
function OpenModal() {setOpen(!open);}
function CloseModal(){setOpen(false);}
const API = 'https://67bebb90b2320ee0501120c8.mockapi.io/api/v1/users';
// getData Получение Данных Task
useEffect(() => {
  async function getData() {
  try {
    let response = await axios.get(API);
    setData(response.data);
  } catch (error) {
    console.error(error);
  }
}
getData();
},[]);
async function AddUser(values) {
  const newData = {
    id: new Date().getTime(),
    name: values.name,
    email: values.email,
    bool: false
  };
  try {
    await axios.post(API,newData);
  } catch (error) {
    console.error('Ошибка:', error);
  }

   setData(data.concat(newData));
  CloseModal();
}

const handleStatusChange = async (id) => {
try {
  let statusUpdate = data.find(e => e.id === id);
  let statusResult = {...statusUpdate,bool:!statusUpdate.bool}
  await axios.put(`${API}/${id}`,statusResult);
  setData(prev => prev.map(e => e.id === id ? statusResult : e));

} catch (error) {
  console.error(error);
}
}

async function delUser(id){
  try {
    await axios.delete(`${API}/${id}`)
  } catch (error) {
    console.error(error);
  }
  setData(prev => prev.filter((e)=> e.id !== id))
}
function OpenEditUser(user){
let {name,email,id} = user;
  setEditTitle(name);
  setEditDesc(email);
  setEditModal(true);
  setIdx(id);
}

 async function editUser(values) {
    try {
      const updatedData = {
        name: values.name,
        email: values.email,
        bool: data.find(e => e.id === idx).bool
      };
      
      await axios.put(`${API}/${idx}`, updatedData);
      
      setData(prev => 
        prev.map(task => 
          task.id === idx ? { ...task, ...updatedData } : task
        )
      );
      
      CloseEditModal();
    } catch (error) {
      console.error('Ошибка при редактировании:', error);
    }
  }

function CloseEditModal(){setEditModal(false)}

function filteredTasks(){
  
  if(hideShowTask){
    return data.filter(task=>!task.bool);
  }
  else{ return data}
}

  return (
    <div className="container mx-auto px-12 py-8 max-md:p-4 max-w-7xl">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-gray-500">TODO</h1>
        <Button
          icon={<Plus/>} 
          className=" text-black hover:text-gray-900 transition-colors"
          onClick={OpenModal} 
        />
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 ">
          <div className="grid max-md:grid-cols-2 max-md:gap-2">
            <div className="flex items-center space-x-4 py-3 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
              <div className="w-6 h-6 rounded-full bg-[#c4b5fd]"></div>
              <span className="text-xl">work</span>
            </div>
            <div className="flex items-center space-x-4 py-3 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
              <div className="w-6 h-6 rounded-full bg-[#67e8f9]"></div>
              <span className="text-xl">study</span>
            </div>
            <div className="flex items-center space-x-4 py-3 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
              <div className="w-6 h-6 rounded-full bg-[#fda4af]"></div>
              <span className="text-xl">entertainment</span>
            </div>
            <div className="flex items-center space-x-4 py-3 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
              <div className="w-6 h-6 rounded-full bg-[#86efac]"></div>
              <span className="text-xl">family</span>
            </div>
          </div>
          
          <div className="mt-10 flex items-center">
            <input 
            type="checkbox"
            id="hide-done"
            checked={hideShowTask}
            onChange={()=> setHideShowTask(!hideShowTask)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="hide-done" className="ml-2 text-lg text-gray-600">Hide done task</label>
          </div>
        </aside>

        <main className="flex-1 max-h-[520px] overflow-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {filteredTasks().map((e)=>(
            <Cart
            key={e.id} 
            title={e.name} 
            desc={e.email} 
            statUser={e.bool ?'Done':'Pending'}
            onDelete={() => delUser(e.id)}
            onEdit= {()=>OpenEditUser(e)}
            onStatusChange={() => handleStatusChange(e.id)}
            
            status = {e.bool} />

          ))}
        </main>
      </div>
      <div>

   </div>
        {open === true ? (
        <div className='bg-white max-md:w-full max-md:h-[100vh] flex items-center justify-center text-black shadow-2xl fixed top-[50%] left-[50%] mr-[-50%] translate-x-[-50%] translate-y-[-50%]'>
          <div className="flex flex-col w-[600px]">
          <header className='flex items-center justify-between w-full p-8'>
          <h2 className='text-2xl uppercase font-semibold'>Task</h2>
          <Button 
          icon={<Close/>}
          className=""
          onClick={CloseModal} />
          </header>
          <section className='flex flex-col px-8 gap-2 text-left'>
            <h4 className='text-xl'>Title</h4>
            <Formik
            initialValues={{ name: '', email: '' }}
            validationSchema={ Yup.object({
              name: Yup.string()
                .min(3, 'Минимум 3 символов')
                .required('Обязательное поле'),
              email: Yup.string()
                .min(10, 'Минимум 10 символов')
                .max(25,'Максимум 25 символов')
                .required('Описание обязательно'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
              AddUser(values)
                setSubmitting(false);
              }, 400);
            }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
            <form onSubmit={handleSubmit}>
              <input
                name='name'
                type="text"
                placeholder='Enter Your Title'
                className='p-2 w-full border-gray-400 rounded-md outline-none border-1 placeholder:text-black appearance-none'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                
              />
              {errors.name && touched.name && <div className='text-red-500'>{errors.name}</div>}
              <h4 className='text-xl my-4'>Email</h4>
<input
  name="email"
  onChange={handleChange}
  onBlur={handleBlur}
  value={values.email}
  placeholder="Email..."
  className='p-2 w-full border-gray-400 rounded-md outline-none border-1 placeholder:text-black appearance-none'
/>
{errors.email && touched.email && <div className='text-blue-500'>{errors.email}</div>}
<footer className='flex gap-4 my-8'>
<button type='submit' disabled={isSubmitting} className=' bg-blue-500 text-white rounded-md py-2 px-4 uppercase'>Save</button>
<button onClick={CloseModal} className=' border-blue-500 border-1 text-blue-500 rounded-md py-2 px-4 uppercase'>Cancel</button>
</footer>
            </form>
  )}
            </Formik>
            
          </section>

          
          </div>
        </div>
      ) : null}
        {EditModal === true ?(
               <div className='bg-white max-md:w-full max-md:h-[100vh] flex items-center justify-center text-black shadow-2xl fixed top-[50%] left-[50%] mr-[-50%] translate-x-[-50%] translate-y-[-50%]'>
               <div className="flex flex-col w-[600px]">
               <header className='flex items-center justify-between w-full p-8'>
               <h2 className='text-2xl uppercase font-semibold'>Edit Task</h2>
               <Button 
               icon={<Close/>}
               className=""
               onClick={CloseEditModal} />
               </header>
               <section className='flex flex-col px-8 gap-2 text-left'>
                 <h4 className='text-xl'> Edit Title</h4>

            <Formik
            initialValues={{ name: '', email: '' }}
            validationSchema={ Yup.object({
              name: Yup.string()
                .min(3, 'Минимум 3 символов')
                .required('Обязательное поле'),
              email: Yup.string()
                .min(10, 'Минимум 10 символов')
                .max(25,'Максимум 25 символов')
                .required('Описание обязательно'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
              editUser(values)
                setSubmitting(false);
              }, 400);
            }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
            <form onSubmit={handleSubmit}>
              <input
                name='name'
                type="text"
                placeholder='Enter Your Title'
                className='p-2 w-full border-gray-400 rounded-md outline-none border-1 placeholder:text-black appearance-none'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                
              />
              {errors.name && touched.name && <div className='text-red-500'>{errors.name}</div>}
              <h4 className='text-xl my-4'>Email</h4>
              <input
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Email..."
                className='p-2 w-full border-gray-400 rounded-md outline-none border-1 placeholder:text-black appearance-none'
              />
              {errors.email && touched.email && <div className='text-blue-500'>{errors.email}</div>}
              <footer className='flex gap-4 my-8'>
              <button type='submit' disabled={isSubmitting} className=' bg-blue-500 text-white rounded-md py-2 px-4 uppercase'>Save</button>
              <button onClick={CloseEditModal} className=' border-blue-500 border-1 text-blue-500 rounded-md py-2 px-4 uppercase'>Cancel</button>
              </footer>
             </form>
                )}
            </Formik>
               </section>
               
               </div>
             </div>
        ):null}
    </div>
  )
}

export default App

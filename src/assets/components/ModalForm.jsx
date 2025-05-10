import { Formik } from 'formik';
import * as Yup from 'yup';
import Close from '../Icons/close';
import Button from './button';

function ModalForm({ title, onClose, onSubmit, initialValues = { name: '', email: '' } }) {
  return (
    <div className='bg-white fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-2xl p-6 w-[600px]'>
      <header className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold uppercase'>{title}</h2>
        <Button icon={<Close />} onClick={onClose} />
      </header>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={Yup.object({
          name: Yup.string()
            .min(3, 'Минимум 3 символов')
            .required('Обязательное поле'),
          email: Yup.string()
            .min(10, 'Минимум 10 символов')
            .max(25, 'Максимум 25 символов')
            .required('Обязательное поле'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            onSubmit(values);
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
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
              name='name'
              type='text'
              placeholder='Enter Your Title'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              className='p-2 border-gray-400 rounded-md outline-none placeholder:text-black border'
            />
            {errors.name && touched.name && (
              <div className='text-red-500'>{errors.name}</div>
            )}

            <input
              name='email'
              type='text'
              placeholder='Email...'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              className='p-2 border-gray-400 rounded-md outline-none placeholder:text-black border'
            />
            {errors.email && touched.email && (
              <div className='text-blue-500'>{errors.email}</div>
            )}

            <footer className='flex gap-4 mt-4'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-blue-500 text-white rounded-md py-2 px-4 uppercase'
              >
                Save
              </button>
              <button
                type='button'
                onClick={onClose}
                className='border border-blue-500 text-blue-500 rounded-md py-2 px-4 uppercase'
              >
                Cancel
              </button>
            </footer>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default ModalForm;

import React from 'react';
import WishForm from '../WishForm';

const initialValues = {
  name: '',
  picture: '',
  priceFrom: 0,
  priceTo: 0,
};

const WishCreate = ({ onSubmit }) => {
  const [values, setValues] = React.useState(initialValues);
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <WishForm
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(values)
            .then(() => {
              setValues(initialValues);
            })
            .catch(console.log);
        }}
        handleChange={handleChange}
        values={values}
      />
    </div>
  );
};

export default WishCreate;

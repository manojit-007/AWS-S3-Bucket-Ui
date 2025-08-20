import React from 'react';
import './loader.css'; 

const Loader = () => {
  return (
    <section className="flex justify-center items-center min-h-[100vh]">
      <span className="loader relative w-20 h-20 rounded-full" >
        {/* <p className='-rotate-45 m-3.5'>Ok</p> */}
        </span>
    </section>
  );
};

export default Loader;

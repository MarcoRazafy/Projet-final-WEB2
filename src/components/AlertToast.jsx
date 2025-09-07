import React from "react";

const AlertToast = ({ message }) => (
  <div className="p-4 mb-4 bg-red-100 text-red-800 rounded shadow">
    {message}
  </div>
);

export default AlertToast;

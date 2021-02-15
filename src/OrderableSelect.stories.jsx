// https://react-select.com/advanced#sortable-multiselect

import React, { useState } from "react";

import OrderableSelect from "./OrderableSelect";
import { colourOptions } from './docs/data';

function OrderableSelectApp() {
  const [selected, setSelected] = useState([
    colourOptions[4],
    colourOptions[5],
  ]);

  const onChange = selectedOptions => setSelected(selectedOptions);

  return (
    <OrderableSelect options={colourOptions} value={selected} onChange={onChange} />
  );
}

export default OrderableSelectApp;
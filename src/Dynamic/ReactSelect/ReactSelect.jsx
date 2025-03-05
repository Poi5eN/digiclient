import React, { useState } from "react";
import { Select, Option } from "@material-tailwind/react";

export function ReactSelect({ label, dynamicOptions, value, handleChange, name }) {

  const handleSelectChange = (selectedValue) => {
    // Create a synthetic event object that mimics a standard HTML select event
    const event = {
      target: {
        name: name, // Use the name prop passed to the component
        value: selectedValue, // The selected value from the Select component
      },
    };

    handleChange(event); // Call the parent's handleChange function with the synthetic event
  };

  return (
    <div
    //  className="w-72 "
     className="md:w-60"
     >
      <Select
        label={label}
        value={value}
        name={name}
        onChange={handleSelectChange}
      >
        {dynamicOptions?.map((option, index) => (
          <Option key={index} value={option?.value}>
            {option?.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}


// import React, { useState } from "react";
// import { Select, Option } from "@material-tailwind/react";

// export function ReactSelect({ label, dynamicOptions,value,handleChange,name }) {
  

//   return (
//     <div className="w-72 ">
//       <Select
//         label={label}
//         value={value}
//         name={name}
//         // value={selectedValue}
//         onChange={handleChange}
//         // onChange={(value) => setSelectedValue(value)}
//       >
//         {dynamicOptions?.map((option, index) => (
//           <Option key={index} value={option?.value}>
//             {option?.label}
//           </Option>
//         ))}
//       </Select>
//     </div>
//   );
// }

// import { Select, Option } from "@material-tailwind/react";

// export function ReactSelect({ label, options }) {
//   return (
//     // <div className="w-72 my-4">
//     //   <Select label={label}>
//     //     {options.map((option, index) => (
//     //       <Option key={index}
//     //       value={option.value}
//     //       >{option.label}</Option>
//     //     ))}
//     //   </Select>
//     // </div>
//     <div className="w-72 my-4">
//     <Select label={label}>
//       {options.map((option, index) => (
//         <Option key={index}>{option.label}</Option>
//       ))}
//     </Select>
//   </div>
//   );
// }


// import { Select, Option } from "@material-tailwind/react";
 
// export function ReactSelect() {
//   return (
//     <div className="w-72">
//       <Select label="Select Version">
//         <Option>Material Tailwind HTML</Option>
//         <Option>Material Tailwind React</Option>
//         <Option>Material Tailwind Vue</Option>
//         <Option>Material Tailwind Angular</Option>
//         <Option>Material Tailwind Svelte</Option>
//       </Select>
//     </div>
//   );
// }
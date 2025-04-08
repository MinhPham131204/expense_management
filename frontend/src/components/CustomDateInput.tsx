import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDateInput = ({ selected, onChange, placeholder }: { selected: Date | null; onChange: (date: Date | null) => void; placeholder: string }) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-700 text-black"
      placeholderText={placeholder}
      dateFormat="dd/MM/yyyy"
    />
  );
};

export default CustomDateInput;

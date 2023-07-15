import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface IFilter {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
  options: string[];
  label: string;
}

export default function Filter({ data, setData, options, label }: IFilter) {
  React.useEffect(() => {
    setData(options[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setData(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select value={data} label={label} onChange={handleChange}>
          <MenuItem value="all">
            <em>All</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem value={option} key={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

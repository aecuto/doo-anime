import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import { memo } from "react";

interface ISearchField {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
}

const SearchField = memo(({ data, setData }: ISearchField) => {
  return (
    <Box sx={{ pb: 3 }}>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        fullWidth
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
    </Box>
  );
});

SearchField.displayName = "SearchField";

export default SearchField;

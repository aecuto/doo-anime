import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";

interface ISearchField {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
}

const SearchField = ({ data, setData }: ISearchField) => {
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
};

export default SearchField;

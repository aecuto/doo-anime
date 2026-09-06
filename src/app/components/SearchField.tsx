import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { memo } from "react";

interface ISearchField {
  data: string;
  setData: (value: string) => void;
}

const SearchField = memo(({ data, setData }: ISearchField) => {
  return (
    <TextField
      label="Search"
      variant="outlined"
      fullWidth
      value={data}
      onChange={(e) => setData(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: data ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="Clear search"
                size="small"
                onClick={() => setData("")}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
});

SearchField.displayName = "SearchField";

export default SearchField;

"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppStore } from "../store";
import SearchField from "./SearchField";
import List from "./List";
import { DialogForm } from "./DialogForm";

export const Dashboard = () => {
  const search = useAppStore((s) => s.search);
  const setSearch = useAppStore((s) => s.setSearch);
  const setOpenDialog = useAppStore((s) => s.setOpenDialog);

  return (
    <Box sx={{ p: { xs: 2, sm: 5 } }}>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mr: "auto" }}>
            Doo Anime
          </Typography>

          <Box sx={{ width: { xs: "100%", sm: 320 } }}>
            <SearchField data={search} setData={setSearch} />
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog("create")}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Add Anime
          </Button>
        </Box>

        <List />
        <DialogForm />
      </Container>
    </Box>
  );
};

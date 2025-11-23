"use client";

import { Box, Button, Container, Grid } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../App";
import SearchField from "./SearchField";
import List from "./List";
import { DialogForm } from "./DialogForm";

export const Main = () => {
  const { search, setSearch, setOpenDialog } = useContext(AppContext);

  return (
    <Box sx={{ p: 5 }}>
      <Container>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={12}>
            <Button variant="contained" onClick={() => setOpenDialog("create")}>
              Add Anime
            </Button>
          </Grid>
          <Grid size={12}>
            <SearchField data={search} setData={setSearch} />
          </Grid>
        </Grid>

        <List />
        <DialogForm />
      </Container>
    </Box>
  );
};

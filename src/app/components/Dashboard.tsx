"use client";

import * as React from "react";
import { Box, Container, Typography } from "@mui/material";
import { useAppStore } from "../store";
import SearchField from "./SearchField";
import List from "./List";
import { DialogForm } from "./DialogForm";
import { UserMenu } from "./UserMenu";

export const Dashboard = () => {
  const search = useAppStore((s) => s.search);
  const setSearch = useAppStore((s) => s.setSearch);

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

          <UserMenu />
        </Box>

        <List />
        <DialogForm />
      </Container>
    </Box>
  );
};

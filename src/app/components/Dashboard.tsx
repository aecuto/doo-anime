"use client";

import { Box, Button, Container, Grid } from "@mui/material";
import { useAppStore } from "../store";
import SearchField from "./SearchField";
import List from "./List";
import { DialogForm } from "./DialogForm";
import { authClient } from "@/lib/auth-client";

function AuthUI() {
  const { data: session } = authClient.useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.name} <br />
        <button onClick={() => authClient.signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button
        onClick={() =>
          authClient.signIn.social({
            provider: "myanimelist",
            callbackURL: "/",
          })
        }
      >
        Sign in
      </button>
    </>
  );
}

export const Dashboard = () => {
  const search = useAppStore((s) => s.search);
  const setSearch = useAppStore((s) => s.setSearch);
  const setOpenDialog = useAppStore((s) => s.setOpenDialog);

  return (
    <Box sx={{ p: { xs: 2, sm: 5 } }}>
      <Container>
        {/* <AuthUI /> */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={12}>
            <Button
              variant="contained"
              onClick={() => setOpenDialog("create")}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
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

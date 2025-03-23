import * as React from 'react';
import { mutate } from 'swr';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Grid } from '@mui/material';

// Icon for Add Customer button
import { AddRounded } from '@mui/icons-material';

import { Customer } from "../pages/index";

export default function AddUserDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen} endIcon={<AddRounded />}>
        Add Customer
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const customer: Customer = {
              firstName: data.get("first") as string,
              lastName: data.get("last") as string,
              email: data.get("email") as string,
              businessName: data.get("business") as string || undefined,
            };
            console.log(customer);

            try {
              const response = await fetch("/api/customers", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(customer),
              });

              if (response.ok) {
                mutate('/api/customers');
                handleClose();
              }
            } catch (error) {
              console.error("Error:", error);
            }
          },
        }}
      >
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={4}>
              <TextField label="First Name" name="first" type="text" fullWidth required />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Last Name" name="last" type="text" fullWidth required />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Business Name" name="business" type="text" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email Address" name="email" type="email" fullWidth required />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Divider,
  useTheme,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import { GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { toast } from "react-toastify";


const LoginRequiredDialog = ({
  open,
  onClose,
  message = "You must be logged in to perform this action.",
}) => {
  const { handleGoogleLogin } = useContext(AuthContext);
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          py: 2,
        }}
      >
        <DialogTitle sx={{ textAlign: "center", m: 0, fontSize: "1.5rem" }}>
          Authentication Required
        </DialogTitle>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#fff",
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ textAlign: "center", pt: 3, px: 4, pb: 6 }}>
        <Typography variant="body1" gutterBottom>
          {message}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <GoogleLogin
            onSuccess={(res) => {
              handleGoogleLogin(res, { redirect: false });
              onClose();
              toast.success("User is connected!");
            }}
            onError={() => console.log("Login Failed")}
            render={({ onClick }) => (
              <Box
                onClick={onClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.grey[300]}`,
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: theme.palette.grey[100],
                  },
                }}
              >
                <GoogleIcon sx={{ mr: 1, color: "#DB4437" }} />
                <Typography variant="button" sx={{ fontWeight: 500 }}>
                  Continue with Google
                </Typography>
              </Box>
            )}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredDialog;

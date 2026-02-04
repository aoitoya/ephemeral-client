import { Box, Modal, IconButton } from "@mui/joy";
import { Close as CloseIcon } from "@mui/icons-material";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";


interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode: "login" | "signup";
}


export function AuthModal({
  open,
  onClose,
  mode: currentMode,
}: AuthModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="auth-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 450,
          bgcolor: "background.surface",
          borderRadius: "lg",
          p: 4,
          boxShadow: "lg",
          position: "relative",
          border: "1px solid rgba(102, 126, 234, 0.1)",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ mt: 2 }}>
          {currentMode === "login" ? (
            <LoginForm />
          ) : (
            <SignupForm />
          )}
        </Box>
      </Box>
    </Modal>
  );
}

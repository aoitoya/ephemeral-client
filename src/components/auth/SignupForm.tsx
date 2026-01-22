import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@mui/joy";
import { useRegister } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

interface SignupFormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .required("Username is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const { mutateAsync: register } = useRegister();
  const navigate = useNavigate();

  const initialValues: SignupFormValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: SignupFormValues) => {
    await register(values);
    navigate({ to: "/feed" });
  };

  return (
    <Box>
      <Typography
        level="h3"
        sx={{ mb: 3, textAlign: "center", color: "#667eea" }}
      >
        Join Ephemeral
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={signupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <FormControl sx={{ mb: 2 }}>
              <FormLabel>Username</FormLabel>
              <Field
                as={Input}
                name="username"
                type="text"
                placeholder="Choose a username"
                error={touched.username && Boolean(errors.username)}
              />
              <ErrorMessage name="username">
                {(msg) => (
                  <Typography
                    sx={{ color: "red", fontSize: "0.8rem", mt: 0.5 }}
                  >
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
            </FormControl>

            <FormControl sx={{ mb: 2 }}>
              <FormLabel>Password</FormLabel>
              <Field
                as={Input}
                name="password"
                type="password"
                placeholder="Create a password"
                error={touched.password && Boolean(errors.password)}
              />
              <ErrorMessage name="password">
                {(msg) => (
                  <Typography
                    sx={{ color: "red", fontSize: "0.8rem", mt: 0.5 }}
                  >
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
            </FormControl>

            <FormControl sx={{ mb: 3 }}>
              <FormLabel>Confirm Password</FormLabel>
              <Field
                as={Input}
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
              />
              <ErrorMessage name="confirmPassword">
                {(msg) => (
                  <Typography
                    sx={{ color: "red", fontSize: "0.8rem", mt: 0.5 }}
                  >
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                },
                mb: 2,
              }}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          </Form>
        )}
      </Formik>

      <Typography sx={{ textAlign: "center", fontSize: "sm" }}>
        Already have an account?{" "}
        <Button
          variant="plain"
          onClick={onSwitchToLogin}
          sx={{ fontSize: "sm", color: "#667eea" }}
        >
          Sign In
        </Button>
      </Typography>
    </Box>
  );
}

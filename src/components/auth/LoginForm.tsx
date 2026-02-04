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
import { useLogin } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

interface LoginFormValues {
  username: string;
  password: string;
}



const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export function LoginForm() {
  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();

  const initialValues: LoginFormValues = {
    username: "",
    password: "",
  };

  const handleSubmit = async (values: LoginFormValues) => {
    await login(values);
    navigate({ to: "/feed" });
  };

  return (
    <Box>
      <Typography level="h3" sx={{ mb: 3, textAlign: "center", color: "text.primary" }}>
        Welcome Back
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <FormControl sx={{ mb: 2 }}>
              <FormLabel>Username</FormLabel>
              <Field
                as={Input}
                name="username"
                placeholder="Enter your username"
                error={touched.username && Boolean(errors.username)}
              />
              <ErrorMessage name="email">
                {(msg) => (
                  <Typography
                    sx={{ color: "danger.500", fontSize: "0.8rem", mt: 0.5 }}
                  >
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
            </FormControl>

            <FormControl sx={{ mb: 3 }}>
              <FormLabel>Password</FormLabel>
              <Field
                as={Input}
                name="password"
                type="password"
                placeholder="Enter your password"
                error={touched.password && Boolean(errors.password)}
              />
              <ErrorMessage name="password">
                {(msg) => (
                  <Typography
                    sx={{ color: "danger.500", fontSize: "0.8rem", mt: 0.5 }}
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
                bgcolor: "primary.solidBg",
                borderRadius: "md",
                "&:hover": {
                  bgcolor: "primary.solidHoverBg",
                },
                mb: 2,
              }}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </Form>
        )}
      </Formik>


    </Box>
  );
}

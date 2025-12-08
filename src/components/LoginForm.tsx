import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@mui/joy";
import { IoMdEye } from "react-icons/io";
import { MdMail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLogin } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

export function LoginForm() {
  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();

  const formik = useFormik<{ username: string; password: string }>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await login(values);
        navigate({ to: "/feed" });
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  });

  return (
    <div className="form_box">
      <DotLottieReact
        src="https://lottie.host/8177cc18-7cbf-4f8a-8101-64469f204544/oqpH3R4wun.lottie"
        loop
        autoplay
      />
      <Box component="form" onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            variant="soft"
            type="text"
            startDecorator={<MdMail />}
            {...formik.getFieldProps("username")}
          />
          <FormHelperText>{formik.errors.username}</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            variant="soft"
            type="password"
            startDecorator={<FaLock />}
            endDecorator={<IoMdEye />}
            {...formik.getFieldProps("password")}
          />
          <FormHelperText>{formik.errors.password}</FormHelperText>
        </FormControl>
        <Button
          loading={formik.isSubmitting}
          fullWidth
          variant="soft"
          color="success"
          type="submit"
        >
          Summit
        </Button>
      </Box>
    </div>
  );
}

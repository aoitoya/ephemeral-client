import { useFormik } from "formik";
import * as Yup from "yup";
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
import { useRegister } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

export function SignupForm() {
  const { mutateAsync: register } = useRegister();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), ""], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      await register(values);
      navigate({ to: "/feed" });
    },
  });

  return (
    <div className="form_box">
      <Box component="form" onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            variant="soft"
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
        <FormControl>
          <FormLabel>Confrom Password</FormLabel>
          <Input
            variant="soft"
            type="password"
            startDecorator={<FaLock />}
            endDecorator={<IoMdEye />}
            {...formik.getFieldProps("confirmPassword")}
          />
          <FormHelperText>{formik.errors.confirmPassword}</FormHelperText>
        </FormControl>
        <Button
          loading={formik.isSubmitting}
          sx={{ marginTop: "1rem" }}
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

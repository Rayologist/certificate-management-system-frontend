import { Form, Formik, FormikHelpers } from "formik";
import FormikController from "@components/Formik/FormikController";
import { ControllerProps } from "types";
import { Button, Grid, Notification } from "@mantine/core";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { sendCert } from "@services/sendCert";
import { useState } from "react";

function CertificateForm({
  certificateId,
  activityUid,
  pushUrl,
}: {
  certificateId: number;
  activityUid: string;
  pushUrl: string;
}) {
  const router = useRouter();
  const [notification, setNotification] = useState(false);

  interface Values {
    name: string;
    email: string;
  }

  const initialValue: Values = {
    name: "",
    email: "",
  };

  const onSubmit = async (values: Values, actions: FormikHelpers<Values>) => {
    const [data, error] = await sendCert({ ...values, certificateId, activityUid });
    if (data.status === "failed") return setNotification(true);
    if (error) {
      router.push("/500", { pathname: router.asPath });
      return
    }
    router.push(pushUrl);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("必填"),
    email: Yup.string().email("格式錯誤").required("必填"),
  });

  const fields: ControllerProps[] = [
    {
      control: "text-input",
      name: "name",
      label: "名字",
      required: true,
    },
    {
      control: "text-input",
      type: "email",
      name: "email",
      label: "電子信箱",
      required: true,
    },
  ];

  return (
    <Formik
      initialValues={initialValue}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form>
          <Grid justify="center" gutter="xl">
            {fields.map((field, index) => {
              return (
                <Grid.Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  key={`${field.name}-${index}`}
                >
                  <FormikController {...field} />
                </Grid.Col>
              );
            })}
            {notification && (
              <Grid.Col xs={12} sm={12} md={12} lg={12}>
                <Notification
                  onClose={() => setNotification(false)}
                  icon={"!"}
                  color="red"
                >
                  名字或信箱錯誤，請洽工作人員。
                </Notification>
              </Grid.Col>
            )}
            <Grid.Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                type="submit"
                mt={10}
                loading={formik.isSubmitting}
                fullWidth
              >
                {formik.isSubmitting ? "正在送出..." : "送出"}
              </Button>
            </Grid.Col>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default CertificateForm;

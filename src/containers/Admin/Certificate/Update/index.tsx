import React, { Dispatch, SetStateAction } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import FormikController from "@components/Formik/FormikController";
import {
  Certificate,
  ControllerProps,
  CreateCertificateRequest,
  PickAsOrNull,
} from "types";
import { Button, Grid, Group } from "@mantine/core";
import * as Yup from "yup";
import TextareaSelectArray from "../Create/TextareaSelect";
import PreviewButton from "../Preview";
import { updateCertificate, useCertificate } from "@services/certificate";
import { useRouter } from "next/router";

export type Values = Omit<CreateCertificateRequest, "activityUid"> & {
  dummyName?: string;
};

export default function UpdateCertificate({
  setObjectURL,
  handleClose,
  certProps,
}: {
  setObjectURL: Dispatch<SetStateAction<string>>;
  handleClose: { (updated?: boolean): void };
  certProps: Omit<Certificate, "activityUid" | "filename" | "url">;
}) {
  const { mutate } = useCertificate();
  const router = useRouter()
  
  const { displayName, title, totalHour, dateString, id } = certProps;
  const initialValue: Values = {
    displayName,
    dummyName: "",
    title: title,
    totalHour,
    dateString,
  };

  const onSubmit = async (values: Values, actions: FormikHelpers<Values>) => {
    const { dummyName, ...rest } = values;
    const payload = { id, ...rest };
    const [_, error] = await updateCertificate(payload);
    if (error) {
      router.push("/500", { pathname: router.asPath });
      return
    }
    actions.setSubmitting(false);
    mutate();
    handleClose(true);
  };

  const validationSchema = Yup.object({
    displayName: Yup.string().required("必填"),
    title: Yup.array()
      .of(
        Yup.object({
          text: Yup.string().required("必填"),
          weight: Yup.string(),
        })
      )
      .required("必填")
      .min(1)
      .max(3),
    totalHour: Yup.number().required("必填").nullable(),
    dateString: Yup.string().required("必填"),
  });

  const fields: ControllerProps[] = [
    {
      control: "text-input",
      name: "totalHour",
      label: "總時數",
      type: "number",
      required: true,
    },
    {
      control: "text-input",
      name: "dateString",
      label: "日期樣式",
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
            <Grid.Col xs={10} sm={10} md={10} lg={10}>
              <FormikController
                {...{
                  control: "text-input",
                  name: "displayName",
                  label: "顯示名稱",
                  description: "顯示給使用者以及管理者的名稱。",
                  required: true,
                }}
              />
            </Grid.Col>
            <Grid.Col xs={10} sm={10} md={10} lg={10}>
              <FormikController
                {...{
                  control: "text-input",
                  name: "dummyName",
                  label: "測試姓名",
                  description: "測試姓名不會儲存，預覽時可見。",
                }}
              />
            </Grid.Col>

            <Grid.Col xs={10} sm={10} md={10} lg={10}>
              <TextareaSelectArray
                name="title"
                textareaProps={{
                  label: "證書文字",
                }}
                selectProps={{
                  label: "字體",
                  options: [
                    { label: "無", value: "" },
                    { label: "斜體", value: "italic" },
                    { label: "粗體", value: "bold" },
                  ],
                  allowDeselect: false,
                }}
              />
            </Grid.Col>

            {fields.map((field, index) => {
              return (
                <Grid.Col
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  key={`${field.name}-${index}`}
                >
                  <FormikController {...field} />
                </Grid.Col>
              );
            })}

            <Grid.Col xs={10} sm={10} md={10} lg={10}>
              <Group position="center">
                <PreviewButton setObjectURL={setObjectURL} variant="outline">
                  預覽
                </PreviewButton>
                <Button type="submit" loading={formik.isSubmitting}>
                  {formik.isSubmitting ? "建立中..." : "確認"}
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

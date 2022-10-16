import React, { Dispatch, SetStateAction } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { FormikController } from '@components/Form';
import { ControllerProps, CreateCertificateRequest } from 'types';
import { Button, Grid, Group } from '@mantine/core';
import { object, string, array, number } from 'yup';
import { createCertificate, useCertificate } from '@services/certificate';
import { useRouter } from 'next/router';
import TextareaSelectArray from './TextareaSelect';
import PreviewButton from '../Preview';
import { CertificateFormValues } from '../types';

export default function CreateCertificate({
  setObjectURL,
  handleClosed,
  activityUid,
}: {
  setObjectURL: Dispatch<SetStateAction<string>>;
  handleClosed: () => void;
  activityUid: string;
}) {
  const { mutate } = useCertificate();
  const router = useRouter();

  const initialValue: CertificateFormValues = {
    displayName: '',
    dummyName: '',
    title: [{ text: '', weight: '' }],
    totalHour: null,
    dateString: '',
  };

  const onSubmit = async (
    values: CertificateFormValues,
    actions: FormikHelpers<CertificateFormValues>
  ) => {
    const payload = {
      activityUid,
      ...values,
    } as CreateCertificateRequest;
    const [, error] = await createCertificate(payload);
    if (error) {
      router.push('/500', { pathname: router.asPath });
      return;
    }
    actions.setSubmitting(false);
    mutate();
    handleClosed();
  };

  const validationSchema = object({
    displayName: string().required('必填'),
    title: array()
      .of(
        object({
          text: string().required('必填'),
          weight: string(),
        })
      )
      .required('必填')
      .min(1)
      .max(3),
    totalHour: number().required('必填').nullable(),
    dateString: string().required('必填'),
  });

  const fields: ControllerProps[] = [
    {
      control: 'text-input',
      name: 'totalHour',
      label: '總時數',
      type: 'number',
      required: true,
    },
    {
      control: 'text-input',
      name: 'dateString',
      label: '日期樣式',
      required: true,
    },
  ];

  return (
    <Formik initialValues={initialValue} onSubmit={onSubmit} validationSchema={validationSchema}>
      {(formik) => (
        <Form>
          <Grid justify="center" gutter="xl">
            <Grid.Col xs={10} sm={10} md={10} lg={10}>
              <FormikController
                {...{
                  control: 'text-input',
                  name: 'displayName',
                  label: '顯示名稱',
                  description: '顯示給使用者以及管理者的名稱。',
                  required: true,
                }}
              />
            </Grid.Col>
            <Grid.Col xs={10} sm={10} md={10} lg={10}>
              <FormikController
                {...{
                  control: 'text-input',
                  name: 'dummyName',
                  label: '測試姓名',
                  description: '測試姓名不會儲存，預覽時可見。',
                }}
              />
            </Grid.Col>

            <Grid.Col xs={10} sm={10} md={10} lg={10}>
              <TextareaSelectArray
                name="title"
                textareaProps={{
                  label: '證書文字',
                }}
                selectProps={{
                  label: '字體',
                  options: [
                    { label: '無', value: '' },
                    { label: '斜體', value: 'italic' },
                    { label: '粗體', value: 'bold' },
                  ],
                  allowDeselect: false,
                }}
              />
            </Grid.Col>

            {fields.map((field, index) => (
              <Grid.Col xs={10} sm={10} md={10} lg={10} key={`${field.name}-${index}`}>
                <FormikController {...field} />
              </Grid.Col>
            ))}

            <Grid.Col xs={10} sm={10} md={10} lg={10}>
              <Group position="center">
                <PreviewButton setObjectURL={setObjectURL} variant="outline">
                  預覽
                </PreviewButton>
                <Button type="submit" loading={formik.isSubmitting}>
                  {formik.isSubmitting ? '建立中...' : '確認'}
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

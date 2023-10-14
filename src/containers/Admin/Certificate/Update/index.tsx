import React, { Dispatch, SetStateAction } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import FormikController from '@components/Form/FormikController';
import { Certificate, CreateCertificateRequest } from 'types';
import { Button, Grid, Group } from '@mantine/core';
import { object, string, array } from 'yup';
import { updateCertificate, useCertificate } from '@services/certificate';
import { useRouter } from 'next/router';
import TextareaSelectArray from '../Create/TextareaSelect';
import PreviewButton from '../Preview';

export type Values = Omit<CreateCertificateRequest, 'activityUid'> & {
  dummyName?: string;
};

export default function UpdateCertificate({
  setObjectURL,
  handleClose,
  certProps,
}: {
  setObjectURL: Dispatch<SetStateAction<string>>;
  handleClose: { (updated?: boolean): void };
  certProps: Omit<Certificate, 'activityUid' | 'filename' | 'url'>;
}) {
  const { mutate } = useCertificate();
  const router = useRouter();

  const { displayName, content, id, templateId } = certProps;
  const initialValue: Values = {
    templateId,
    displayName,
    dummyName: '',
    content,
  };

  const onSubmit = async (values: Values, actions: FormikHelpers<Values>) => {
    const { dummyName, ...rest } = values;
    const payload = { id, ...rest };
    const [, error] = await updateCertificate(payload);
    if (error) {
      router.push('/500', { pathname: router.asPath });
      return;
    }
    actions.setSubmitting(false);
    mutate();
    handleClose(true);
  };

  const validationSchema = object({
    displayName: string().required('必填'),
    content: array()
      .of(
        object({
          text: string().required('必填'),
          weight: string(),
        })
      )
      .required('必填')
      .min(1),
  });

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
                name="content"
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

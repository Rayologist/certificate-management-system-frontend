import { Form, Formik } from 'formik';
import { FormikController } from '@components/Form';
import { ControllerProps, Response } from 'types';
import { Button, Grid, Notification } from '@mantine/core';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { sendCert } from '@services/sendCert';
import { useState } from 'react';

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
  const [notification, setNotification] = useState('');

  interface Values {
    name: string;
    email: string;
  }

  const initialValue: Values = {
    name: '',
    email: '',
  };

  const onSubmit = async (values: Values) => {
    const [data, error] = (await sendCert({
      ...values,
      certificateId,
      activityUid,
    })) as [Response, any];

    if (data.status === 'failed') {
      switch (data.msg) {
        case 'unauthorized':
          setNotification('名字或信箱錯誤，請洽工作人員。');
          return null;
        case 'unavaliable':
          router.push('/500', { pathname: router.basePath, query: router.query });
          return null;
        case 'mail server error':
          router.push('/500', { pathname: router.basePath, query: router.query });
          return null;
      }
      return null;
    }

    if (error) {
      router.push('/500', { pathname: router.basePath, query: router.query });
      return null;
    }

    router.push(pushUrl);
    return null;
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('必填'),
    email: Yup.string().email('格式錯誤').required('必填'),
  });

  const fields: ControllerProps[] = [
    {
      control: 'text-input',
      name: 'name',
      label: '姓名',
      description: '報名時填寫之姓名',
      withAsterisk: true,
    },
    {
      control: 'text-input',
      type: 'email',
      name: 'email',
      label: '電子信箱',
      description: '報名時填寫之電子信箱',
      withAsterisk: true,
    },
  ];

  return (
    <Formik initialValues={initialValue} onSubmit={onSubmit} validationSchema={validationSchema}>
      {(formik) => (
        <Form>
          <Grid justify="center" gutter="xl">
            {fields.map((field, index) => (
              <Grid.Col xs={12} sm={12} md={12} lg={12} key={`${field.name}-${index}`}>
                <FormikController {...field} />
              </Grid.Col>
            ))}
            {notification !== '' && (
              <Grid.Col xs={12} sm={12} md={12} lg={12}>
                <Notification onClose={() => setNotification('')} icon="!" color="red">
                  {notification}
                </Notification>
              </Grid.Col>
            )}
            <Grid.Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button type="submit" mt={10} loading={formik.isSubmitting} fullWidth>
                {formik.isSubmitting ? '正在製作證書...' : '送出'}
              </Button>
            </Grid.Col>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default CertificateForm;

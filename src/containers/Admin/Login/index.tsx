import { Button, Grid, Notification } from '@mantine/core';
import { Form, Formik } from 'formik';
import { FormikController } from '@components/Form';
import { ControllerProps, Response } from 'types';
import * as Yup from 'yup';
import { login } from '@services/session';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from 'src/contexts/UserContext';
import { Route } from '@config';

const LoginForm = () => {
  const [notification, setNotification] = useState(false);
  const { setUser } = useUser();
  const router = useRouter();

  interface Values {
    account: string;
    password: string;
  }

  const initialValue: Values = {
    account: '',
    password: '',
  };

  const onSubmit = async (values: Values) => {
    const [result, error] = (await login(values)) as [Response<{ role?: string }>, any];

    if (error) {
      router.push('/500', { pathname: router.asPath });
      return null;
    }

    if (result.status !== 'success') {
      setNotification(true);
      return null;
    }

    const role = result.data?.role;

    if (role) {
      setUser((prev) => ({ ...prev, data: { role } }));
    }

    router.push(Route.Activity);
    return null;
  };

  const validationSchema = Yup.object({
    account: Yup.string().required('必填'),
    password: Yup.string().required('必填'),
  });

  const fields: ControllerProps[] = [
    {
      control: 'text-input',
      name: 'account',
      label: '帳號',
      required: true,
    },
    {
      control: 'password-input',
      name: 'password',
      label: '密碼',
      required: true,
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
            {notification && (
              <Grid.Col xs={12} sm={12} md={12} lg={12}>
                <Notification onClose={() => setNotification(false)} icon="!" color="red">
                  帳號或密碼錯誤
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
              <Button type="submit" mt={5} loading={formik.isSubmitting} fullWidth>
                {formik.isSubmitting ? '登入中...' : '登入'}
              </Button>
            </Grid.Col>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;

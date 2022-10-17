import useSimpleForm from '@components/Form';
import { Response } from 'types';
import { object, string } from 'yup';
import { login } from '@services/session';
import { useRouter } from 'next/router';
import { useUser } from 'src/contexts/UserContext';
import { Route } from '@config';

const LoginForm = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const Form = useSimpleForm({
    initialValues: {
      account: '',
      password: '',
    },
    controllers: [
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
    ],
    validationSchema: object({
      account: string().required('必填'),
      password: string().required('必填'),
    }),
    onSubmit: async (values, actions) => {
      const [result, error] = (await login(values)) as [Response<{ role?: string }>, any];

      if (error) {
        router.push('/500', { pathname: router.asPath });
        return null;
      }

      if (result.status !== 'success') {
        actions.setFieldError('account', '帳號或密碼錯誤');
        return null;
      }

      const role = result.data?.role;

      if (role) {
        setUser((prev) => ({ ...prev, data: { role } }));
      }

      router.push(Route.Activity);
      return null;
    },
  });

  return (
    <Form>
      {(formik) => (
        <Form.Button mt={30} loading={formik.isSubmitting} fullWidth>
          {formik.isSubmitting ? '登入中...' : '登入'}
        </Form.Button>
      )}
    </Form>
  );
};

export default LoginForm;

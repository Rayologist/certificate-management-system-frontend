import { Response } from 'types';
import { object, string } from 'yup';
import { useRouter } from 'next/router';
import { sendCert } from '@services/sendCert';
import useSimpleForm from '@components/Form';

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
  const Form = useSimpleForm({
    initialValues: {
      name: '',
      altName: '',
      email: '',
    },
    validationSchema: object({
      name: string().required('必填'),
      altName: string(),
      email: string().email('格式錯誤').required('必填'),
    }),
    controllers: [
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
      {
        control: 'text-input',
        name: 'altName',
        description: '顯示於證書上之名稱，預設為報名時填寫的名字',
        label: '證書顯示名稱',
      },
    ],
    onSubmit: async (values, actions) => {
      const [data, error] = (await sendCert({
        ...values,
        certificateId,
        activityUid,
      })) as [Response, any];

      if (data.status === 'failed') {
        switch (data.msg) {
          case 'unauthorized':
            actions.setFieldError('name', '名字或信箱錯誤，請洽工作人員。');
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
    },
  });

  return (
    <Form>
      {(formik) => (
        <Form.Button mt={30} loading={formik.isSubmitting} fullWidth>
          {formik.isSubmitting ? '正在製作證書...' : '送出'}
        </Form.Button>
      )}
    </Form>
  );
}

export default CertificateForm;

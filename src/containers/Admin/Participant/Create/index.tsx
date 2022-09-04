import { Form, Formik, FormikHelpers } from 'formik';
import { FormikController } from '@components/Form';
import { ControllerProps, Participant } from 'types';
import { Button, Grid } from '@mantine/core';
import * as Yup from 'yup';
import { KeyedMutator } from 'swr';
import { createParticipant } from '@services/participant';
import { useRouter } from 'next/router';

type Values = Omit<
  Participant,
  'id' | 'createdAt' | 'updatedAt' | 'activityUid' | 'participantCertificate'
>;

const CreateParticipant = ({
  activityUid,
  handleClose,
  mutate,
}: {
  activityUid: string;
  handleClose: () => void;
  mutate: KeyedMutator<any>;
}) => {
  const router = useRouter();

  const initialValue: Values = {
    name: '',
    from: '',
    title: '',
    email: '',
    phone: '',
  };

  const onSubmit = async (values: Values, actions: FormikHelpers<Values>) => {
    const payload = { activityUid, ...values } as Values & {
      activityUid: string;
    };
    const [, error] = await createParticipant({ data: [payload] });
    if (error) {
      router.push('/500', { pathname: router.asPath });
      return;
    }
    actions.setSubmitting(false);
    mutate();
    handleClose();
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('必填'),
    from: Yup.string().required('必填'),
    title: Yup.string().required('必填'),
    email: Yup.string().email('請確認 email 格式').required(),
    phone: Yup.string().required('必填'),
  });

  const fields: ControllerProps[] = [
    {
      control: 'text-input',
      name: 'name',
      label: '名字',
      required: true,
    },
    {
      control: 'text-input',
      name: 'from',
      label: '單位',
      required: true,
    },
    {
      control: 'text-input',
      name: 'title',
      label: '職稱',
      required: true,
    },
    {
      control: 'text-input',
      name: 'email',
      label: '電子信箱',
      required: true,
    },
    {
      control: 'text-input',
      name: 'phone',
      label: '聯絡電話',
      required: true,
    },
  ];

  return (
    <Formik initialValues={initialValue} onSubmit={onSubmit} validationSchema={validationSchema}>
      {(formik) => (
        <Form>
          <Grid justify="center" gutter="xl">
            {fields.map((field, index) => (
              <Grid.Col xs={10} sm={10} md={10} lg={10} key={`${field.name}-${index}`}>
                <FormikController {...field} />
              </Grid.Col>
            ))}

            <Grid.Col
              xs={10}
              sm={10}
              md={10}
              lg={10}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button type="submit" mt={25} loading={formik.isSubmitting} variant="outline">
                {formik.isSubmitting ? '建立中...' : '確認'}
              </Button>
            </Grid.Col>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default CreateParticipant;

import { Form, Formik, FormikHelpers } from 'formik';
import { FormikController } from '@components/Form';
import { ControllerProps, Participant } from 'types';
import { Button, Grid } from '@mantine/core';
import { object, string } from 'yup';
import { KeyedMutator } from 'swr';
import { updateParticipant } from '@services/participant';
import { useRouter } from 'next/router';

type Values = Omit<
  Participant,
  'createdAt' | 'updatedAt' | 'activityUid' | 'participantCertificate'
>;
const UpdateParticipant = ({
  participantProps,
  handleClose,
  mutate,
}: {
  participantProps: Values;
  handleClose: () => void;
  mutate: KeyedMutator<any>;
}) => {
  const router = useRouter();
  const { id, name, from, title, email, phone } = participantProps;

  const initialValue: Values = {
    id,
    name,
    from,
    title,
    email,
    phone,
  };

  const onSubmit = async (values: Values, actions: FormikHelpers<Values>) => {
    const [, error] = await updateParticipant(values);
    if (error) {
      router.push('/500', { pathname: router.asPath });
      return;
    }
    actions.setSubmitting(false);
    mutate();
    handleClose();
  };

  const validationSchema = object({
    name: string().required('必填'),
    from: string().required('必填'),
    title: string().required('必填'),
    email: string().email('請確認 email 格式').required(),
    phone: string().required('必填'),
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

export default UpdateParticipant;

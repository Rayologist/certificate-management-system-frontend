import React, { SetStateAction, Dispatch } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { FormikController } from '@components/Form';
import { ControllerProps, PickAsOrNull, UpdateActivityRequest } from 'types';
import { Button, Grid } from '@mantine/core';
import { object, string, date } from 'yup';
import { KeyedMutator } from 'swr';
import { updateActivity } from '@services/activity';
import { useRouter } from 'next/router';

type UpdateValue = {
  auid: string;
  title: string;
  startDate: Date;
  endDate: Date;
  email: string;
  subject: string;
};

type Values = Omit<PickAsOrNull<UpdateActivityRequest, 'startDate' | 'endDate'>, 'auid'>;

const UpdateActivity = ({
  auid,
  title,
  startDate,
  endDate,
  email,
  subject,
  mutate,
  setOpened,
}: UpdateValue & {
  mutate: KeyedMutator<any>;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const initialValue: Values = {
    title,
    startDate,
    endDate,
    subject,
    email,
  };

  const onSubmit = async (values: Values, actions: FormikHelpers<Values>) => {
    /* eslint-disable @typescript-eslint/no-shadow */
    const { startDate, endDate, ...rest } = values;
    if (startDate == null || endDate == null) {
      return null;
    }
    const [, error] = await updateActivity({ auid, startDate, endDate, ...rest });
    if (error) {
      router.push('/500', { pathname: router.asPath });
      return null;
    }

    actions.setSubmitting(false);
    mutate();
    setOpened(false);
    return null;
  };

  const validationSchema = object({
    title: string().required('必填'),
    startDate: date().required('必填').nullable(),
    endDate: date().required('必填').nullable(),
    subject: string().required('必填'),
    email: string().required('必填'),
  });

  const fields: ControllerProps[] = [
    {
      control: 'text-input',
      name: 'title',
      label: '活動名稱',
      withAsterisk: true,
    },
    {
      control: 'date-picker',
      name: 'startDate',
      label: '開始日期',
      placeholder: '請點選或輸入時間',
      withAsterisk: true,
    },
    {
      control: 'date-picker',
      name: 'endDate',
      label: '結束日期',
      placeholder: '請點選或輸入時間',
      withAsterisk: true,
    },
    {
      control: 'text-input',
      name: 'subject',
      label: '信件主旨',
      withAsterisk: true,
    },
    {
      control: 'text-editor',
      name: 'email',
      label: '信件內容',
      withAsterisk: true,
    },
  ];

  return (
    <Formik initialValues={initialValue} onSubmit={onSubmit} validationSchema={validationSchema}>
      {(formik) => (
        <Form>
          <Grid justify="center" gutter="xl">
            {fields.map((field, index) => (
              <Grid.Col key={`${field.name}-${index}`}>
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
              <Button type="submit" mt={25} mb={5} loading={formik.isSubmitting} variant="outline">
                {formik.isSubmitting ? '修改中...' : '確認'}
              </Button>
            </Grid.Col>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateActivity;

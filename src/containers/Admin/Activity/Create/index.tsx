import React, { Dispatch, SetStateAction } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { FormikController } from '@components/Form';
import { ControllerProps, CreateActivityRequest, PickAsOrNull } from 'types';
import { Button, Grid } from '@mantine/core';
import * as Yup from 'yup';
import { KeyedMutator } from 'swr';
import { createActivity } from '@services/activity';
import { useRouter } from 'next/router';

type Values = PickAsOrNull<CreateActivityRequest, 'startDate' | 'endDate'>;

const CreateNewActivity = ({
  setOpened,
  mutate,
}: {
  setOpened: Dispatch<SetStateAction<boolean>>;
  mutate: KeyedMutator<any>;
}) => {
  const router = useRouter();
  const initialValue: Values = {
    title: '',
    startDate: null,
    endDate: null,
  };

  const onSubmit = async (values: Values, actions: FormikHelpers<Values>) => {
    const payload = values as CreateActivityRequest;
    const [, error] = await createActivity(payload);
    if (error) {
      router.push('/500', { pathname: router.asPath });
      return;
    }
    actions.setSubmitting(false);
    mutate();
    setOpened(false);
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('必填'),
    startDate: Yup.date().required('必填').nullable(),
    endDate: Yup.date().required('必填').nullable(),
  });

  const fields: ControllerProps[] = [
    {
      control: 'text-input',
      name: 'title',
      label: '活動名稱',
      required: true,
    },
    {
      control: 'date-picker',
      name: 'startDate',
      label: '開始日期',
      placeholder: '請點選或輸入時間',
      allowFreeInput: true,
      required: true,
    },
    {
      control: 'date-picker',
      name: 'endDate',
      label: '結束日期',
      placeholder: '請點選或輸入時間',
      allowFreeInput: true,
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

export default CreateNewActivity;

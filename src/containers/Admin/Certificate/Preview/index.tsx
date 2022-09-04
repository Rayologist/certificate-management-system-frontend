import { useFormikContext } from 'formik';
import { Button, ButtonProps } from '@mantine/core';
import { SetStateAction, Dispatch } from 'react';
import { useCertificatePreview } from '@services/certificate';
import { CertificateFormValues } from '../types';

type PreviewButton = ButtonProps & {
  children?: React.ReactNode;
  setObjectURL: Dispatch<SetStateAction<string>>;
};

const PreviewButton = (props: PreviewButton) => {
  const { setObjectURL, children, ...rest } = props;
  const { setPayload, isLoading } = useCertificatePreview(setObjectURL);

  const formik = useFormikContext<CertificateFormValues>();
  const { values, errors } = formik;

  const { title, totalHour: th, dateString, dummyName } = values;
  const totalHour = th as number;
  const hasErrors = errors.dateString || errors.totalHour || errors.title;
  const hasValues = title && totalHour && dateString;

  const onClick = () => {
    if (!hasErrors && hasValues) {
      setPayload({
        title,
        totalHour,
        dateString,
        dummyName,
      });
    }
  };

  return (
    <Button {...rest} onClick={onClick} loading={isLoading}>
      {children}
    </Button>
  );
};

export default PreviewButton;

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

  const { content, dummyName } = values;
  const hasErrors = errors.content;
  const hasValues = content.length > 0;

  const onClick = () => {
    if (!hasErrors && hasValues) {
      setPayload({
        content,
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

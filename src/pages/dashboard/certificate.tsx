import Loader from "@components/Loader";
import CertificateTable from "@containers/Admin/Certificate/Table";
import { Title, Group, Paper } from "@mantine/core";
import { useCertificate } from "@services/certificate";

const Certificate = () => {
  const { certificate, isLoading, isError, mutate } = useCertificate();

  if (isLoading) return <Loader />;

  return (
    <>
      <Group position="apart" mb={50}>
        <Title>證書製作</Title>
      </Group>
      <Paper sx={{ padding: "1rem" }}>
        <CertificateTable data={certificate.data} />
      </Paper>
    </>
  );
};

Certificate.auth = true;

export default Certificate;

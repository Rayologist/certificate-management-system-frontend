import dynamic from 'next/dynamic';
import { Paper, Container, Title, Text } from '@mantine/core';
import { GetServerSideProps } from 'next';
import request from 'src/utils/fetcher';
import { URLSearchParams } from 'url';
import { Response, SendCertificate } from 'types';
import { Href } from '@config';

const CertificateForm = dynamic(() => import('@containers/Form'));

const parseCookie = <T,>(text: string): T | false => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return false;
  }
};

export default function HomePage({ data }: { data: SendCertificate }) {
  const { activityName, certificateName, certificateId, activityUid } = data;
  const e = window.btoa(encodeURIComponent(`p=${activityName}&c=${certificateName}`));
  const pushUrl = `/success?e=${e}`;

  return (
    <>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Certificate of Attendance
      </Title>
      <Container size={420} mt={10} mb={40}>
        <Text color="dimmed" align="center" weight="bold">
          {activityName}
        </Text>
        <Text color="dimmed" align="center">
          {certificateName}
        </Text>
        <Paper shadow="lg" p={30} mt={30} radius="md" withBorder>
          <CertificateForm {...{ certificateId, activityUid }} pushUrl={pushUrl} />
        </Paper>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const redirect = {
    redirect: {
      destination: Href.home,
      permanent: false,
    },
  };

  const { p: activity, c: certificate } = context.query as {
    p?: string;
    c?: string;
  };

  if (!activity || !certificate) return redirect;

  const domain = process.env.EXTERNAL_SERVER_DOMAIN;

  if (!domain) {
    throw new Error('EXTERNAL_DOMAIN undefined');
  }

  const url = new URL(`${domain}/cert`);
  const query = new URLSearchParams({ activity, certificate });
  url.search = query.toString();

  const response: Response<SendCertificate> = await request({
    url: url.href,
    method: 'GET',
  });

  if (response.status === 'failed') return redirect;

  const { activityName, activityUid, certificateId, certificateName } = response.data;

  const cookie = req.cookies[activityUid];

  if (cookie) {
    const array = parseCookie<number[]>(cookie);
    const isArray = Array.isArray(array);

    if (isArray && array.includes(certificateId)) {
      const buffer = Buffer.from(`p=${activityName}&c=${certificateName}`);
      const e = encodeURIComponent(buffer.toString('base64'));
      const destination = `/success?e=${e}`;

      return {
        redirect: {
          permanent: false,
          destination,
        },
      };
    }
  }

  return {
    props: {
      data: response.data,
      cid: certificate,
    },
  };
};

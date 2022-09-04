import { CopyButton, ActionIcon, Tooltip, Button, Card, Text, Grid } from '@mantine/core';
import { useId } from '@mantine/hooks';
import { IconCheck, IconLink } from '@tabler/icons';
import { QRCodeCanvas } from 'qrcode.react';

const downloadQRCode = (id: string, displayName: string) => () => {
  const canvas = document.getElementById(id) as HTMLCanvasElement;

  const pngFile = canvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.download = displayName;
  downloadLink.href = pngFile;
  downloadLink.click();
  downloadLink.remove();
};

export default function QRCode({
  url,
  displayName,
  size,
}: {
  size: number;
  url: string;
  displayName: string;
}) {
  const uuid = useId();
  const SVGSize = size / 5;

  return (
    <Card p="lg" mt="xl">
      <Card.Section sx={{ display: 'flex', justifyContent: 'center' }}>
        <QRCodeCanvas
          style={{ width: '250px', height: '250' }}
          id={uuid}
          value={url}
          size={size}
          fgColor="#104851"
          level="Q"
          imageSettings={{
            src: '/favicon.svg',
            width: SVGSize,
            height: SVGSize,
            excavate: true,
          }}
        />
      </Card.Section>

      <Grid mb="xs" mt="lg">
        <Grid.Col mb="xs">
          <Text weight={700} align="center">
            {displayName}
          </Text>
        </Grid.Col>
        <Grid.Col span={10}>
          <Button
            onClick={downloadQRCode(uuid, displayName)}
            variant="light"
            color="blue"
            fullWidth
            radius="md"
          >
            下載 QR Code
          </Button>
        </Grid.Col>
        <Grid.Col span={2}>
          <CopyButton value={url} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? '已複製' : '複製網址'} withArrow>
                <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                  {copied ? <IconCheck size={20} /> : <IconLink size={20} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

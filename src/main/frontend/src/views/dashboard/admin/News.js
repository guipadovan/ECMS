import Card from '../../../components/Card';
import { HStack, Text } from '@chakra-ui/react';

export default function News() {
  return (
    <HStack spacing={2}>
      <Card title={'test1'}>
        test
      </Card>
      <Card title={'test12'}>
        <Text>salvee</Text>
      </Card>
    </HStack>
  );
}
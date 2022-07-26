import {Button, Heading, HStack} from "@chakra-ui/react";
import {FaArrowLeft, FaInfo} from "react-icons/all";
import {useNavigate} from "react-router";

const CardHeader = ({label, handleBackClick}) => {

  const navigate = useNavigate();

  return (
    <HStack alignItems={"center"} justifyContent={"space-between"}>
      <Heading fontSize={{base: "2xl", sm: "4xl"}} textAlign={"center"}>
        {label}
      </Heading>
      <HStack>
        <Button colorScheme="gray" size={{base: "sm", sm: "md"}} leftIcon={<FaInfo/>} borderRadius={"5px"}
                bg={"blackAlpha.400"} _light={{bg: "blackAlpha.100"}}>
          Help
        </Button>
        <Button colorScheme="blue" size={{base: "sm", sm: "md"}} leftIcon={<FaArrowLeft/>} bg={"blue.400"}
                color={"white"} _hover={{bg: "blue.500"}} borderRadius={"5px"}
                onClick={handleBackClick ? handleBackClick : () => navigate(-1)}>
          Back
        </Button>
      </HStack>
    </HStack>
  );
}

export default CardHeader;
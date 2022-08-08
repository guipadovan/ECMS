import {HStack, IconButton, Td, Tooltip, Tr} from "@chakra-ui/react";
import {dateFormat} from "../../../services/date";
import {FaPencilAlt} from "react-icons/all";
import {Pagination} from "../../../components/navigation/Pagination";
import {DeleteConfirmation} from "../../dashboard";
import {deleteUser} from "./updateUser";

const usersRequest = async (axiosPrivate, page, size) => {
  return await axiosPrivate.get('/user/users', {
    params: {
      username: '',
      page: page,
      size: size,
    },
  });
}

export const getUsers = (page, setUsers, setPagination, axiosPrivate) => {
  usersRequest(axiosPrivate, page, 10)
    .then(response => {

      setUsers(response.data.content.map((user, i) => {
        const border = response.data.content.length === i + 1 ? '0' : 'solid 1px';

        return (
          <Tr key={user.id}>
            <Td p={'10px'} borderBottom={border}>
              {user.username}
            </Td>
            <Td p={'10px'} borderBottom={border}>
              {user.email}
            </Td>
            <Td p={'10px'} borderBottom={border}>
              {user.role.name}
            </Td>
            <Td p={'10px'} borderBottom={border}>
              <Tooltip bg={'blue.500'} color={'white'} placement={'top'}
                       label={dateFormat(user.createdAt, 'dd/MM/yyyy hh:mm')} hasArrow>
                {dateFormat(user.createdAt, 'dd/MM/yyyy')}
              </Tooltip>
            </Td>
            <Td p={'10px'} borderBottom={border}>
              {user.locked ? 'Banned' : user.enabled ? 'Regular' : 'Not enabled'}
            </Td>
            <Td p={'10px'} borderBottom={border}>
              <HStack spacing={'4px'}>
                <IconButton size='sm' color={'white'} bg={'blue.400'} colorScheme={'blue'}
                            _hover={{bg: 'blue.500'}} icon={<FaPencilAlt/>} aria-label={'edit user'}/>
                <DeleteConfirmation object={'User'} action={() => {
                  deleteUser(axiosPrivate, user.id).then(() => {
                    getUsers(page, setUsers, setPagination, axiosPrivate);
                  })
                }}/>
              </HStack>
            </Td>
          </Tr>
        )
      }));

      setPagination(<Pagination first={response.data.first} last={response.data.last}
                                current={response.data.number} totalPages={response.data.totalPages}
                                handlePrevious={() =>
                                  getUsers(page - 1, setUsers, setPagination, axiosPrivate)}
                                handleNext={() =>
                                  getUsers(page + 1, setUsers, setPagination, axiosPrivate)}
                                handleNumbers={(number) =>
                                  getUsers(number, setUsers, setPagination, axiosPrivate)}/>
      );
    })
    .catch((err) => {
      console.log(err);
    })
}
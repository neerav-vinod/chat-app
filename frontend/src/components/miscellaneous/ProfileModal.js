import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user,children}) => {

    const {isOpen, onOpen, onClose} = useDisclosure();

  return (
    <div>{
        children ? (<span onClick={onOpen}>{children}</span>)
        : (<IconButton
            display={{base:"flex"}}
            icon={<ViewIcon/>}
            onClick={onOpen}
            />)}

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'}>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' justifyContent='space-between' alignItems='center'>
            <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
            />
            <Text>{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        </div>
  )
}

export default ProfileModal
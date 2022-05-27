import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";

const TopicsModal = (props) => {
    return (
        <Modal isOpen={props.disclosure.isOpen} onClose={props.disclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {props.children}
          </ModalBody>
        </ModalContent>
      </Modal>
    )
};

export default TopicsModal;
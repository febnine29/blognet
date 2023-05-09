import React, {useState, useEffect, useRef} from 'react';
import {
    Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton
  } from '@chakra-ui/react'
interface IFunction{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    handleDeletePost: () => void
}
export default function Alert({isOpen, onOpen, onClose, handleDeletePost}:IFunction){
    
    const cancelRef = useRef<HTMLButtonElement | null>(null)

    return (
        <>
        <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
        >
            <AlertDialogOverlay />

            <AlertDialogContent>
            <AlertDialogHeader>Delete this post?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
                Are you sure you want to delete this post?
            </AlertDialogBody>
            <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                Cancel
                </Button>
                <Button colorScheme='red' ml={3} onClick={handleDeletePost}>
                Delete
                </Button>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}
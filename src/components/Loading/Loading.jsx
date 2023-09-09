import React from 'react';
import { HStack, Spinner, Heading } from 'native-base';

const LoadingScreen = ({ isLoading }) => {
    return (
        isLoading && (
            <HStack space={2} justifyContent="center">
                {/* Display a spinner to indicate loading */}
                <Spinner accessibilityLabel="Loading posts" />

                {/* Display a loading message */}
                <Heading color="primary.500" fontSize="md">
                    Loading
                </Heading>
            </HStack>
        )
    );
};

export default LoadingScreen;
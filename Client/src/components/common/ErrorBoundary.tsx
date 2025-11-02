import { Box, Button, Heading } from '@chakra-ui/react';
import { Component, ReactNode } from 'react';

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<{children: ReactNode}, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" p={8}>
          <Heading mb={4}>Something went wrong</Heading>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
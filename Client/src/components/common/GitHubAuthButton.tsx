import { Button } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

const GitHubAuthButton = () => {
  const handleGitHubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/dashboard`;
    const scope = 'repo,user,read:org';
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  return (
    <Button
      leftIcon={<FaGithub />}
      onClick={handleGitHubLogin}
      variant="outline"
      colorScheme="gray"
      _hover={{ bg: 'gray.700' }}
    >
      Login with GitHub
    </Button>
  );
};

export default GitHubAuthButton;
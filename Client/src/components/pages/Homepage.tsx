import { AbsoluteCenter, Box, Center, Heading } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StarryBackground from '../common/StarryBackground'
import Typewriter from 'typewriter-effect'
import GitHubAuthButton from '../common/GitHubAuthButton'

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('github_access_token');
    if (storedToken) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Add this before your React code
  const originalError = console.error;
  console.error = (...args) => {
    if (/ReactDOM.render is no longer supported in React 18/.test(args[0])) return;
    if (/Support for defaultProps will be removed/.test(args[0])) return;
    originalError.apply(console, args);
  };  
  return (
    <Box>
        <StarryBackground />
        <AbsoluteCenter>
          <Box>
            <Center>
              <Heading className='custom-font' size="5xl" zIndex={0}>
                Critique AI
              </Heading>
            </Center>
            <Center>
              <Box color="white" className='custom-font'>
                <Typewriter
                  options={{
                    strings: [
                      'AI-powered pull request reviews',
                      'Instant code feedback',
                      'Code quality insights with every PR',
                      'Automated GitHub PR analysis',
                      'Seamlessly integrated with GitHub',
                      'AI agent ensures best coding practices',
                      'Enhance your code with AI reviews'
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 30,
                    cursor: " ▋"
                  }}
                />
              </Box>
            </Center>
            <br />
            <Center>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <GitHubAuthButton />
                </Box>
            </Center>
          </Box>
        </AbsoluteCenter>
    </Box>
  )
}

export default Homepage

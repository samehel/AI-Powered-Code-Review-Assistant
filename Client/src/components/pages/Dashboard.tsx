import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import PRData from '../../types/PRData';
import styles from '../../assets/styles/Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pullRequests, setPullRequests] = useState<PRData[]>([]);
  const [selectedPR, setSelectedPR] = useState<PRData | null>(null);
  const [aiAnalysis, setAIAnalysis] = useState<string | null>(null);
  
  const handleLogout = () => {
    localStorage.removeItem('github_access_token');
    sessionStorage.clear(); // Clear all session storage on logout
    navigate('/');
  };

  const analyzePR = async (prData: PRData) => {
    try {
      // Check if analysis exists in sessionStorage
      const storedAnalysis = sessionStorage.getItem(`analysis_${prData.id}`);
      if (storedAnalysis) {
        return storedAnalysis;
      }

      // Format the code changes for the analysis
      const codeChangesText = prData.files.map(file => {
        return `File: ${file.filename}
Status: ${file.status}
Changes: +${file.additions} -${file.deletions}
${file.patch ? `\nPatch:\n${file.patch}` : ''}
-------------------`;
      }).join('\n\n');

      const response = await fetch('http://localhost:3001/api/analyze-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prDescription: `Title: ${prData.title}\nDescription: ${prData.body}${codeChangesText ? `\n\nCode Changes:\n${codeChangesText}` : ''}`
        }),
      });
  
      const { analysis } = await response.json();
      
      // Store the analysis in sessionStorage
      sessionStorage.setItem(`analysis_${prData.id}`, analysis);
      
      return analysis;
      
    } catch (error) {
      console.error("Analysis failed:", error);
      return "Analysis unavailable - try again later";
    }
  };

  useEffect(() => {
    if (selectedPR) {
      // Check if analysis exists in sessionStorage first
      const storedAnalysis = sessionStorage.getItem(`analysis_${selectedPR.id}`);
      if (storedAnalysis) {
        setAIAnalysis(storedAnalysis);
      } else {
        analyzePR(selectedPR).then(analysis => {
          setAIAnalysis(analysis);
        });
      }
    }
  }, [selectedPR]);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Check for existing token in localStorage
        const storedToken = localStorage.getItem('github_access_token');
        if (storedToken) {
          await fetchPRs(storedToken);
          return;
        }

        // Get the code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          // If no code, redirect to GitHub OAuth
          const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
          const redirectUri = `${window.location.origin}/dashboard`;
          const scope = 'repo,user,read:org';
          
          const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
          window.location.href = authUrl;
          return;
        }

        // Exchange code for access token using our backend
        const tokenResponse = await fetch('http://localhost:3001/api/github/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code })
        });

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
          throw new Error('Failed to get access token');
        }

        // Store the token in localStorage
        localStorage.setItem('github_access_token', tokenData.access_token);
        
        // Fetch PRs with the new token
        await fetchPRs(tokenData.access_token);
      } catch (err) {
        // If there's an error, clear the stored token and redirect to login
        localStorage.removeItem('github_access_token');
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch PRs';
        setError(errorMessage);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPRs = async (accessToken: string) => {
      try {
        // Fetch PRs using the access token
        const prResponse = await fetch('https://api.github.com/user/repos', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        const repos = await prResponse.json();
        
        // Fetch PRs for each repo
        const prPromises = repos.map(async (repo: any) => {
          const prsResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/pulls`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          const prs = await prsResponse.json();
          
          // Fetch detailed PR information for each PR
          const detailedPrs = await Promise.all(prs.map(async (pr: any) => {
            const detailedPrResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            });
            return detailedPrResponse.json();
          }));
          
          return detailedPrs;
        });

        const allPrs = await Promise.all(prPromises);
        const flattenedPrs = allPrs.flat().map(async (pr: any) => {
          // Fetch files changed in the PR
          const filesResponse = await fetch(`https://api.github.com/repos/${pr.head.repo.full_name}/pulls/${pr.number}/files`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          const files = await filesResponse.json();
          
          // Format the code changes
          const codeChanges = files.map((file: any) => {
            return {
              filename: file.filename,
              status: file.status,
              additions: file.additions,
              deletions: file.deletions,
              changes: file.changes,
              patch: file.patch || 'No patch available'
            };
          });

          return {
            id: pr.id,
            number: pr.number,
            title: pr.title,
            state: pr.state,
            html_url: pr.html_url,
            created_at: pr.created_at,
            repo_name: pr.head.repo.full_name,
            diff_url: pr.diff_url,
            body: pr.body || 'No description provided',
            files: codeChanges
          };
        });

        const prsWithFiles = await Promise.all(flattenedPrs);
        setPullRequests(prsWithFiles);
        if (prsWithFiles.length > 0) {
          setSelectedPR(prsWithFiles[0]);
        }
        setError(null);
      } catch (err) {
        // If there's an error fetching PRs, clear the token and redirect to login
        localStorage.removeItem('github_access_token');
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch PRs';
        setError(errorMessage);
        console.error('Error:', err);
      }
    };

    handleOAuthCallback();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading GitHub PRs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarTitle}>Pull Requests</h1>
          <p className={styles.sidebarSubtitle}>{pullRequests.length} requests</p>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
        <div className={styles.prList}>
          {pullRequests.map((pr) => (
            <div 
              key={pr.id} 
              onClick={() => setSelectedPR(pr)}
              className={`${styles.prItem} ${
                selectedPR?.id === pr.id ? styles.prItemSelected : ''
              }`}
            >
              <div className={styles.prTitle}>{pr.title}</div>
              <div className={styles.prMeta}>
                <span className={`${styles.statusDot} ${
                  pr.state === 'open' ? styles.statusDotOpen : styles.statusDotClosed
                }`}></span>
                <span className={styles.statusText}>{pr.state}</span>
                <span className={styles.divider}>•</span>
                <span className={styles.repoName}>{pr.repo_name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {selectedPR && (
          <div className={styles.prContainer}>
            <div className={styles.prHeader}>
              <h2 className={styles.prNumber}>Pull Request #{selectedPR.number}</h2>
              <div className={styles.prDetails}>
                <span>{selectedPR.repo_name}</span>
                <span className={styles.divider}>•</span>
                <span>Created {new Date(selectedPR.created_at).toUTCString()}</span>
              </div>
              
              <div className={styles.prMeta}>
                <span className={`${styles.prStatus} ${
                  selectedPR.state === 'open' 
                    ? styles.prStatusOpen 
                    : styles.prStatusClosed
                }`}>
                  {selectedPR.state}
                </span>
                <a 
                  href={selectedPR.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.githubLink}
                >
                  View on GitHub
                </a>
              </div>
              <br />
              <div className={styles.prContent}>
                <h3 className={styles.prTitle}>{selectedPR.title}</h3>
                <div className={styles.prBody} dangerouslySetInnerHTML={{ __html: selectedPR.body }} />
              </div>
            </div>

            <hr className={styles.sectionDivider} />

            <div className={styles.aiSection}>
              <h3 className={styles.aiHeader}>AI Analysis</h3>
              <div className={styles.aiContent}>
                {aiAnalysis ? (
                  <div>
                    <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                  </div>
                ) : (
                  <div className={styles.loadingDots}>
                    <span style={{ marginRight: '15px' }}>Generating analysis</span>
                    <div className={styles.dotFlashing}></div>
                  </div>
                )}              
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
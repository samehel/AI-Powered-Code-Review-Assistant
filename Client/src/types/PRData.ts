interface PRFile {
    filename: string;
    status: 'added' | 'removed' | 'modified' | 'renamed';
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
    raw_url: string;
  }
  
export default interface PRData {
    id: number;
    number: number;
    title: string;
    state: string;
    html_url: string;
    created_at: string;
    diff_url: string;
    files: PRFile[];
    repo_name: string;
    body: string;
}
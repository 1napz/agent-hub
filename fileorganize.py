"""
Workflow จัดระเบียบไฟล์ - Automated File Management System
ระบบอัตโนมัติสำหรับการจัดการไฟล์ที่มีประสิทธิภาพ
"""

import os
import time
import shutil
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List
import json
import re

# External libraries
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileCreatedEvent
import git
from pydub import AudioSegment
try:
    import git
    GIT_AVAILABLE = True
except ImportError:
    GIT_AVAILABLE = False

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('file_workflow.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class FileWorkflowConfig:
    """Configuration for the file workflow"""
    def __init__(self, watch_dir: str, output_dir: str, git_repo_path: Optional[str] = None):
        self.watch_dir = Path(watch_dir)
        self.output_dir = Path(output_dir)
        self.git_repo_path = Path(git_repo_path) if git_repo_path else output_dir
        self.dashboard_log = Path("workflow_dashboard.json")
        
        # Create directories if they don't exist
        self.watch_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)

class AIFileAnalyzer:
    """Step 1: AI วิเคราะห์ว่าทำอะไร - AI analyzes what to do with files"""
    
    @staticmethod
    def analyze_file(file_path: Path) -> Dict:
        """
        Analyze file and determine actions needed
        Returns dict with conversion and organization instructions
        """
        analysis = {
            'original_name': file_path.name,
            'extension': file_path.suffix.lower(),
            'needs_conversion': False,
            'target_extension': None,
            'suggested_name': None,
            'category': None,
            'actions': []
        }
        
        # Analyze based on file type
        if file_path.suffix.lower() == '.txt':
            analysis['needs_conversion'] = True
            analysis['target_extension'] = '.md'
            analysis['actions'].append('convert_txt_to_md')
            analysis['category'] = 'documents'
            
        elif file_path.suffix.lower() == '.wav':
            analysis['needs_conversion'] = True
            analysis['target_extension'] = '.mp3'
            analysis['actions'].append('convert_wav_to_mp3')
            analysis['category'] = 'audio'
            
        elif file_path.suffix.lower() in ['.md', '.mp3']:
            analysis['category'] = 'documents' if file_path.suffix.lower() == '.md' else 'audio'
            analysis['actions'].append('organize_only')
        
        # Generate suggested name with timestamp and category
        if analysis['category']:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            stem = file_path.stem.replace(' ', '_').lower()
            analysis['suggested_name'] = f"{analysis['category']}_{timestamp}_{stem}"
        
        logger.info(f"Analyzed file: {file_path.name} -> {analysis}")
        return analysis


class FileConverter:
    """Step 2: แปลงไฟล์ - Convert files"""
        @staticmethod
    def convert_txt_to_md(source_path: Path, dest_path: Path) -> bool:
        """Convert TXT file to Markdown format"""
        try:
            # Read TXT file
            with open(source_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Basic conversion: add markdown formatting
            # You can enhance this with more sophisticated conversion
            lines = content.split('\n')
            md_content = []
            
            for i, line in enumerate(lines):
                # Simple heuristics for markdown conversion
                if line.strip() == '':
                    md_content.append('')
                elif i == 0 and not line.startswith('#'):
                    # First line as heading
                    md_content.append(f"# {line}")
                elif line.startswith('-') or line.startswith('*'):
                    md_content.append(line)  # Already a list item
                elif len(line) < 100 and not line.endswith('.'):
                    # Might be a subheading
                    md_content.append(f"## {line}")
                else:
                    md_content.append(line)
            
            # Write MD file
            with open(dest_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(md_content))
            
            logger.info(f"Converted: {source_path} -> {dest_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error converting TXT to MD: {e}")
            return False
    
    @staticmethod
    def convert_wav_to_mp3(source_path: Path, dest_path: Path, bitrate: str = "128k") -> bool:
        """Convert WAV file to MP3 format"""
        try:
            # Load WAV file
            audio = AudioSegment.from_wav(str(source_path))
            
            # Export as MP3
            audio.export(str(dest_path), format="mp3", bitrate=bitrate)
            
            logger.info(f"Converted: {source_path} -> {dest_path} (bitrate: {bitrate})")            return True
            
        except Exception as e:
            logger.error(f"Error converting WAV to MP3: {e}")
            return False


class FileOrganizer:
    """Step 3: จัดรูปแบบ - Format and organize files"""
    
    # 7 ระเบียบเนื้อหา (7 content organization rules)
    ORGANIZATION_RULES = {
        'documents': 'Documents',
        'audio': 'Audio',
        'images': 'Images',
        'videos': 'Videos',
        'archives': 'Archives',
        'code': 'Code',
        'other': 'Other'
    }
    
    @staticmethod
    def rename_file(file_path: Path, suggested_name: str, category: str) -> Path:
        """Rename file according to organization rules"""
        # Get target directory based on category
        target_dir = FileOrganizer.get_category_directory(category)
        target_dir.mkdir(parents=True, exist_ok=True)
        
        # Create new file path
        extension = file_path.suffix.lower()
        new_path = target_dir / f"{suggested_name}{extension}"
        
        # Handle duplicate names
        counter = 1
        while new_path.exists():
            new_path = target_dir / f"{suggested_name}_{counter}{extension}"
            counter += 1
        
        # Rename/move file
        shutil.copy2(file_path, new_path)
        logger.info(f"Organized: {file_path} -> {new_path}")
        return new_path
    
    @staticmethod
    def get_category_directory(category: str) -> Path:
        """Get directory path for category"""
        base_dir = Path("organized_files")
        category_dir = FileOrganizer.ORGANIZATION_RULES.get(category, 'Other')
        return base_dir / category_dir

class GitCommitManager:
    """Step 4: บันทึก Commit - Git version control"""
    
    def __init__(self, repo_path: Path):
        self.repo_path = repo_path
        self.repo = None
        self.initialize_repo()
    
    def initialize_repo(self):
        """Initialize or open Git repository"""
        if not GIT_AVAILABLE:
            logger.warning("GitPython not available. Install with: pip install GitPython")
            return
        
        try:
            if self.repo_path.exists():
                self.repo = git.Repo(self.repo_path)
                logger.info(f"Opened existing Git repo: {self.repo_path}")
            else:
                self.repo_path.mkdir(parents=True, exist_ok=True)
                self.repo = git.Repo.init(self.repo_path)
                logger.info(f"Initialized new Git repo: {self.repo_path}")
        except Exception as e:
            logger.error(f"Git initialization error: {e}")
            self.repo = None
    
    def commit_file(self, file_path: Path, message: str = "Auto-commit: File organized") -> bool:
        """Commit file to Git repository"""
        if not self.repo:
            logger.warning("Git repo not initialized")
            return False
        
        try:
            # Add file to staging
            self.repo.index.add([str(file_path)])
            
            # Create commit with timestamp
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            commit_message = f"{message}\nTimestamp: {timestamp}\nFile: {file_path.name}"
            
            # Commit
            self.repo.index.commit(commit_message)
            
            logger.info(f"Git commit: {file_path.name}")
            return True
            
        except Exception as e:
            logger.error(f"Git commit error: {e}")
            return False

class DashboardLogger:
    """Step 5: รายงาน & ควบคุม - Dashboard logging and compliance"""
    
    def __init__(self, dashboard_file: Path):
        self.dashboard_file = dashboard_file
        self.dashboard_data = self.load_dashboard()
    
    def load_dashboard(self) -> Dict:
        """Load existing dashboard data"""
        if self.dashboard_file.exists():
            try:
                with open(self.dashboard_file, 'r') as f:
                    return json.load(f)
            except:
                pass
        return {'files_processed': [], 'statistics': {}, 'compliance_logs': []}
    
    def log_file_processed(self, file_info: Dict):
        """Log processed file to dashboard"""
        entry = {
            'timestamp': datetime.now().isoformat(),
            'original_file': file_info.get('original_name'),
            'final_path': str(file_info.get('final_path')),
            'actions': file_info.get('actions', []),
            'category': file_info.get('category'),
            'status': 'completed'
        }
        
        self.dashboard_data['files_processed'].append(entry)
        self.update_statistics(entry)
        self.check_compliance(entry)
        self.save_dashboard()
        
        logger.info(f"Dashboard updated: {file_info.get('original_name')}")
    
    def update_statistics(self, entry: Dict):
        """Update statistics in dashboard"""
        stats = self.dashboard_data['statistics']
        category = entry['category']
        
        if category not in stats:
            stats[category] = {'count': 0, 'files': []}
        
        stats[category]['count'] += 1
        stats[category]['files'].append(entry['original_file'])
        stats['total_processed'] = len(self.dashboard_data['files_processed'])
        stats['last_updated'] = entry['timestamp']
        def check_compliance(self, entry: Dict):
        """Check compliance rules"""
        compliance_log = {
            'timestamp': entry['timestamp'],
            'file': entry['original_file'],
            'checks': {
                'file_named': bool(entry['final_path']),
                'categorized': bool(entry['category']),
                'actions_documented': len(entry['actions']) > 0
            },
            'compliant': True
        }
        
        # Check if all compliance checks passed
        if not all(compliance_log['checks'].values()):
            compliance_log['compliant'] = False
        
        self.dashboard_data['compliance_logs'].append(compliance_log)
    
    def save_dashboard(self):
        """Save dashboard to file"""
        with open(self.dashboard_file, 'w') as f:
            json.dump(self.dashboard_data, f, indent=2, ensure_ascii=False)


class FileWorkflowHandler(FileSystemEventHandler):
    """Main workflow handler for file system events"""
    
    def __init__(self, config: FileWorkflowConfig):
        self.config = config
        self.analyzer = AIFileAnalyzer()
        self.converter = FileConverter()
        self.organizer = FileOrganizer()
        self.git_manager = GitCommitManager(config.git_repo_path)
        self.dashboard = DashboardLogger(config.dashboard_log)
    
    def on_created(self, event):
        """Handle file creation events"""
        if event.is_directory:
            return
        
        file_path = Path(event.src_path)
        logger.info(f"New file detected: {file_path}")
        
        try:
            self.process_file(file_path)
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
    
    def process_file(self, file_path: Path):        """Process a single file through the complete workflow"""
        logger.info(f"Starting workflow for: {file_path.name}")
        
        # Step 1: Analyze file
        analysis = self.analyzer.analyze_file(file_path)
        
        # Step 2: Convert if needed
        working_file = file_path
        if analysis['needs_conversion']:
            if analysis['target_extension'] == '.md':
                temp_path = self.config.output_dir / f"{analysis['suggested_name']}.md"
                if self.converter.convert_txt_to_md(file_path, temp_path):
                    working_file = temp_path
                    analysis['actions'].append('converted_to_md')
                    
            elif analysis['target_extension'] == '.mp3':
                temp_path = self.config.output_dir / f"{analysis['suggested_name']}.mp3"
                if self.converter.convert_wav_to_mp3(file_path, temp_path):
                    working_file = temp_path
                    analysis['actions'].append('converted_to_mp3')
        
        # Step 3: Organize and rename
        organized_path = self.organizer.rename_file(
            working_file,
            analysis['suggested_name'],
            analysis['category']
        )
        analysis['final_path'] = organized_path
        
        # Step 4: Git commit
        if self.git_manager.repo:
            self.git_manager.commit_file(organized_path, "Auto-organized file")
        
        # Step 5: Log to dashboard
        self.dashboard.log_file_processed(analysis)
        
        logger.info(f"Workflow completed for: {file_path.name}")


def start_workflow(watch_dir: str, output_dir: str = "organized_files", 
                   git_repo: Optional[str] = None):
    """Start the automated file workflow"""
    
    # Configuration
    config = FileWorkflowConfig(
        watch_dir=watch_dir,
        output_dir=output_dir,
        git_repo_path=git_repo
    )
        # Create event handler and observer
    event_handler = FileWorkflowHandler(config)
    observer = Observer()
    observer.schedule(event_handler, str(config.watch_dir), recursive=False)
    
    # Start monitoring
    observer.start()
    logger.info(f"🚀 Workflow started! Monitoring: {config.watch_dir}")
    logger.info("Press Ctrl+C to stop...")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        logger.info("Workflow stopped.")
    
    observer.join()


# Example usage and testing
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        watch_directory = sys.argv[1]
    else:
        watch_directory = "./watch_folder"
    
    print("=" * 60)
    print("Workflow จัดระเบียบไฟล์ - Automated File Management")
    print("=" * 60)
    print(f"📁 Watching directory: {watch_directory}")
    print("📋 Workflow Steps:")
    print("   1. ตรวจสอบไฟล์ - Check and analyze new files")
    print("   2. แปลงไฟล์ - Convert formats (txt→md, wav→mp3)")
    print("   3. จัดรูปแบบ - Organize and rename files")
    print("   4. บันทึก Commit - Git version control")
    print("   5. รายงาน & ควบคุม - Dashboard logging")
    print("=" * 60)
    
    start_workflow(watch_directory)
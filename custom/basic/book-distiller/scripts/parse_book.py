import os
import sys
import argparse

def parse_txt(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def parse_pdf(file_path):
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except ImportError:
        return "Error: PyMuPDF (pymupdf) not installed. Please install it to parse PDF files."

def parse_epub(file_path):
    try:
        import ebooklib
        from ebooklib import epub
        from bs4 import BeautifulSoup
        
        book = epub.read_epub(file_path)
        chapters = []
        for item in book.get_items():
            if item.get_type() == ebooklib.ITEM_DOCUMENT:
                chapters.append(item.get_content())
        
        text = ""
        for html in chapters:
            soup = BeautifulSoup(html, 'html.parser')
            text += soup.get_text() + "\n"
        return text
    except ImportError:
        return "Error: ebooklib or beautifulsoup4 not installed. Please install them to parse EPUB files."

def main():
    parser = argparse.ArgumentParser(description="Parse book files into plain text.")
    parser.add_argument("file", help="Path to the book file (PDF, EPUB, TXT)")
    parser.add_argument("--output", help="Path to save the extracted text")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.file):
        print(f"Error: File {args.file} not found.")
        sys.exit(1)
        
    ext = os.path.splitext(args.file)[1].lower()
    
    if ext == ".txt":
        content = parse_txt(args.file)
    elif ext == ".pdf":
        content = parse_pdf(args.file)
    elif ext == ".epub":
        content = parse_epub(args.file)
    else:
        print(f"Error: Unsupported file extension {ext}")
        sys.exit(1)
        
    if content.startswith("Error:"):
        print(content)
        sys.exit(1)
        
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Success: Content saved to {args.output}")
    else:
        # Print first 1000 chars if no output file specified
        print(content[:1000] + ("..." if len(content) > 1000 else ""))

if __name__ == "__main__":
    main()

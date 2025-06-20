# Recreate the document since the previous one is lost from memory
from docx import Document

# Create a new Word Document
doc = Document()
doc.add_heading('HTML Introduction for Beginners', 0)

# Section 1: What is HTML?
doc.add_heading('1. What is HTML?', level=1)
doc.add_paragraph("""HTML stands for HyperText Markup Language. It is the standard language used to create websites and web pages.

- HyperText means text with links. When you click a link and go to another page — that's hypertext.
- Markup Language is a way to label content. It uses tags (like <p>, <h1>, etc.) to tell the browser how to display the content.

Example:
<p>This is a paragraph.</p>
This tells the browser: “Display this text as a paragraph.”
""")

# Section 2: Why Do We Use HTML?
doc.add_heading('2. Why Do We Use HTML?', level=1)
doc.add_paragraph("""Every website you visit — Google, Facebook, YouTube — uses HTML to:
- Display content (text, images, videos)
- Organize layout (headers, sections, menus)
- Link between pages (login, home, contact)

Real-life Example: When you open a newspaper, you see headings, images, articles, and links to continue reading — websites do the same using HTML.
""")

# Section 3: History and Evolution of HTML
doc.add_heading('3. History and Evolution of HTML', level=1)
doc.add_paragraph("""HTML has evolved over the years to make websites more interactive, faster, and user-friendly.

| Version  | Year Introduced | Key Highlights                  |
|----------|------------------|----------------------------------|
| HTML 1.0 | 1993             | Basic formatting: paragraphs, lists |
| HTML 2.0 | 1995             | Forms, tables                    |
| HTML 3.2 | 1997             | Scripting support                |
| HTML 4.01| 1999             | Better formatting, CSS support  |
| HTML5    | 2014             | Modern features: audio, video, responsive design, APIs |
""")

# Section 4: HTML5 Overview
doc.add_heading('4. HTML5 Overview', level=1)
doc.add_paragraph("""HTML5 is the latest version of HTML. It brought powerful improvements:

New Semantic Tags:
- <header>, <nav>, <section>, <footer>

Supports Multimedia:
- <video>, <audio>

Example:
<video controls>
  <source src="movie.mp4" type="video/mp4">
</video>

Form Enhancements:
- <input type="email"> validates email
- <input type="date"> gives a date picker
""")

# Section 5: Setting Up Your Environment
doc.add_heading('5. Setting Up Your Environment', level=1)
doc.add_paragraph("""You don’t need anything complicated to start learning HTML.

What You Need:
1. A Text Editor (Notepad, Notepad++, or Visual Studio Code)
2. A Web Browser (Chrome, Firefox, Edge, Safari)

How to Start:
1. Open your text editor
2. Write HTML code
3. Save the file as index.html
4. Open it in a browser

Sample HTML File:
<!DOCTYPE html>
<html>
<head>
  <title>My First Web Page</title>
</head>
<body>
  <h1>Welcome to My Website</h1>
  <p>Hello, I am learning HTML!</p>
</body>
</html>
""")

# Section 6: How Browsers Interpret HTML
doc.add_heading('6. How Browsers Interpret HTML', level=1)
doc.add_paragraph("""When you open an .html file in a browser:

Behind the Scenes:
1. The browser reads your HTML code.
2. It builds the page structure.
3. It renders the content visually.

Example:
<h1>Welcome</h1>
<p>This is an example.</p>
""")

# Summary
doc.add_heading('Summary for Non-Technical Readers', level=1)
doc.add_paragraph("""| Concept | Meaning in Simple Words |
|---------|--------------------------|
| HTML    | A language that builds websites |
| Tag     | A keyword in angled brackets like <p> that tells the browser what to do |
| Browser | A software like Chrome or Firefox that shows websites |
| HTML5   | The latest version with new features |
| Editor  | A tool where you write your website content |
""")

# Real-Life Example
doc.add_heading('Real-Life Example: A Personal Profile Page', level=1)
doc.add_paragraph("""<!DOCTYPE html>
<html>
<head>
  <title>About Me</title>
</head>
<body>
  <h1>Hi, I’m Madhu</h1>
  <p>I love coding, learning, and creating websites.</p>
  <img src="https://via.placeholder.com/150" alt="My photo">
  <h2>Contact Me</h2>
  <p>Email: madhu@example.com</p>
</body>
</html>
""")

# Final Tips
doc.add_heading('Final Tips for Beginners', level=1)
doc.add_paragraph("""- HTML is not a programming language. It does not perform logic — it just describes how content appears.
- Learn it step by step: structure (HTML), style (CSS), behavior (JavaScript).
- Practice by building small pages: About Me, Hobbies, Portfolio.
- Use free platforms like CodePen or JSFiddle to try HTML online.
""")

# Save the Word document
docx_path = "HTML_Introduction_for_Beginners.docx"
doc.save(docx_path)

docx_path

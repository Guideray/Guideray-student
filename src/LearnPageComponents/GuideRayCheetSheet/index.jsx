import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './index.css';
import {
  FaBookOpen,
  FaClipboardList,
  FaCode,
  FaCopy,
  FaCubes,
  FaProjectDiagram,
  FaPython,
  FaRocket,
  FaSearch,
  FaTable,
  FaShieldAlt,
  FaExclamationTriangle
} from 'react-icons/fa'; 
import { editor } from 'monaco-editor';

const GuideRayCheetSheet = ({userData}) => {
  const [cheatsheets, setCheatsheets] = useState([]);
  const { course, topicName } = useParams();
  const [protectionActive, setProtectionActive] = useState(true);
  const mainContentRef = useRef(null);
  const protectionOverlayRef = useRef(null);

  console.log(userData)
  // Enhanced protection against various capture methods
  useEffect(() => {
    if (!protectionActive) return;

    const protectContent = () => {
      // Protection against print
      const disablePrint = (e) => {
        // Override window.print
        const originalPrint = window.print;
        window.print = () => {
          const printOverlay = document.getElementById('print-overlay');
          if (printOverlay) printOverlay.style.display = 'flex';
          setTimeout(() => { if (printOverlay) printOverlay.style.display = 'none'; }, 3000);
          return false;
        };

        return () => {
          window.print = originalPrint;
        };
      };

      // Protection against right-click and context menu
      const disableContextMenu = (e) => {
        e.preventDefault();
        return false;
      };

      // Protection against keyboard shortcuts for print/save
      const disableShortcuts = (e) => {
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 'p' || e.key === 's' || e.key === 'c')) {
          e.preventDefault();
          return false;
        }
      };

      // Protection against developer tools
      const detectDevTools = () => {
        const threshold = 160;
        const check = () => {
          const widthThreshold = window.outerWidth - window.innerWidth > threshold;
          const heightThreshold = window.outerHeight - window.innerHeight > threshold;
          const orientation = widthThreshold || heightThreshold;
          const devToolsOverlay = document.getElementById('devtools-overlay');

          if (orientation && !document.hidden && devToolsOverlay) {
            devToolsOverlay.style.display = 'flex';
          } else if (devToolsOverlay) {
            devToolsOverlay.style.display = 'none';
          }
        };

        setInterval(check, 1000);
      };

      // Protection against full-page screenshot extensions
      const antiScreenshotProtection = () => {
        // Create multiple protection layers
        const protectionLayers = [];
        
        // Layer 1: Dynamic content shifting
        const shiftContent = () => {
          if (mainContentRef.current) {
            const randomShift = Math.random() * 10 - 5;
            mainContentRef.current.style.transform = `translateX(${randomShift}px)`;
          }
        };

        // Layer 2: Add invisible elements that break automated capture
        const addInvisibleElements = () => {
          const overlay = document.createElement('div');
          overlay.className = 'anti-capture-overlay';
          overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            z-index: 9998;
            pointer-events: none;
            opacity: 0;
          `;
          document.body.appendChild(overlay);
          protectionLayers.push(overlay);
        };

        // Layer 3: DOM mutation observer
        const observeDOMChanges = () => {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'attributes' && 
                  mutation.attributeName === 'style' &&
                  mutation.target.classList.contains('anti-capture-overlay')) {
                mutation.target.removeAttribute('style');
              }
            });
          });

          if (protectionOverlayRef.current) {
            observer.observe(protectionOverlayRef.current, {
              attributes: true,
              attributeFilter: ['style']
            });
          }

          return observer;
        };

        shiftContent();
        addInvisibleElements();
        const observer = observeDOMChanges();

        return () => {
          protectionLayers.forEach(layer => {
            if (layer.parentNode) {
              layer.parentNode.removeChild(layer);
            }
          });
          observer.disconnect();
        };
      };

      // Blur content when window loses focus
      const blurOnFocusLoss = () => {
        const handleBlur = () => document.body.classList.add('content-blurred');
        const handleFocus = () => document.body.classList.remove('content-blurred');

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
          window.removeEventListener('blur', handleBlur);
          window.removeEventListener('focus', handleFocus);
          document.body.classList.remove('content-blurred');
        };
      };

      // Add a dynamic watermark
      const addWatermark = () => {
        const watermark = document.createElement('div');
        watermark.className = 'watermark-overlay';
        document.body.appendChild(watermark);
        return () => {
          if (watermark.parentNode) {
            watermark.parentNode.removeChild(watermark);
          }
        };
      };

      // Apply all protections
      const cleanupPrint = disablePrint(); // This now just overrides window.print
      document.addEventListener('contextmenu', disableContextMenu);
      document.addEventListener('keydown', disableShortcuts);
      detectDevTools();
      const cleanupScreenshotProtection = antiScreenshotProtection();
      const cleanupBlur = blurOnFocusLoss();
      const cleanupWatermark = addWatermark();

      // Cleanup function
      return () => {
        document.removeEventListener('contextmenu', disableContextMenu);
        document.removeEventListener('keydown', disableShortcuts);
        cleanupScreenshotProtection();
        cleanupPrint();
        cleanupBlur();
        cleanupWatermark();
      };
    };

    const cleanup = protectContent();
    return cleanup;
  }, [protectionActive]);

  useEffect(() => {
    if (course !== 'python') {
      setCheatsheets([]);
      return;
    }

    const pythonCheatsheets = [
{
  "title": "Object-Oriented Programming: Special Methods",
  "category": "python-basics",
  "items": [
    {
      "id": 1,
      "type": "section",
      "title": "Introduction to Special Methods",
      "description": "Understanding magic methods and their role in Python OOP",
      "content": [
        {
          "subtitle": "🎯 What are Special Methods?",
          "type": "text",
          "content": [
            {
              "title": "Definition",
              "content": "• Special Methods: Also called 'magic methods' or 'dunder methods' (double underscore)\n• Methods with double underscores before and after their names (e.g., __init__)\n• Automatically called by Python in specific situations\n• Enable operator overloading and custom behavior for built-in operations\n• Make custom classes behave like built-in types",
              "explanation": "Special methods are the mechanism Python uses to implement operator overloading and allow classes to define their own behavior for built-in operations."
            },
            {
              "title": "Key Characteristics",
              "content": "• Names surrounded by double underscores: __method__\n• Never called directly by you - Python calls them automatically\n• Enable intuitive object interactions\n• Provide hooks into Python's internal mechanisms\n• Make classes more Pythonic and natural to use",
              "explanation": "Special methods integrate your classes deeply into Python's ecosystem, making them work seamlessly with language features."
            },
            {
              "title": "Common Categories",
              "content": "• Initialization and Construction: __init__, __new__, __del__\n• String Representation: __str__, __repr__, __format__\n• Comparison Operations: __eq__, __lt__, __gt__, etc.\n• Arithmetic Operations: __add__, __sub__, __mul__, etc.\n• Container Operations: __len__, __getitem__, __setitem__, etc.\n• Callable Objects: __call__\n• Attribute Access: __getattr__, __setattr__, __getattribute__",
              "explanation": "Special methods cover all aspects of object behavior from creation to destruction and everything in between."
            }
          ],
          "explanation": "Special methods are Python's way of allowing custom classes to define behavior for built-in operations and operators."
        },
        {
          "subtitle": "🔤 Why Use Special Methods?",
          "type": "text",
          "content": [
            {
              "title": "Benefits",
              "content": "• Intuitive Syntax: Make objects work with standard operators\n• Integration: Work seamlessly with Python built-in functions\n• Readability: Code that reads naturally and expresses intent clearly\n• Flexibility: Customize object behavior for specific use cases\n• Consistency: Make custom classes feel like built-in types",
              "explanation": "Special methods bridge the gap between custom classes and Python's built-in types, making code more expressive."
            },
            {
              "title": "Real-world Impact",
              "content": "• Vector(1, 2) + Vector(3, 4) instead of vector1.add(vector2)\n• len(my_collection) instead of my_collection.length()\n• obj[key] instead of obj.get_item(key)\n• str(obj) producing meaningful output\n• obj() making objects callable like functions",
              "explanation": "Special methods transform awkward method calls into natural, Pythonic expressions."
            }
          ],
          "explanation": "Special methods make custom classes intuitive to use by enabling natural syntax and integration with Python's ecosystem."
        }
      ],
      "explanation": "Special methods are Python's mechanism for operator overloading and customizing object behavior, making classes work naturally with Python's syntax and built-in functions."
    },
    {
      "id": 2,
      "type": "section",
      "title": "Basic Special Methods",
      "description": "Essential magic methods for object initialization and representation",
      "content": [
        {
          "subtitle": "🔤 Object Lifecycle Methods",
          "type": "code",
          "content": [
            {
              "title": "Initialization and Construction",
              "code": "# Basic object lifecycle methods\nprint(\"=== Object Lifecycle Methods ===\")\n\nclass Person:\n    # Class attribute\n    species = \"Homo sapiens\"\n    \n    def __new__(cls, name, age):\n        \"\"\"Called before __init__ - object creation\"\"\"\n        print(f\"__new__ called: Creating new {cls.__name__} instance\")\n        instance = super().__new__(cls)\n        return instance\n    \n    def __init__(self, name, age):\n        \"\"\"Called after __new__ - object initialization\"\"\"\n        print(f\"__init__ called: Initializing {name}\")\n        self.name = name\n        self.age = age\n        self.created_at = \"now\"\n    \n    def __del__(self):\n        \"\"\"Called when object is about to be destroyed\"\"\"\n        print(f\"__del__ called: {self.name} is being destroyed\")\n\nprint(\"1. Creating a person:\")\nperson = Person(\"Alice\", 25)\nprint(f\"Name: {person.name}, Age: {person.age}\")\n\nprint(\"\\n2. String representation methods:\")\n\nclass Product:\n    def __init__(self, name, price, category):\n        self.name = name\n        self.price = price\n        self.category = category\n    \n    def __str__(self):\n        \"\"\"Informal string representation - for end users\"\"\"\n        return f\"{self.name} - ${self.price} ({self.category})\"\n    \n    def __repr__(self):\n        \"\"\"Formal string representation - for developers\"\"\"\n        return f\"Product('{self.name}', {self.price}, '{self.category}')\"\n    \n    def __format__(self, format_spec):\n        \"\"\"Custom formatting\"\"\"\n        if format_spec == 'short':\n            return f\"{self.name}: ${self.price}\"\n        elif format_spec == 'detailed':\n            return f\"Product: {self.name}, Price: ${self.price}, Category: {self.category}\"\n        else:\n            return str(self)\n\nprint(\"\\n3. Testing string representations:\")\nproduct = Product(\"Laptop\", 999.99, \"Electronics\")\n\nprint(f\"str(): {str(product)}\")\nprint(f\"repr(): {repr(product)}\")\nprint(f\"format(): {format(product, 'short')}\")\nprint(f\"format(): {format(product, 'detailed')}\")\n\n# In interactive interpreter, just typing 'product' would show repr\nprint(f\"In console would show: {product!r}\")  # Force repr\n\nprint(\"\\n4. Object destruction:\")\nprint(\"Deleting person object...\")\ndel person\n\nprint(\"\\n5. Multiple objects lifecycle:\")\n\ndef create_temporary_person():\n    \"\"\"Function to demonstrate object lifecycle\"\"\"\n    temp_person = Person(\"Temp\", 30)\n    return f\"Temporary person: {temp_person.name}\"\n\nresult = create_temporary_person()\nprint(result)\nprint(\"Function finished - temporary object should be destroyed\")\n\n# Expected Output:\n# === Object Lifecycle Methods ===\n# 1. Creating a person:\n# __new__ called: Creating new Person instance\n# __init__ called: Initializing Alice\n# Name: Alice, Age: 25\n# \n# 2. String representation methods:\n# \n# 3. Testing string representations:\n# str(): Laptop - $999.99 (Electronics)\n# repr(): Product('Laptop', 999.99, 'Electronics')\n# format(): Laptop: $999.99\n# format(): Product: Laptop, Price: $999.99, Category: Electronics\n# In console would show: Product('Laptop', 999.99, 'Electronics')\n# \n# 4. Object destruction:\n# Deleting person object...\n# __del__ called: Alice is being destroyed\n# \n# 5. Multiple objects lifecycle:\n# __new__ called: Creating new Person instance\n# __init__ called: Initializing Temp\n# __del__ called: Temp is being destroyed\n# Temporary person: Temp\n# Function finished - temporary object should be destroyed",
              "output": "=== Object Lifecycle Methods ===\n1. Creating a person:\n__new__ called: Creating new Person instance\n__init__ called: Initializing Alice\nName: Alice, Age: 25\n\n2. String representation methods:\n\n3. Testing string representations:\nstr(): Laptop - $999.99 (Electronics)\nrepr(): Product('Laptop', 999.99, 'Electronics')\nformat(): Laptop: $999.99\nformat(): Product: Laptop, Price: $999.99, Category: Electronics\nIn console would show: Product('Laptop', 999.99, 'Electronics')\n\n4. Object destruction:\nDeleting person object...\n__del__ called: Alice is being destroyed\n\n5. Multiple objects lifecycle:\n__new__ called: Creating new Person instance\n__init__ called: Initializing Temp\n__del__ called: Temp is being destroyed\nTemporary person: Temp\nFunction finished - temporary object should be destroyed",
              "explanation": "Basic lifecycle methods control object creation (__new__), initialization (__init__), and destruction (__del__). String methods provide meaningful representations for different contexts."
            }
          ],
          "explanation": "Basic special methods handle object lifecycle and representation, making objects meaningful when printed and properly managed throughout their existence."
        }
      ],
      "explanation": "Basic special methods like __init__, __str__, and __repr__ are essential for object initialization and providing meaningful string representations."
    },
    {
      "id": 3,
      "type": "section",
      "title": "Comparison Methods",
      "description": "Magic methods for object comparison and ordering",
      "content": [
        {
          "subtitle": "🔤 Rich Comparison Methods",
          "type": "code",
          "content": [
            {
              "title": "Complete Comparison Implementation",
              "code": "# Rich comparison methods for custom classes\nprint(\"=== Comparison Methods ===\")\n\nclass Student:\n    def __init__(self, name, grade, gpa):\n        self.name = name\n        self.grade = grade\n        self.gpa = gpa\n    \n    def __str__(self):\n        return f\"{self.name} (Grade {self.grade}, GPA: {self.gpa})\"\n    \n    # Equality comparisons\n    def __eq__(self, other):\n        \"\"\"Equality: student1 == student2\"\"\"\n        if not isinstance(other, Student):\n            return NotImplemented\n        return self.gpa == other.gpa and self.grade == other.grade\n    \n    def __ne__(self, other):\n        \"\"\"Inequality: student1 != student2\"\"\"\n        return not self.__eq__(other)\n    \n    # Ordering comparisons (by GPA)\n    def __lt__(self, other):\n        \"\"\"Less than: student1 < student2\"\"\"\n        if not isinstance(other, Student):\n            return NotImplemented\n        return self.gpa < other.gpa\n    \n    def __le__(self, other):\n        \"\"\"Less than or equal: student1 <= student2\"\"\"\n        if not isinstance(other, Student):\n            return NotImplemented\n        return self.gpa <= other.gpa\n    \n    def __gt__(self, other):\n        \"\"\"Greater than: student1 > student2\"\"\"\n        if not isinstance(other, Student):\n            return NotImplemented\n        return self.gpa > other.gpa\n    \n    def __ge__(self, other):\n        \"\"\"Greater than or equal: student1 >= student2\"\"\"\n        if not isinstance(other, Student):\n            return NotImplemented\n        return self.gpa >= other.gpa\n    \n    # Hash for use in sets and dictionaries\n    def __hash__(self):\n        return hash((self.name, self.grade, self.gpa))\n\nprint(\"1. Creating students:\")\nstudents = [\n    Student(\"Alice\", 12, 3.8),\n    Student(\"Bob\", 11, 3.5),\n    Student(\"Charlie\", 12, 3.9),\n    Student(\"Diana\", 11, 3.5)  # Same GPA as Bob\n]\n\nfor student in students:\n    print(f\"  {student}\")\n\nprint(\"\\n2. Equality comparisons:\")\nprint(f\"Alice == Bob: {students[0] == students[1]}\")\nprint(f\"Bob == Diana: {students[1] == students[3]}\")\nprint(f\"Alice != Charlie: {students[0] != students[2]}\")\n\nprint(\"\\n3. Ordering comparisons:\")\nprint(f\"Alice < Charlie: {students[0] < students[2]}\")\nprint(f\"Bob > Diana: {students[1] > students[3]}\")\nprint(f\"Alice >= Bob: {students[0] >= students[1]}\")\n\nprint(\"\\n4. Sorting students by GPA:\")\nsorted_students = sorted(students)\nfor student in sorted_students:\n    print(f\"  {student}\")\n\nprint(\"\\n5. Using in data structures:\")\n# Sets use __hash__ and __eq__\nstudent_set = {students[0], students[1], students[3]}\nprint(f\"Unique students in set: {len(student_set)}\")\n\nprint(\"\\n6. Advanced comparison with @total_ordering:\")\n\nfrom functools import total_ordering\n\n@total_ordering\nclass Book:\n    def __init__(self, title, author, pages):\n        self.title = title\n        self.author = author\n        self.pages = pages\n    \n    def __str__(self):\n        return f\"'{self.title}' by {self.author} ({self.pages} pages)\"\n    \n    def __eq__(self, other):\n        if not isinstance(other, Book):\n            return NotImplemented\n        return self.pages == other.pages\n    \n    def __lt__(self, other):\n        if not isinstance(other, Book):\n            return NotImplemented\n        return self.pages < other.pages\n\nprint(\"\\nUsing @total_ordering (only need __eq__ and one ordering method):\")\nbook1 = Book(\"Python Basics\", \"John Doe\", 300)\nbook2 = Book(\"Advanced Python\", \"Jane Smith\", 500)\n\nprint(f\"book1: {book1}\")\nprint(f\"book2: {book2}\")\nprint(f\"book1 == book2: {book1 == book2}\")\nprint(f\"book1 != book2: {book1 != book2}\")\nprint(f\"book1 < book2: {book1 < book2}\")\nprint(f\"book1 <= book2: {book1 <= book2}\")\nprint(f\"book1 > book2: {book1 > book2}\")\nprint(f\"book1 >= book2: {book1 >= book2}\")\n\n# Expected Output:\n# === Comparison Methods ===\n# 1. Creating students:\n#   Alice (Grade 12, GPA: 3.8)\n#   Bob (Grade 11, GPA: 3.5)\n#   Charlie (Grade 12, GPA: 3.9)\n#   Diana (Grade 11, GPA: 3.5)\n# \n# 2. Equality comparisons:\n# Alice == Bob: False\n# Bob == Diana: True\n# Alice != Charlie: True\n# \n# 3. Ordering comparisons:\n# Alice < Charlie: True\n# Bob > Diana: False\n# Alice >= Bob: True\n# \n# 4. Sorting students by GPA:\n#   Bob (Grade 11, GPA: 3.5)\n#   Diana (Grade 11, GPA: 3.5)\n#   Alice (Grade 12, GPA: 3.8)\n#   Charlie (Grade 12, GPA: 3.9)\n# \n# 5. Using in data structures:\n# Unique students in set: 2\n# \n# 6. Advanced comparison with @total_ordering:\n# \n# Using @total_ordering (only need __eq__ and one ordering method):\n# book1: 'Python Basics' by John Doe (300 pages)\n# book2: 'Advanced Python' by Jane Smith (500 pages)\n# book1 == book2: False\n# book1 != book2: True\n# book1 < book2: True\n# book1 <= book2: True\n# book1 > book2: False\n# book1 >= book2: False",
              "output": "=== Comparison Methods ===\n1. Creating students:\n  Alice (Grade 12, GPA: 3.8)\n  Bob (Grade 11, GPA: 3.5)\n  Charlie (Grade 12, GPA: 3.9)\n  Diana (Grade 11, GPA: 3.5)\n\n2. Equality comparisons:\nAlice == Bob: False\nBob == Diana: True\nAlice != Charlie: True\n\n3. Ordering comparisons:\nAlice < Charlie: True\nBob > Diana: False\nAlice >= Bob: True\n\n4. Sorting students by GPA:\n  Bob (Grade 11, GPA: 3.5)\n  Diana (Grade 11, GPA: 3.5)\n  Alice (Grade 12, GPA: 3.8)\n  Charlie (Grade 12, GPA: 3.9)\n\n5. Using in data structures:\nUnique students in set: 2\n\n6. Advanced comparison with @total_ordering:\n\nUsing @total_ordering (only need __eq__ and one ordering method):\nbook1: 'Python Basics' by John Doe (300 pages)\nbook2: 'Advanced Python' by Jane Smith (500 pages)\nbook1 == book2: False\nbook1 != book2: True\nbook1 < book2: True\nbook1 <= book2: True\nbook1 > book2: False\nbook1 >= book2: False",
              "explanation": "Comparison methods allow objects to be compared using standard operators (==, !=, <, >, etc.) and work with built-in functions like sorted(). The @total_ordering decorator reduces the number of methods needed."
            }
          ],
          "explanation": "Comparison methods enable objects to be compared using standard operators and work with sorting functions, making custom classes behave like built-in types."
        }
      ],
      "explanation": "Rich comparison methods allow objects to define their own comparison logic, enabling natural syntax like obj1 < obj2 and compatibility with sorting operations."
    },
    {
      "id": 4,
      "type": "section",
      "title": "Arithmetic Operations",
      "description": "Magic methods for mathematical operations and operator overloading",
      "content": [
        {
          "subtitle": "🔤 Mathematical Operator Methods",
          "type": "code",
          "content": [
            {
              "title": "Complete Arithmetic Implementation",
              "code": "# Arithmetic operator overloading\nprint(\"=== Arithmetic Operations ===\")\n\nclass Vector:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    def __str__(self):\n        return f\"Vector({self.x}, {self.y})\"\n    \n    def __repr__(self):\n        return f\"Vector({self.x}, {self.y})\"\n    \n    # Basic arithmetic\n    def __add__(self, other):\n        \"\"\"Vector addition: v1 + v2\"\"\"\n        if isinstance(other, Vector):\n            return Vector(self.x + other.x, self.y + other.y)\n        return NotImplemented\n    \n    def __sub__(self, other):\n        \"\"\"Vector subtraction: v1 - v2\"\"\"\n        if isinstance(other, Vector):\n            return Vector(self.x - other.x, self.y - other.y)\n        return NotImplemented\n    \n    def __mul__(self, scalar):\n        \"\"\"Scalar multiplication: v1 * 5\"\"\"\n        if isinstance(scalar, (int, float)):\n            return Vector(self.x * scalar, self.y * scalar)\n        return NotImplemented\n    \n    def __rmul__(self, scalar):\n        \"\"\"Reverse multiplication: 5 * v1\"\"\"\n        return self.__mul__(scalar)\n    \n    def __truediv__(self, scalar):\n        \"\"\"True division: v1 / 2\"\"\"\n        if isinstance(scalar, (int, float)):\n            return Vector(self.x / scalar, self.y / scalar)\n        return NotImplemented\n    \n    # In-place operations\n    def __iadd__(self, other):\n        \"\"\"In-place addition: v1 += v2\"\"\"\n        if isinstance(other, Vector):\n            self.x += other.x\n            self.y += other.y\n            return self\n        return NotImplemented\n    \n    def __isub__(self, other):\n        \"\"\"In-place subtraction: v1 -= v2\"\"\"\n        if isinstance(other, Vector):\n            self.x -= other.x\n            self.y -= other.y\n            return self\n        return NotImplemented\n    \n    # Unary operators\n    def __neg__(self):\n        \"\"\"Unary negative: -v1\"\"\"\n        return Vector(-self.x, -self.y)\n    \n    def __pos__(self):\n        \"\"\"Unary positive: +v1\"\"\"\n        return Vector(+self.x, +self.y)\n    \n    def __abs__(self):\n        \"\"\"Absolute value (magnitude): abs(v1)\"\"\"\n        return (self.x ** 2 + self.y ** 2) ** 0.5\n    \n    # Utility methods\n    def dot_product(self, other):\n        \"\"\"Dot product of two vectors\"\"\"\n        if isinstance(other, Vector):\n            return self.x * other.x + self.y * other.y\n        return None\n    \n    def magnitude(self):\n        \"\"\"Vector magnitude\"\"\"\n        return abs(self)\n\nprint(\"1. Creating vectors:\")\nv1 = Vector(2, 3)\nv2 = Vector(1, 4)\nprint(f\"v1 = {v1}\")\nprint(f\"v2 = {v2}\")\n\nprint(\"\\n2. Basic arithmetic operations:\")\nprint(f\"v1 + v2 = {v1 + v2}\")\nprint(f\"v1 - v2 = {v1 - v2}\")\nprint(f\"v1 * 3 = {v1 * 3}\")\nprint(f\"2 * v1 = {2 * v1}\")  # Uses __rmul__\nprint(f\"v1 / 2 = {v1 / 2}\")\n\nprint(\"\\n3. Unary operations:\")\nprint(f\"-v1 = {-v1}\")\nprint(f\"+v1 = {+v1}\")\nprint(f\"abs(v1) = {abs(v1):.2f}\")\n\nprint(\"\\n4. In-place operations:\")\nv3 = Vector(5, 5)\nprint(f\"Before +=: {v3}\")\nv3 += Vector(1, 1)\nprint(f\"After +=: {v3}\")\n\nprint(\"\\n5. Dot product and magnitude:\")\nprint(f\"v1 · v2 = {v1.dot_product(v2)}\")\nprint(f\"|v1| = {v1.magnitude():.2f}\")\n\nprint(\"\\n6. Complex number example:\")\n\nclass ComplexNumber:\n    def __init__(self, real, imag):\n        self.real = real\n        self.imag = imag\n    \n    def __str__(self):\n        return f\"{self.real} + {self.imag}i\"\n    \n    def __add__(self, other):\n        if isinstance(other, ComplexNumber):\n            return ComplexNumber(self.real + other.real, self.imag + other.imag)\n        return NotImplemented\n    \n    def __sub__(self, other):\n        if isinstance(other, ComplexNumber):\n            return ComplexNumber(self.real - other.real, self.imag - other.imag)\n        return NotImplemented\n    \n    def __mul__(self, other):\n        if isinstance(other, ComplexNumber):\n            real = self.real * other.real - self.imag * other.imag\n            imag = self.real * other.imag + self.imag * other.real\n            return ComplexNumber(real, imag)\n        return NotImplemented\n    \n    def __abs__(self):\n        return (self.real ** 2 + self.imag ** 2) ** 0.5\n    \n    def conjugate(self):\n        return ComplexNumber(self.real, -self.imag)\n\nc1 = ComplexNumber(3, 4)\nc2 = ComplexNumber(1, 2)\n\nprint(f\"c1 = {c1}\")\nprint(f\"c2 = {c2}\")\nprint(f\"c1 + c2 = {c1 + c2}\")\nprint(f\"c1 - c2 = {c1 - c2}\")\nprint(f\"c1 * c2 = {c1 * c2}\")\nprint(f\"|c1| = {abs(c1)}\")\nprint(f\"Conjugate of c1 = {c1.conjugate()}\")\n\n# Expected Output:\n# === Arithmetic Operations ===\n# 1. Creating vectors:\n# v1 = Vector(2, 3)\n# v2 = Vector(1, 4)\n# \n# 2. Basic arithmetic operations:\n# v1 + v2 = Vector(3, 7)\n# v1 - v2 = Vector(1, -1)\n# v1 * 3 = Vector(6, 9)\n# 2 * v1 = Vector(4, 6)\n# v1 / 2 = Vector(1.0, 1.5)\n# \n# 3. Unary operations:\n# -v1 = Vector(-2, -3)\n# +v1 = Vector(2, 3)\n# abs(v1) = 3.61\n# \n# 4. In-place operations:\n# Before +=: Vector(5, 5)\n# After +=: Vector(6, 6)\n# \n# 5. Dot product and magnitude:\n# v1 · v2 = 14\n# |v1| = 3.61\n# \n# 6. Complex number example:\n# c1 = 3 + 4i\n# c2 = 1 + 2i\n# c1 + c2 = 4 + 6i\n# c1 - c2 = 2 + 2i\n# c1 * c2 = -5 + 10i\n# |c1| = 5.0\n# Conjugate of c1 = 3 + -4i",
              "output": "=== Arithmetic Operations ===\n1. Creating vectors:\nv1 = Vector(2, 3)\nv2 = Vector(1, 4)\n\n2. Basic arithmetic operations:\nv1 + v2 = Vector(3, 7)\nv1 - v2 = Vector(1, -1)\nv1 * 3 = Vector(6, 9)\n2 * v1 = Vector(4, 6)\nv1 / 2 = Vector(1.0, 1.5)\n\n3. Unary operations:\n-v1 = Vector(-2, -3)\n+v1 = Vector(2, 3)\nabs(v1) = 3.61\n\n4. In-place operations:\nBefore +=: Vector(5, 5)\nAfter +=: Vector(6, 6)\n\n5. Dot product and magnitude:\nv1 · v2 = 14\n|v1| = 3.61\n\n6. Complex number example:\nc1 = 3 + 4i\nc2 = 1 + 2i\nc1 + c2 = 4 + 6i\nc1 - c2 = 2 + 2i\nc1 * c2 = -5 + 10i\n|c1| = 5.0\nConjugate of c1 = 3 + -4i",
              "explanation": "Arithmetic methods allow custom classes to define behavior for mathematical operations. Key methods include __add__, __sub__, __mul__ for basic operations, and __radd__, __rsub__ for reverse operations when the left operand doesn't support the operation."
            }
          ],
          "explanation": "Arithmetic special methods enable mathematical operations on custom objects, making them work with standard operators like +, -, *, / and supporting both regular and in-place operations."
        }
      ],
      "explanation": "Arithmetic operator methods allow custom classes to define mathematical operations, supporting both regular operations (a + b) and in-place operations (a += b) with proper handling of reverse operations."
    },
    {
      "id": 5,
      "type": "section",
      "title": "Container Methods",
      "description": "Magic methods for making objects behave like containers",
      "content": [
        {
          "subtitle": "🔤 Container Protocol Methods",
          "type": "code",
          "content": [
            {
              "title": "Making Objects Act Like Containers",
              "code": "# Container protocol implementation\nprint(\"=== Container Methods ===\")\n\nclass Playlist:\n    def __init__(self, name):\n        self.name = name\n        self.songs = []\n    \n    def __str__(self):\n        return f\"Playlist '{self.name}' with {len(self)} songs\"\n    \n    # Basic container methods\n    def __len__(self):\n        \"\"\"Length: len(playlist)\"\"\"\n        return len(self.songs)\n    \n    def __getitem__(self, index):\n        \"\"\"Indexing: playlist[0] or playlist[1:5]\"\"\"\n        if isinstance(index, slice):\n            # Handle slicing\n            return self.songs[index]\n        else:\n            # Handle single index\n            return self.songs[index]\n    \n    def __setitem__(self, index, value):\n        \"\"\"Assignment: playlist[0] = 'New Song'\"\"\"\n        self.songs[index] = value\n    \n    def __delitem__(self, index):\n        \"\"\"Deletion: del playlist[0]\"\"\"\n        del self.songs[index]\n    \n    def __contains__(self, item):\n        \"\"\"Membership: 'Song Name' in playlist\"\"\"\n        return item in self.songs\n    \n    def __iter__(self):\n        \"\"\"Iteration: for song in playlist\"\"\"\n        return iter(self.songs)\n    \n    def __reversed__(self):\n        \"\"\"Reverse iteration: reversed(playlist)\"\"\"\n        return reversed(self.songs)\n    \n    # Additional useful methods\n    def add_song(self, song):\n        self.songs.append(song)\n    \n    def clear(self):\n        self.songs.clear()\n\nprint(\"1. Creating and using playlist:\")\nplaylist = Playlist(\"My Favorites\")\nplaylist.add_song(\"Song A\")\nplaylist.add_song(\"Song B\")\nplaylist.add_song(\"Song C\")\nplaylist.add_song(\"Song D\")\nplaylist.add_song(\"Song E\")\n\nprint(f\"Playlist: {playlist}\")\nprint(f\"Length: {len(playlist)}\")\n\nprint(\"\\n2. Indexing and slicing:\")\nprint(f\"First song: {playlist[0]}\")\nprint(f\"Last song: {playlist[-1]}\")\nprint(f\"Songs 1-3: {playlist[1:4]}\")\n\nprint(\"\\n3. Membership testing:\")\nprint(f\"'Song B' in playlist: {'Song B' in playlist}\")\nprint(f\"'Song Z' in playlist: {'Song Z' in playlist}\")\n\nprint(\"\\n4. Iteration:\")\nprint(\"All songs:\")\nfor i, song in enumerate(playlist, 1):\n    print(f\"  {i}. {song}\")\n\nprint(\"\\n5. Reverse iteration:\")\nprint(\"Songs in reverse:\")\nfor song in reversed(playlist):\n    print(f\"  - {song}\")\n\nprint(\"\\n6. Modification:\")\nprint(\"Before modification:\", playlist.songs)\nplaylist[1] = \"Updated Song B\"\ndel playlist[3]\nprint(\"After modification:\", playlist.songs)\n\nprint(\"\\n7. Dictionary-like container:\")\n\nclass Config:\n    def __init__(self):\n        self._data = {}\n    \n    def __getitem__(self, key):\n        \"\"\"Access: config['key']\"\"\"\n        return self._data[key]\n    \n    def __setitem__(self, key, value):\n        \"\"\"Assignment: config['key'] = value\"\"\"\n        self._data[key] = value\n    \n    def __delitem__(self, key):\n        \"\"\"Deletion: del config['key']\"\"\"\n        del self._data[key]\n    \n    def __contains__(self, key):\n        \"\"\"Membership: 'key' in config\"\"\"\n        return key in self._data\n    \n    def __len__(self):\n        return len(self._data)\n    \n    def __iter__(self):\n        return iter(self._data)\n    \n    def keys(self):\n        return self._data.keys()\n    \n    def values(self):\n        return self._data.values()\n    \n    def items(self):\n        return self._data.items()\n\nconfig = Config()\nconfig['host'] = 'localhost'\nconfig['port'] = 8080\nconfig['debug'] = True\n\nprint(f\"Config items: {len(config)}\")\nprint(f\"Host: {config['host']}\")\nprint(f\"'port' in config: {'port' in config}\")\n\nprint(\"\\nAll config entries:\")\nfor key, value in config.items():\n    print(f\"  {key}: {value}\")\n\nprint(\"\\n8. Advanced container with custom behavior:\")\n\nclass SmartList:\n    def __init__(self, *args):\n        self._data = list(args)\n    \n    def __len__(self):\n        return len(self._data)\n    \n    def __getitem__(self, index):\n        # Support negative indexing and bounds checking\n        if isinstance(index, slice):\n            return self._data[index]\n        \n        if index < 0:\n            index = len(self._data) + index\n        \n        if 0 <= index < len(self._data):\n            return self._data[index]\n        else:\n            raise IndexError(\"Index out of range\")\n    \n    def __setitem__(self, index, value):\n        if index < 0:\n            index = len(self._data) + index\n        \n        if 0 <= index < len(self._data):\n            self._data[index] = value\n        else:\n            raise IndexError(\"Index out of range\")\n    \n    def append(self, item):\n        self._data.append(item)\n    \n    def __str__(self):\n        return f\"SmartList{self._data}\"\n\nsmart_list = SmartList(1, 2, 3, 4, 5)\nprint(f\"Original: {smart_list}\")\nprint(f\"smart_list[-1]: {smart_list[-1]}\")\nprint(f\"smart_list[1:4]: {smart_list[1:4]}\")\n\n# Expected Output:\n# === Container Methods ===\n# 1. Creating and using playlist:\n# Playlist 'My Favorites' with 5 songs\n# Length: 5\n# \n# 2. Indexing and slicing:\n# First song: Song A\n# Last song: Song E\n# Songs 1-3: ['Song B', 'Song C', 'Song D']\n# \n# 3. Membership testing:\n# 'Song B' in playlist: True\n# 'Song Z' in playlist: False\n# \n# 4. Iteration:\n# All songs:\n#   1. Song A\n#   2. Song B\n#   3. Song C\n#   4. Song D\n#   5. Song E\n# \n# 5. Reverse iteration:\n# Songs in reverse:\n#   - Song E\n#   - Song D\n#   - Song C\n#   - Song B\n#   - Song A\n# \n# 6. Modification:\n# Before modification: ['Song A', 'Song B', 'Song C', 'Song D', 'Song E']\n# After modification: ['Song A', 'Updated Song B', 'Song C', 'Song E']\n# \n# 7. Dictionary-like container:\n# Config items: 3\n# Host: localhost\n# 'port' in config: True\n# \n# All config entries:\n#   host: localhost\n#   port: 8080\n#   debug: True\n# \n# 8. Advanced container with custom behavior:\n# Original: SmartList[1, 2, 3, 4, 5]\n# smart_list[-1]: 5\n# smart_list[1:4]: [2, 3, 4]",
              "output": "=== Container Methods ===\n1. Creating and using playlist:\nPlaylist 'My Favorites' with 5 songs\nLength: 5\n\n2. Indexing and slicing:\nFirst song: Song A\nLast song: Song E\nSongs 1-3: ['Song B', 'Song C', 'Song D']\n\n3. Membership testing:\n'Song B' in playlist: True\n'Song Z' in playlist: False\n\n4. Iteration:\nAll songs:\n  1. Song A\n  2. Song B\n  3. Song C\n  4. Song D\n  5. Song E\n\n5. Reverse iteration:\nSongs in reverse:\n  - Song E\n  - Song D\n  - Song C\n  - Song B\n  - Song A\n\n6. Modification:\nBefore modification: ['Song A', 'Song B', 'Song C', 'Song D', 'Song E']\nAfter modification: ['Song A', 'Updated Song B', 'Song C', 'Song E']\n\n7. Dictionary-like container:\nConfig items: 3\nHost: localhost\n'port' in config: True\n\nAll config entries:\n  host: localhost\n  port: 8080\n  debug: True\n\n8. Advanced container with custom behavior:\nOriginal: SmartList[1, 2, 3, 4, 5]\nsmart_list[-1]: 5\nsmart_list[1:4]: [2, 3, 4]",
              "explanation": "Container methods allow objects to behave like built-in containers (lists, dictionaries, etc.). Key methods include __len__, __getitem__, __setitem__, __delitem__, __contains__, and __iter__ for full container protocol support."
            }
          ],
          "explanation": "Container protocol methods enable objects to behave like built-in containers, supporting indexing, slicing, iteration, membership testing, and other container operations."
        }
      ],
      "explanation": "Container methods make custom objects behave like built-in containers, supporting operations like indexing, iteration, membership testing, and slicing with natural syntax."
    },
    {
      "id": 6,
      "type": "section",
      "title": "Advanced Special Methods",
      "description": "Callable objects, context managers, and attribute control",
      "content": [
        {
          "subtitle": "🔤 Callable Objects and Context Managers",
          "type": "code",
          "content": [
            {
              "title": "Making Objects Callable and Context-Aware",
              "code": "# Advanced special methods\nprint(\"=== Advanced Special Methods ===\")\n\nprint(\"1. Callable Objects with __call__:\")\n\nclass Multiplier:\n    def __init__(self, factor):\n        self.factor = factor\n    \n    def __call__(self, x):\n        \"\"\"Make instance callable: multiplier(5)\"\"\"\n        return x * self.factor\n    \n    def __str__(self):\n        return f\"Multiplier by {self.factor}\"\n\nclass Counter:\n    def __init__(self):\n        self.count = 0\n    \n    def __call__(self):\n        \"\"\"Callable that maintains state\"\"\"\n        self.count += 1\n        return self.count\n    \n    def reset(self):\n        self.count = 0\n\nprint(\"Using callable objects:\")\ndouble = Multiplier(2)\ntriple = Multiplier(3)\n\nprint(f\"double(5) = {double(5)}\")\nprint(f\"triple(5) = {triple(5)}\")\n\ncounter = Counter()\nprint(f\"Counter: {counter()}, {counter()}, {counter()}\")\n\nprint(\"\\n2. Context Managers with __enter__ and __exit__:\")\n\nclass Timer:\n    def __init__(self, name):\n        self.name = name\n    \n    def __enter__(self):\n        \"\"\"Called when entering 'with' block\"\"\"\n        import time\n        self.start = time.time()\n        print(f\"Starting {self.name}...\")\n        return self\n    \n    def __exit__(self, exc_type, exc_val, exc_tb):\n        \"\"\"Called when exiting 'with' block\"\"\"\n        import time\n        elapsed = time.time() - self.start\n        print(f\"Finished {self.name} in {elapsed:.2f} seconds\")\n        # Return False to propagate exceptions, True to suppress them\n        return False\n\nclass FileHandler:\n    def __init__(self, filename, mode):\n        self.filename = filename\n        self.mode = mode\n        self.file = None\n    \n    def __enter__(self):\n        self.file = open(self.filename, self.mode)\n        return self.file\n    \n    def __exit__(self, exc_type, exc_val, exc_tb):\n        if self.file:\n            self.file.close()\n        print(f\"File {self.filename} closed\")\n        return False  # Don't suppress exceptions\n\nprint(\"Using context managers:\")\n\n# Simulate timing\nwith Timer(\"calculation\"):\n    # Simulate some work\n    result = sum(i * i for i in range(100000))\n    print(f\"Calculation result: {result}\")\n\nprint(\"\\n3. Attribute Control Methods:\")\n\nclass ValidatedPerson:\n    def __init__(self, name, age):\n        self._name = None\n        self._age = None\n        self.name = name  # Uses __setattr__\n        self.age = age    # Uses __setattr__\n    \n    def __getattr__(self, name):\n        \"\"\"Called when attribute not found normally\"\"\"\n        if name == 'full_info':\n            return f\"{self.name}, {self.age} years old\"\n        raise AttributeError(f\"'{type(self).__name__}' object has no attribute '{name}'\")\n    \n    def __setattr__(self, name, value):\n        \"\"\"Called on every attribute assignment\"\"\"\n        if name == 'name':\n            if not isinstance(value, str) or len(value) < 2:\n                raise ValueError(\"Name must be a string with at least 2 characters\")\n            self.__dict__['_name'] = value\n        elif name == 'age':\n            if not isinstance(value, int) or value < 0 or value > 150:\n                raise ValueError(\"Age must be an integer between 0 and 150\")\n            self.__dict__['_age'] = value\n        else:\n            # Default behavior for other attributes\n            self.__dict__[name] = value\n    \n    def __getattribute__(self, name):\n        \"\"\"Called for every attribute access\"\"\"\n        # Add logging or other behavior here\n        if name in ['_name', '_age']:\n            print(f\"Accessing {name}\")\n        return super().__getattribute__(name)\n    \n    @property\n    def name(self):\n        return self._name\n    \n    @name.setter\n    def name(self, value):\n        self.__setattr__('name', value)\n    \n    @property\n    def age(self):\n        return self._age\n    \n    @age.setter\n    def age(self, value):\n        self.__setattr__('age', value)\n    \n    def __str__(self):\n        return f\"Person(name={self.name}, age={self.age})\"\n\nprint(\"Using attribute control:\")\nperson = ValidatedPerson(\"Alice\", 25)\nprint(f\"Person: {person}\")\n\n# This will use __getattr__\nprint(f\"Full info: {person.full_info}\")\n\n# Validation in action\ntry:\n    person.age = 200  # Invalid age\n    print(\"Age set successfully\")\nexcept ValueError as e:\n    print(f\"Error: {e}\")\n\ntry:\n    person.name = \"A\"  # Invalid name\n    print(\"Name set successfully\")\nexcept ValueError as e:\n    print(f\"Error: {e}\")\n\nprint(\"\\n4. Advanced __getitem__ with multiple indices:\")\n\nclass Matrix:\n    def __init__(self, rows, cols):\n        self.rows = rows\n        self.cols = cols\n        self.data = [[0] * cols for _ in range(rows)]\n    \n    def __getitem__(self, index):\n        \"\"\"Support matrix[row][col] and matrix[row, col] syntax\"\"\"\n        if isinstance(index, tuple):\n            # matrix[row, col] syntax\n            row, col = index\n            return self.data[row][col]\n        else:\n            # matrix[row] syntax\n            return self.data[index]\n    \n    def __setitem__(self, index, value):\n        if isinstance(index, tuple):\n            row, col = index\n            self.data[row][col] = value\n        else:\n            # If setting entire row\n            self.data[index] = value\n    \n    def __str__(self):\n        return '\\n'.join(' '.join(str(cell) for cell in row) for row in self.data)\n\nmatrix = Matrix(3, 3)\nmatrix[0, 0] = 1\nmatrix[1, 1] = 2\nmatrix[2, 2] = 3\n\nprint(\"Matrix:\")\nprint(matrix)\nprint(f\"matrix[1, 1] = {matrix[1, 1]}\")\n\n# Expected Output:\n# === Advanced Special Methods ===\n# 1. Callable Objects with __call__:\n# Using callable objects:\n# double(5) = 10\n# triple(5) = 15\n# Counter: 1, 2, 3\n# \n# 2. Context Managers with __enter__ and __exit__:\n# Using context managers:\n# Starting calculation...\n# Calculation result: 333328333350000\n# Finished calculation in 0.01 seconds\n# \n# 3. Attribute Control Methods:\n# Using attribute control:\n# Accessing _name\n# Accessing _age\n# Person: Person(name=Alice, age=25)\n# Accessing _name\n# Accessing _age\n# Full info: Alice, 25 years old\n# Error: Age must be an integer between 0 and 150\n# Error: Name must be a string with at least 2 characters\n# \n# 4. Advanced __getitem__ with multiple indices:\n# Matrix:\n# 1 0 0\n# 0 2 0\n# 0 0 3\n# matrix[1, 1] = 2",
              "output": "=== Advanced Special Methods ===\n1. Callable Objects with __call__:\nUsing callable objects:\ndouble(5) = 10\ntriple(5) = 15\nCounter: 1, 2, 3\n\n2. Context Managers with __enter__ and __exit__:\nUsing context managers:\nStarting calculation...\nCalculation result: 333328333350000\nFinished calculation in 0.01 seconds\n\n3. Attribute Control Methods:\nUsing attribute control:\nAccessing _name\nAccessing _age\nPerson: Person(name=Alice, age=25)\nAccessing _name\nAccessing _age\nFull info: Alice, 25 years old\nError: Age must be an integer between 0 and 150\nError: Name must be a string with at least 2 characters\n\n4. Advanced __getitem__ with multiple indices:\nMatrix:\n1 0 0\n0 2 0\n0 0 3\nmatrix[1, 1] = 2",
              "explanation": "Advanced special methods include __call__ for making objects callable, __enter__/__exit__ for context managers, and attribute control methods (__getattr__, __setattr__, __getattribute__) for custom attribute access behavior."
            }
          ],
          "explanation": "Advanced special methods enable powerful features like callable objects, context managers for resource management, and fine-grained control over attribute access and assignment."
        }
      ],
      "explanation": "Advanced special methods provide capabilities like making objects callable, creating context managers for resource handling, and controlling attribute access with validation and custom behavior."
    },
    {
      "id": 7,
      "type": "section",
      "title": "Summary & Best Practices",
      "description": "Guidelines for using special methods effectively",
      "content": [
        {
          "subtitle": "✅ Special Methods Best Practices",
          "type": "text",
          "content": [
            {
              "title": "Design Principles",
              "content": "• Follow the Principle of Least Astonishment - behavior should be intuitive\n• Maintain consistency with built-in types\n• Implement related methods together (e.g., __eq__ with __hash__)\n• Use @total_ordering to reduce boilerplate for comparisons\n• Return NotImplemented for unsupported operations",
              "explanation": "Special methods should make classes feel natural and predictable, following Python's conventions."
            },
            {
              "title": "Implementation Tips",
              "content": "• Always provide __repr__ for debugging\n• Make __str__ user-friendly and __repr__ unambiguous\n• Use properties with __setattr__ for validation\n• Be careful with __getattribute__ - it affects every attribute access\n• Use context managers for resource cleanup",
              "explanation": "Proper implementation ensures special methods work reliably and efficiently."
            },
            {
              "title": "Common Pitfalls",
              "content": "• Don't forget __hash__ when overriding __eq__\n• Avoid infinite recursion in __setattr__ and __getattribute__\n• Be consistent in returned types\n• Don't overuse operator overloading\n• Test with edge cases and different Python versions",
              "explanation": "Being aware of common issues helps create robust special method implementations."
            }
          ],
          "explanation": "Following best practices ensures that special methods enhance rather than complicate class design, making code more Pythonic and maintainable."
        },
        {
          "subtitle": "📋 Special Methods Reference",
          "type": "table",
          "headers": ["Category", "Methods", "Purpose", "Example Use"],
          "rows": [
            ["Initialization", "__new__, __init__, __del__", "Object lifecycle", "Control creation/destruction"],
            ["Representation", "__str__, __repr__, __format__", "String conversion", "Meaningful print output"],
            ["Comparison", "__eq__, __lt__, __gt__, etc.", "Object comparison", "Sorting, equality checks"],
            ["Arithmetic", "__add__, __sub__, __mul__, etc.", "Math operations", "Vector math, custom arithmetic"],
            ["Containers", "__len__, __getitem__, __setitem__", "Container behavior", "Lists, dictionaries, sequences"],
            ["Callable", "__call__", "Function-like objects", "Stateful functions, decorators"],
            ["Context", "__enter__, __exit__", "Resource management", "Files, locks, transactions"],
            ["Attributes", "__getattr__, __setattr__", "Attribute control", "Validation, computed attributes"]
          ],
          "explanation": "This reference table summarizes the main categories of special methods and their purposes, helping you choose the right methods for your use case."
        }
      ],
      "explanation": "Understanding and properly implementing special methods is key to creating Pythonic classes that integrate seamlessly with Python's ecosystem and provide intuitive interfaces."
    }
  ]
}
];
    
    

    setCheatsheets(pythonCheatsheets);
  }, [course]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      const notification = document.createElement('div');
      notification.className = 'GuideRayCheetSheet-copy-notification';
      notification.textContent = '✓ Copied to clipboard!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const normalizedTopicName = topicName ? topicName.toLowerCase().replace(/\s+/g, '-') : '';

  const filteredCheatsheets = cheatsheets.filter(sheet => {
    const sheetTopicName = sheet.title.toLowerCase().replace(/\s+/g, '-');    
    return sheetTopicName === normalizedTopicName;
  });

  const activeCheatsheet = filteredCheatsheets.length > 0 ? filteredCheatsheets[0] : null;

  const CodeExample = ({ title, code, explanation, index }) => {
    const [highlightedCode, setHighlightedCode] = useState('');

    useEffect(() => {
      let isMounted = true;
      editor.colorize(code, 'python', {}).then(html => {
        if (isMounted) {
          setHighlightedCode(html);
        }
      });
      return () => { isMounted = false; };
    }, [code]);

    return (
      <div className="GuideRayCheetSheet-code-example" key={index}>
        <div className="GuideRayCheetSheet-code-header">
          <div className="GuideRayCheetSheet-code-title">
            <FaPython /> {title}
          </div>
          <button
            className="GuideRayCheetSheet-copy-btn"
            onClick={() => copyCode(code)}
            title="Copy code"
          >
            <FaCopy /> Copy
          </button>
        </div>
        <pre className="GuideRayCheetSheet-code" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        <div className="GuideRayCheetSheet-code-explanation">
          <p>{explanation}</p>
        </div>
      </div>
    );
  };

  const renderFormattedText = (content) => {
    if (typeof content !== 'string') {
      return content;
    }

    // Check for unordered list (bullets)
    if (content.includes('•')) {
      const listItems = content
        .split('•')
        .map(item => item.trim())
        .filter(item => item);

      return (
        <ul className="GuideRayCheetSheet-bulleted-list">
          {listItems.map((item, index) => (<li key={index}>{item}</li>))}
        </ul>
      );
    }

    // Check for ordered list (e.g., "1. item\n2. item")
    const isOrderedList = /^\s*\d+\.\s/.test(content);
    if (isOrderedList) {
      const listItems = content.split('\n').filter(item => item.trim() !== '');
      return (
        <ol className="GuideRayCheetSheet-ordered-list">
          {listItems.map((item, index) => (
            <li key={index}>{item.replace(/^\s*\d+\.\s*/, '')}</li>
          ))}
        </ol>
      );
    }

    return content;
  };

  const renderSubsectionContent = (subsection) => {
    switch (subsection.type) {
      case 'text':
        return (
          <dl className="GuideRayCheetSheet-text-list">
            {subsection.content?.map((item, itemIndex) => (
              <React.Fragment key={itemIndex}>
                <dt>{item.title}</dt>
                <dd>
                  {renderFormattedText(item.content)}
                  {item.explanation && (
                    <p className="GuideRayCheetSheet-explanation-note">{item.explanation}</p>
                  )}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        );
      case 'code': // This will now only handle subsections explicitly marked as 'code'
        return (
          <div className="GuideRayCheetSheet-code-examples-container">
            {subsection.content?.map((example, exampleIndex) => (
              <CodeExample
                key={exampleIndex}
                title={example.title}
                code={example.code}
                explanation={example.explanation}
                index={exampleIndex}
              />
            ))}
          </div>
        );
      case 'step-by-step':
        return (
          <ol className="GuideRayCheetSheet-step-by-step-list">
            {subsection.content?.map((step) => (
              <li key={step.step} className="GuideRayCheetSheet-step-item">
                <strong>{step.title}:</strong> {renderFormattedText(step.content)}
                {step.explanation && <p className="GuideRayCheetSheet-step-explanation">{step.explanation}</p>}
              </li>
            ))}
          </ol>
        );
      case 'table':
        return (
          <div className="GuideRayCheetSheet-table-container">
            <table className="GuideRayCheetSheet-table">
              <thead>
                <tr>
                  {subsection.headers.map((header, index) => <th key={index}>{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {subsection.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            {subsection.explanation && <p className="GuideRayCheetSheet-table-explanation">{subsection.explanation}</p>}
          </div>
        );
      default:
        // Fallback for any other type, or if type is missing
        return <div>Unsupported subsection content type: {subsection.type}</div>;
    }
  };

  const renderFlowchart = (steps) => {
    return steps.map((step, index) => {
      if (typeof step === 'string') {
        return <div key={index} className="GuideRayCheetSheet-flowchart-node">{step}</div>;
      }
      if (step.type === 'condition') {
        return <div key={index} className="GuideRayCheetSheet-flowchart-condition">{step.label}</div>;
      }
      if (step.type === 'branch') {
        return (
          <div key={index} className="GuideRayCheetSheet-flowchart-branch">
            <div className="GuideRayCheetSheet-flowchart-branch-path">
              <div className="GuideRayCheetSheet-flowchart-branch-label">Yes</div>
              {renderFlowchart(step.yes)}
            </div>
            <div className="GuideRayCheetSheet-flowchart-branch-path">
              <div className="GuideRayCheetSheet-flowchart-branch-label">No</div>
              {renderFlowchart(step.no)}
            </div>
          </div>
        );
      }
      return null;
    });
  };

  const renderContent = (item) => {
    switch(item.type) {
      case 'introduction':
        return (
          <div className="GuideRayCheetSheet-introduction-content">
            {renderBulletedContent(item.content)}
          </div>
        );
      
      case 'table':
        return (
          <div className="GuideRayCheetSheet-table-container">
            <table className="GuideRayCheetSheet-table">
              <thead>
                <tr>
                  {item.headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {item.explanation && <p className="GuideRayCheetSheet-table-explanation">{item.explanation}</p>}
          </div>
        );
      
      case 'section':
        return (
          <div className="GuideRayCheetSheet-section-container">
            {item.content.map((subsection, index) => (
              <div key={index} className="GuideRayCheetSheet-subsection">
                <p className="GuideRayCheetSheet-subsection-title">
                  {subsection.subtitle}
                </p>
                <div className="GuideRayCheetSheet-subsection-explanation">
                  {renderFormattedText(subsection.explanation)}
                </div>
                {renderSubsectionContent(subsection)}
              </div>
            ))}
          </div>
        );
      
      case 'flowchart':
        return (
          <div className="GuideRayCheetSheet-flowchart-container">
            <div className="GuideRayCheetSheet-flowchart">
              {renderFlowchart(item.content.steps)}
            </div>
            {item.explanation && <p className="GuideRayCheetSheet-flowchart-explanation-text">{item.explanation}</p>}
          </div>
        );
      
      default:
        return <div>Unsupported content type</div>;
    }
  };

  return (
    <div className="GuideRayCheetSheet-container">
      {/* Overlays for content protection can be placed here if needed, but are commented out as per original code */}
      {/* Example: Print Detection Overlay */}
      {/* <div id="print-overlay" style={{ ... }}> ... </div> */}
      {/* Example: DevTools Detection Overlay */}
      {/* <div id="devtools-overlay" style={{ ... }}> ... </div> */}

      <aside className="GuideRayCheetSheet-sidebar">
        <div className="GuideRayCheetSheet-sidebar-header">
          <div className="GuideRayCheetSheet-logo-container">
            <img
              src="https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png"
              alt="GuideRay Logo"
              className="GuideRayCheetSheet-logo-img"
            />  
            <span className="GuideRayCheetSheet-logo-text">Cheatsheets</span>
          </div>

          <div className="GuideRayCheetSheet-title-group">
            <p className="GuideRayCheetSheet-course-title">{course}</p>
            <p className="GuideRayCheetSheet-topic-title">{topicName}</p>
          </div>
        </div>
        <div className="GuideRayCheetSheet-sidebar-content">
          <div className="GuideRayCheetSheet-sidebar-section">
            <p className="GuideRayCheetSheet-sidebar-section-title">
              <FaClipboardList className="sidebar-icon" /> How to Use
            </p>
            <p><strong>Important Learning Instructions:</strong></p>
            <ul>
              <li>These cheatsheets contain <strong>comprehensive, industry-relevant knowledge</strong>.</li>
              <li>The <strong>deep understanding needed for real-world applications</strong> is provided here.</li>
              <li><strong>Study each cheatsheet thoroughly</strong> — they form the foundation for all assessments.</li>
            </ul>
          </div>
          <div className="GuideRayCheetSheet-sidebar-section">
            <p className="GuideRayCheetSheet-sidebar-section-title">
              <FaBookOpen className="sidebar-icon" /> Learning Guidelines
            </p>
            <ul>
              <li>Read the explanations with full focus.</li>
              <li>Try out the examples in your own coding environment.</li>
              <li>Experiment and modify examples to deepen understanding.</li>
            </ul>
          </div>
          <div className="GuideRayCheetSheet-sidebar-section protection-notice">
            <p className="GuideRayCheetSheet-sidebar-section-title">
              <FaShieldAlt className="sidebar-icon" /> Content Protection
            </p>
            <p>This content is protected against automated capture tools and printing.</p>
          </div>
        </div>
      </aside>

      <main className="GuideRayCheetSheet-main" ref={mainContentRef}>
        {/* Anti-capture floating elements */}
        <div className="anti-capture-floater-1"></div>
        <div className="anti-capture-floater-2"></div>
        <div className="anti-capture-floater-3"></div>
        
        <div className="GuideRayCheetSheet-main-content-wrapper">
          {/* Fixed Header */}
          <div className="GuideRayCheetSheet-main-header">
            <div className="GuideRayCheetSheet-header-breadcrumbs">
              <span>{course}</span> &gt; <span>{topicName}</span>
            </div>
            {userData && (
              <div className="GuideRayCheetSheet-user-profile">
                <div className="GuideRayCheetSheet-user-profile-pic-container">
                  <img 
                    src={userData.profilePic} 
                    alt={userData.name} 
                    className="GuideRayCheetSheet-user-profile-pic"
                  />
                </div>
                <div className="GuideRayCheetSheet-user-profile-details">
                  <span className="GuideRayCheetSheet-user-name">{userData.name}</span>
                  <span className="GuideRayCheetSheet-user-email">{userData.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Page Title Section */}
     
          {/* PRIVACY NOTE */}
          <div className="GuideRayCheetSheet-privacy-note">
            <div className="GuideRayCheetSheet-privacy-note-icon">
              <FaExclamationTriangle />
            </div>
            <div className="GuideRayCheetSheet-privacy-note-content">
              <p className="GuideRayCheetSheet-privacy-note-title">Content Usage Policy</p>
              <p>
                The content provided in these cheatsheets is the intellectual property of GuideRay. It is intended for your personal educational use only. Unauthorized copying, screen recording, printing, sharing, or distribution of this material is strictly prohibited and will be considered a violation of our terms of service, which may result in account suspension. We employ various security measures to protect our content.
              </p>
            </div>
          </div>


          {/* INNER SCROLLABLE CONTAINER */}
          <div className="GuideRayCheetSheet-scroll-container">
            <div className="GuideRayCheetSheet-scroll-content">
              {activeCheatsheet ? (
                activeCheatsheet.items.map(item => (
                  <div key={item.id} className="GuideRayCheetSheet-cheat-item">
                    <div className="GuideRayCheetSheet-cheat-header">
                      <p className="GuideRayCheetSheet-cheat-title">
                        {item.type === 'introduction' && <FaRocket />}
                        {item.type === 'code' && <FaCode />}
                        {item.type === 'table' && <FaTable />}
                        {item.type === 'section' && <FaCubes />}
                        {item.type === 'flowchart' && <FaProjectDiagram />}
                        {item.title}
                      </p>
                      <span className="GuideRayCheetSheet-content-type">{item.type}</span>
                    </div>
                    <p className="GuideRayCheetSheet-item-description">{item.description}</p> 
                    <div className="GuideRayCheetSheet-item-content">
                      {renderContent(item)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="GuideRayCheetSheet-not-found">
                  <div className="GuideRayCheetSheet-not-found-icon">
                    <FaSearch />
                  </div>
                  <p className="GuideRayCheetSheet-not-found-title">Cheatsheet Not Found</p>
                  <p className="GuideRayCheetSheet-not-found-message">We couldn't find a cheatsheet for "{topicName}".</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="GuideRayCheetSheet-footer" style={{ padding: '20px 40px', textAlign: 'center', color: 'var(--text-color-light)', flexShrink: 0, background: 'var(--bg-color-main)' }}>
            <div className="GuideRayCheetSheet-footer-content">
              <p>© 2024 GuideRay Cheatsheets. All rights reserved.</p>
              <p style={{ marginTop: '8px', fontSize: '0.8rem' }}>Protected content - Do not distribute</p>
            </div>
          </footer>
        </div>
      </main>  
    </div>
  );
};

export default GuideRayCheetSheet;
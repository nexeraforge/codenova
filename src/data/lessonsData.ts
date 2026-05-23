import { Chapter, QuizQuestion, AssignmentChallenge } from "../types";

// Helper to generate quiz questions for any chapter
function generateMockQuiz(chapterTitle: string, count: number = 3): QuizQuestion[] {
  const norm = chapterTitle.toLowerCase();
  let pool = [
    {
      q: "What is the primary role of this programming component inside logic workflows?",
      o: ["Encapsulating structural directives", "Speeds up hard disk performance", "Removes variables from runtime registry", "Saves code designs automatically"],
      a: 0
    },
    {
      q: "Which error typically occurs if you violate this syntax boundary?",
      o: ["IndentationError or SyntaxError", "OutOfMemoryException", "NullPointerException", "All of the above under specific boundaries"],
      a: 0
    },
    {
      q: "How should a developer write maintainable routines for this element?",
      o: ["Copying blocks of code across files", "Keeping variable declarations global and unprotected", "Creating modular, well-commented blocks of statements", "Avoiding helper documentation entirely"],
      a: 2
    }
  ];

  if (norm.includes("list") || norm.includes("array") || norm.includes("collect") || norm.includes("tuple") || norm.includes("set") || norm.includes("dictionar")) {
    pool = [
      {
        q: "Which index references the absolute first item in a collection?",
        o: ["0", "1", "-1", "Index values are strictly random"],
        a: 0
      },
      {
        q: "What does it mean for a data collection structure to be 'mutable'?",
        o: ["Its elements can be modified after declaration", "It can never be altered", "It is only stored on cloud servers", "It is cleared automatically after execution"],
        a: 0
      },
      {
        q: "Which of the following describes an immutable counterpart to a standard list?",
        o: ["A Python Dictionary", "A Python Tuple", "A Float array", "An integer variable"],
        a: 1
      },
      {
        q: "What error is triggered when referencing an element beyond a collection's bounds?",
        o: ["IndexError / BoundsException", "MemoryError", "TypeError", "SyntaxError"],
        a: 0
      }
    ];
  } else if (norm.includes("class") || norm.includes("inheritance") || norm.includes("object") || norm.includes("encapsulat") || norm.includes("polymorph") || norm.includes("abstract") || norm.includes("interface") || norm.includes("constructor") || norm.includes("oop")) {
    pool = [
      {
        q: "What is the primary objective of 'Inheritance' in OOP design paradigms?",
        o: ["Deriving child class properties from a parent class to promote reusability", "Restricting access to class variables", "Automatically accelerating JVM performance", "Deleting unused class constructors from memory"],
        a: 0
      },
      {
        q: "Which keyword references the active object instance itself inside Python classes?",
        o: ["this", "self", "instance", "me"],
        a: 1
      },
      {
        q: "What describes encapsulating private fields within specific boundaries?",
        o: ["Hiding private attributes and exposing them only via secure methods", "Allowing any outer routine to change fields freely", "Compiling variables directly to bytecode files", "Avoiding standard helper methods entirely"],
        a: 0
      },
      {
        q: "Which component instantiates objects and allocates memory inside class models?",
        o: ["Constructor method", "Semicolon sentry", "Arithmetic comparator", "Deconstructor template"],
        a: 0
      }
    ];
  } else if (norm.includes("error") || norm.includes("exception") || norm.includes("try") || norm.includes("catch")) {
    pool = [
      {
        q: "Which block contains code statements that might potentially fail at runtime?",
        o: ["try", "except / catch", "finally", "def"],
        a: 0
      },
      {
        q: "Which block is guaranteed to run after exception evaluation to handle resource cleanups?",
        o: ["finally", "catch", "try", "except"],
        a: 0
      },
      {
        q: "What error helper terminates program execution explicitly when criteria is breached?",
        o: ["raise / throw", "exit", "return", "pass"],
        a: 0
      }
    ];
  } else if (norm.includes("file") || norm.includes("read") || norm.includes("write") || norm.includes("io")) {
    pool = [
      {
        q: "Why is it important to execute close() after updating active file handles?",
        o: ["To flush the buffer streams and release occupied memory locks", "To delete the file from disk", "To keep code from compile errors", "To rename the file dynamically"],
        a: 0
      },
      {
        q: "Which mode flag is used to append content without overwriting existing details?",
        o: ["'a'", "'w'", "'r'", "'x'"],
        a: 0
      },
      {
        q: "What datatype do standard text file read loops yield directly in scripting?",
        o: ["Strings representing characters", "Integers matching bytes", "Floating pointers", "JSON files"],
        a: 0
      }
    ];
  } else if (norm.includes("api") || norm.includes("request") || norm.includes("json")) {
    pool = [
      {
        q: "Which HTTP method is most appropriate for uploading or submitting data to a server?",
        o: ["POST", "GET", "DELETE", "OPTIONS"],
        a: 0
      },
      {
        q: "What does JSON stand for in standard computer network interchanges?",
        o: ["JavaScript Object Notation", "Java String Outline Node", "Join Structured Open Network", "Just Synchronized Organized Object"],
        a: 0
      },
      {
        q: "What Python library is universally used to invoke external web requests?",
        o: ["requests", "sys", "json", "math"],
        a: 0
      }
    ];
  } else {
    pool = [
      {
        q: `What is the core target when organizing your code designs for ${chapterTitle}?`,
        o: [`Structuring logic elements specifically for ${chapterTitle}`, "Compiling the code into a binary file immediately", "Hiding syntax definitions completely", "Exposing secure credentials to user consoles"],
        a: 0
      },
      {
        q: `In the context of ${chapterTitle}, which of the following is considered a best practice?`,
        o: ["Keep layout variables global and unprotected", "Write modular, readable files and add explanatory labels", "Avoid commenting logic paths entirely", "Nested routines exceeding ten levels"],
        a: 1
      },
      {
        q: `Which component evaluates parameters related to ${chapterTitle} during runtime?`,
        o: ["The interpreter engine", "A static formatting tool", "The keyboard input scanner", "A physical printer terminal"],
        a: 0
      }
    ];
  }

  const hash = chapterTitle.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const result: QuizQuestion[] = [];
  const indices = Array.from({ length: pool.length }, (_, k) => k);
  
  let currentHash = hash;
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const pickedIdxIdx = currentHash % indices.length;
    const pickedIdx = indices[pickedIdxIdx];
    indices.splice(pickedIdxIdx, 1);
    
    const item = pool[pickedIdx];
    result.push({
      id: i + 1,
      question: item.q.includes(chapterTitle) ? item.q : `[Q${i + 1}] Regarding ${chapterTitle}: ${item.q}`,
      options: item.o,
      correctAnswerIndex: item.a
    });
    
    currentHash = Math.floor(currentHash / 5) + 7;
  }
  
  return result;
}

// Full Python Chapters Outline
const pythonChaptersRaw = [
  // Level 1: Beginner Foundations
  { id: 1, title: "Introduction to Python", desc: "Understand Python syntax, interpreter, advantages, and running your first print script." },
  { id: 2, title: "Variables & Data Types", desc: "Explore strings, numbers, booleans, floating types, and standard memory assignment." },
  { id: 3, title: "Input & Output", desc: "Interact dynamically with command lines using print() parameters and input() actions." },
  { id: 4, title: "Operators", desc: "Perform mathematical calculations, comparisons, and logical transformations securely." },
  { id: 5, title: "Conditional Statements", desc: "Control application logic gates using flow branches like if, elif, and else structures." },
  { id: 6, title: "Loops", desc: "Iterate across arrays and collections cleanly utilizing for, while, and range iterators." },
  { id: 7, title: "Functions", desc: "Encapsulate clean, modular, testable logic structures using def keyword and return rules." },
  // Level 2: Intermediate Python
  { id: 8, title: "Lists", desc: "Organize dynamic linear, mutable lists, index slicing, and helper methods." },
  { id: 9, title: "Tuples & Sets", desc: "Store immutable lists and unique element collections securely." },
  { id: 10, title: "Dictionaries", desc: "Construct key-value pairs representing records, quick indexing lookup, and structures." },
  { id: 11, title: "Strings Advanced", desc: "Slicing, regex matching, find-replace, and character byte representations." },
  { id: 12, title: "Error Handling", desc: "Prevent critical app halts using try/except, raising exceptions safety, and finally gates." },
  { id: 13, title: "File Handling", desc: "Perform IO read-write actions on text and metadata records safely." },
  { id: 14, title: "Modules & Packages", desc: "Import internal routines from math, sys or custom third-party developers." },
  // Level 3: Object Oriented Python
  { id: 15, title: "Classes & Objects", desc: "Design object constructors using self parameters, states, and action methods." },
  { id: 16, title: "Inheritance", desc: "Extend helper superclasses dynamically to minimize duplicate structures." },
  { id: 17, title: "Encapsulation & Polymorphism", desc: "Protect private properties and implement abstract interfaces cleanly." },
  // Level 4: Advanced Python
  { id: 18, title: "Iterators & Generators", desc: "Save server-side memory capacities using yield and lazy iterators." },
  { id: 19, title: "Decorators", desc: "Inject wrappers adding utility or timer logs surrounding regular routines dynamically." },
  { id: 20, title: "Lambda Functions", desc: "Write quick, anonymous, elegant inline closures." },
  { id: 21, title: "List Comprehensions", desc: "Perform fast matrix or array filters in a single elegant expression." },
  { id: 22, title: "Recursion", desc: "Solve complex tree traversals by calling routines within themselves." },
  { id: 23, title: "APIs & Requests", desc: "Query external microservices using the popular requests library." },
  { id: 24, title: "JSON Handling", desc: "Parse web API json strings into python dictionaries and output format variables." },
  { id: 25, title: "Virtual Environments", desc: "Maintain separate package dependencies utilizing pip and venv tools." },
  // Level 5: Python Projects
  { id: 26, title: "Calculator App", desc: "Build a modular utility resolving multi-operator mathematical equations." },
  { id: 27, title: "To-Do App", desc: "Engineer an offline planner managing tasks status, checklists, and local file storage." },
  { id: 28, title: "File Organizer", desc: "Write files helper sorting random downloads instantly by type format." },
  { id: 29, title: "Weather App", desc: "Connect requests endpoint pulling global temperature configurations based on user inputs." },
  { id: 30, title: "Final Python Project", desc: "Cap it off by building a complete automated algorithm with custom interactive tests." }
];

// Full Java Chapters Outline
const javaChaptersRaw = [
  // Level 1: Beginner Foundations
  { id: 1, title: "Introduction to Java", desc: "Learn Java fundamentals, compiler paradigms, JVM, JRE, JDK, and static void main." },
  { id: 2, title: "Java Syntax Basics", desc: "Master package layouts, semi-colons, brackets, class declarations, and formatting." },
  { id: 3, title: "Variables & Data Types", desc: "Declare strictly typed configurations like int, double, boolean, String, and char types." },
  { id: 4, title: "Operators", desc: "Perform mathematical, logical, short-circuit, and equivalence equations safely in Java." },
  { id: 5, title: "Input & Output", desc: "Read student values using Scanner classes and output metrics with System.out." },
  { id: 6, title: "Conditional Statements", desc: "Route logical threads with if-else frameworks and clean switch blocks." },
  { id: 7, title: "Loops", desc: "Configure index boundaries correctly in for loops, while streams, and nested structures." },
  { id: 8, title: "Methods", desc: "Construct reusable class behaviors using parameters and return types." },
  // Level 2: Intermediate Java
  { id: 9, title: "Arrays", desc: "Implement static linear arrays, index offsets, and arrays utility algorithms." },
  { id: 10, title: "Strings", desc: "Manipulate strings using comparison functions, substring patterns, and StringBuilder." },
  { id: 11, title: "ArrayList", desc: "Construct dynamic lists that expand memory layouts safely." },
  { id: 12, title: "Exception Handling", desc: "Catch logical errors using try/catch structure and throw unchecked exceptions." },
  { id: 13, title: "File Handling", desc: "Perform FileReader operations on config files securely with buffers." },
  { id: 14, title: "Packages", desc: "Organize Java compilation layers using package rules and imports." },
  { id: 15, title: "Enums", desc: "Define structured parameters of strict static global variables." },
  // Level 3: OOP in Java
  { id: 16, title: "Classes & Objects", desc: "Construct custom types with field attributes, getters-setters, and objects." },
  { id: 17, title: "Constructors", desc: "Overload instance templates using alternate parameters." },
  { id: 18, title: "Inheritance", desc: "Extend base class properties dynamically using keyword 'extends'." },
  { id: 19, title: "Polymorphism", desc: "Override dynamic actions utilizing compile-time overloading versus runtime overrides." },
  { id: 20, title: "Abstraction", desc: "Declare blueprint references using 'abstract' classes." },
  { id: 21, title: "Interfaces", desc: "Implement strict multiple behavior specifications utilizing 'implements'." },
  { id: 22, title: "Encapsulation", desc: "Shield internal properties using private fields and secure public endpoints." },
  // Level 4: Advanced Java
  { id: 23, title: "Collections Framework", desc: "Select linear and matrix utilities from standard Java collection libraries." },
  { id: 24, title: "HashMap", desc: "Query, insert, and update key-value mapping records in O(1) time." },
  { id: 25, title: "Generics", desc: "Design classes supporting multi-type containers cleanly preventing runtime conversion errors." },
  { id: 26, title: "Threads", desc: "Run independent concurrent code loops utilizing Runnable classes." },
  { id: 27, title: "Lambda Expressions", desc: "Shorten basic listener commands using elegant Java arrow functions." },
  { id: 28, title: "Stream API", desc: "Map, filter, and aggregate collections utilizing elegant pipe frameworks." },
  { id: 29, title: "Functional Interfaces", desc: "Understand single abstract method paradigms like Predicates and Consumers." },
  { id: 30, title: "Java Annotations", desc: "Inject behavior flags like @Override and Custom compilation instructions." },
  // Level 5: Java Projects
  { id: 31, title: "Student Management System", desc: "Track course lists, user details, lists, and file archives safely." },
  { id: 32, title: "Banking System", desc: "Safeguard transactional parameters utilizing encapsulated getters and atomic math." },
  { id: 33, title: "Quiz App", desc: "Deploy a command line trivia utility reading multiple questions dynamically." },
  { id: 34, title: "File Manager", desc: "Perform folder creations, sorting, and directory prints securely." },
  { id: 35, title: "Final Java Project", desc: "Build a secure OOP architecture solving composite user problems completely." }
];

function ensureTenQuizzes(chapterTitle: string, quizzes: QuizQuestion[]): QuizQuestion[] {
  // Use handcrafted high-quality distinct questions if provided, avoiding padding them up with mock questionnaires
  if (quizzes && quizzes.length > 0) return quizzes;
  return generateMockQuiz(chapterTitle, 3);
}

// Map a raw item to a rich, functional Chapter entity
function enrichChapter(raw: { id: number; title: string; desc: string }, lang: "python" | "java"): Chapter {
  const ch = enrichChapterInternal(raw, lang);
  ch.quizzes = ensureTenQuizzes(ch.title, ch.quizzes);
  return ch;
}

function enrichChapterInternal(raw: { id: number; title: string; desc: string }, lang: "python" | "java"): Chapter {
  let level: "Beginner" | "Intermediate" | "OOP" | "Advanced" | "Projects" = "Beginner";
  if (lang === "python") {
    if (raw.id > 25) level = "Projects";
    else if (raw.id > 17) level = "Advanced";
    else if (raw.id > 14) level = "OOP";
    else if (raw.id > 7) level = "Intermediate";
  } else {
    // Java
    if (raw.id > 30) level = "Projects";
    else if (raw.id > 22) level = "Advanced";
    else if (raw.id > 15) level = "OOP";
    else if (raw.id > 8) level = "Intermediate";
  }

  const difficultyList: ("Easy" | "Medium" | "Hard" | "Expert")[] = ["Easy", "Medium", "Hard", "Expert"];
  const difficulty = difficultyList[(raw.id - 1) % difficultyList.length];

  // Specific content for Python Chapter 1
  if (lang === "python" && raw.id === 1) {
    return {
      id: 1,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Easy",
      coinsReward: 35,
      estimatedTime: "5 min",
      explanation: "### 🐍 WELCOME TO PYTHON: THE LANGUAGE OF AI & AUTOMATION\n\nPython is a high-level, interpreted, dynamically-typed programming language created by Guido van Rossum in 1991. Because of its elegant, readable syntax that resembles plain English, Python has become the global industry standard for artificial intelligence, machine learning, data science, web development, and DevOps automation.\n\n#### 📦 HOW THE PYTHON INTERPRETER WORKS\nUnlike compiled languages like C++ or Java where code must undergo a separate translation stage into system-level binaries before execution, Python executes sequentially line-by-line. This is called **Interpreted Code**.\nWhen you run a Python file:\n1. The source code is parsed into an optimized intermediate format called **Bytecode**.\n2. The **Python Virtual Machine (PVM)** executes this bytecode step-by-step.\n\n#### ✍️ CLASSIC VARIABLE DESIGN BLUEPRINT\nHere is how a developer prints a greeting message. The built-in `print()` statement sends characters to the `stdout` stream (the standard terminal layout).\n\n```python\n# Variable declaration and display\nblueprint_message = \"Hello, CodeNova!\"\nprint(blueprint_message)\n```\n\n**Rule of thumb:** In Python, string content must always be wrapped in either single quotes (`'`) or double quotes (`\"`). Mixing them on the same line will crash your interpreter with a `SyntaxError`.",
      snippet: "# Let's print our first message!\nprint(\"Hello, CodeNova!\")",
      solutionCode: 'print("Hello, CodeNova!")',
      interactiveTask: "Press RUN to execute your first Python line! To proceed, make sure the text says exactly \"Hello, CodeNova!\" and click Check.",
      interactiveGoal: "print(\"Hello, CodeNova!\")",
      quizzes: [
        { id: 1, question: "Who created Python in 1991?", options: ["Guido van Rossum", "Dennis Ritchie", "James Gosling", "Bjarne Stroustrup"], correctAnswerIndex: 0 },
        { id: 2, question: "Which command prints output to the console?", options: ["log()", "display()", "print()", "System.out"], correctAnswerIndex: 2 },
        { id: 3, question: "Is Python a compiled or interpreted language?", options: ["Purely Compiled", "Interpreted & Dynamically Typed", "Raw hardware language", "No types supported"], correctAnswerIndex: 1 },
        { id: 4, question: "Which of the following is correct Python syntax?", options: ["print 'Hello'", "print(\"Hello\")", "println(\"Hello\")", "Console.Write(\"Hello\")"], correctAnswerIndex: 1 },
        { id: 5, question: "What symbol starts a comment in Python?", options: ["// Comments", "/* Comments */", "# Comments", "<!-- Comments -->"], correctAnswerIndex: 2 }
      ],
      assignment: {
        title: "Hello World Challenge",
        description: "Write a Python script that outputs exactly 'Learn coding like a game!' using the print() function.",
        starterCode: "# Write your Python solution here\n",
        goalDescription: "print('Learn coding like a game!')"
      }
    };
  }

  // Python Chapter 2
  if (lang === "python" && raw.id === 2) {
    return {
      id: 2,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Easy",
      coinsReward: 40,
      estimatedTime: "8 min",
      explanation: "### 📦 COMPREHENSIVE GUIDE TO VARIABLES & MEMORY LAYOUT\n\nIn programming, a **Variable** is a named location in the computer's memory used to hold temporary data. Think of it as a labeled box where you store items. In Python, declaring a variable is incredibly simple: write the name, use the assignment operator `=`, and state the value!\n\n#### 🛡️ THE DYNAMIC TYPING SYSTEM\nUnlike static languages (like Java) where variables must have a forced type declared upfront (e.g., `int xp = 100;`), Python uses a **Dynamic Typing** system. Python automatically determines the type of a variable at runtime based on the value you assign to it.\n\n#### 📊 PYTHON CORE PRIMITIVE TYPES\n1. **Integer (`int`)**: Whole numbers without decimal points (e.g., `score = 100`).\n2. **Float (`float`)**: Floating-point decimal numbers (e.g., `pi_multiplier = 3.14159`).\n3. **String (`str`)**: Character arrays wrapped in quotes (e.g., `alias = \"Alex\"`).\n4. **Boolean (`bool`)**: Logical flags evaluating to either `True` or `False`.\n\n#### ⚙️ ASSIGNMENT BLUEPRINT & RULE EXAMPLES\nLet's look at how memory is allocated:\n\n```python\n# 1. Integer variable (Allocates dynamically in memory stack)\nlevel_tracker = 42\n\n# 2. String variable (Python creates a string object in heap)\ncharacter_type = \"CodingNinja\"\n\n# 3. Dynamic Type Swap (Flawless re-allocation!)\nactive_status = True\nactive_status = \"Deactivated\" # Fully approved!\n```\n\n**Best Practice Rules:** Variable names in Python should follow `snake_case` (all lowercase, words joined with underscores), cannot start with numbers, and are highly case-sensitive.",
      snippet: "# Declare a variable and display it\nplayerName = \"Alex\"\nprint(playerName)",
      solutionCode: 'playerName = "CodingNinja"\nprint(playerName)',
      interactiveTask: "Change the player name value in the editor above to 'CodingNinja' and click Check!",
      interactiveGoal: "playerName = 'CodingNinja'",
      quizzes: [
        { id: 1, question: "How do you declare a variable in Python?", options: ["int x = 5", "var x := 5", "x = 5", "const x : int = 5"], correctAnswerIndex: 2 },
        { id: 2, question: "What data type represents True or False?", options: ["Float", "Integer", "Boolean", "String"], correctAnswerIndex: 2 },
        { id: 3, question: "How does a dynamically-typed system behave?", options: ["You must state types upfront", "Types are decided at runtime dynamically", "No variables can change value", "Errors occur for every change"], correctAnswerIndex: 1 },
        { id: 4, question: "Which is a valid variable name in Python?", options: ["2player", "player-name", "player_name", "player name"], correctAnswerIndex: 2 },
        { id: 5, question: "What is output of 5 + 2 in Python variables?", options: ["7", "52", "TypeError", "None of these"], correctAnswerIndex: 0 }
      ],
      assignment: {
        title: "Variable Math Assignment",
        description: "Create a variable named 'score' and set it to 100, then print this score using print(score).",
        starterCode: "# Write your Python solution here\n",
        goalDescription: "score = 100\nprint(score)"
      }
    };
  }

  // Python Chapter 3
  if (lang === "python" && raw.id === 3) {
    return {
      id: 3,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Easy",
      coinsReward: 40,
      estimatedTime: "6 min",
      explanation: "### 📥 DYNAMIC HUMAN-TO-COMPUTER INTERACTION (IO STREAMING)\n\nInteraction is what makes static algorithms transform into immersive applications! In Python, we utilize dedicated functions to stream information both **out** to the terminal screen and **in** from the human operator.\n\n#### 📤 PRINT FORMATTING WITH STDOUT\nIn previous levels, we used `print()` to output raw text. Often, you want to print variables joined with text (known as string concatenation). In Python, you can achieve this by joining two strings using the concatenation operator `+`:\n\n```python\nalias = \"Pythonist\"\nprint(\"Greetings, \" + alias + \"!\")\n```\n\n**Caution:** You can only concatenate a string with another string. Trying to run `\"Score: \" + 100` will throw a `TypeError`! To avoid this, convert figures to strings using the `str()` cast function: `print(\"Score: \" + str(100))`.\n\n#### 📥 CAPTURING TERMINAL INPUTS\nTo retrieve raw keyboard inputs typed by the user, Python exposes the `input(prompt)` function. When evaluated:\n1. The program pauses execution.\n2. The string parameter specified inside the parentheses is printed to notify the user.\n3. The computer waits for the user to type their input and press the **Enter** key.\n4. The value typed is returned **always as a string data type** and saved to your variable.\n\n```python\n# Dynamic blueprint\nplayer_alias = input(\"Enter your terminal alias: \")\nprint(\"Initializing sandbox level with engineer: \" + player_alias)\n```\n\nIf you need numerical inputs from the user, you must wrap input inside numerical cast helpers like `int()` or `float()` to safely transition string streams into numbers: `player_age = int(input(\"Enter age: \"))`.",
      snippet: "# Sourcing user details in real-time\nuser_name = input(\"Enter your alias: \")\nprint(\"Hello, \" + user_name)",
      solutionCode: 'user_name = input("Enter your alias: ")\nprint("Hello, Pythonist")',
      interactiveTask: "Modify the output so it prints 'Hello, Pythonist' and click Check!",
      interactiveGoal: "user_name = input",
      quizzes: [
        { id: 1, question: "Which function captures user keyboard input?", options: ["get()", "input()", "read()", "scan()"], correctAnswerIndex: 1 },
        { id: 2, question: "What data type is always returned by standard python input()?", options: ["String", "Integer", "Float", "Boolean"], correctAnswerIndex: 0 },
        { id: 3, question: "How do you combine (concatenate) strings in Python print outputs?", options: ["Using dot (.)", "Using plus (+)", "Using comma (,)", "Either + or , depending on whitespace demands"], correctAnswerIndex: 3 }
      ],
      assignment: {
        title: "Personalized Input Greeter",
        description: "Write code to ask the user's name via input(), store it in 'user_name', and output 'Greetings ' + user_name.",
        starterCode: "# Write your Python solution here\n",
        goalDescription: "Greetings"
      }
    };
  }

  // Python Chapter 4
  if (lang === "python" && raw.id === 4) {
    return {
      id: 4,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Easy",
      coinsReward: 45,
      estimatedTime: "7 min",
      explanation: "Operators allow us to perform math and make comparisons! In Python, we use standard math operators: + (addition), - (subtraction), * (multiplication), and / (division). Comparison operators like ==, !=, >, and < help evaluate relative parameters.",
      snippet: "a = 15\nb = 5\nsum_val = a * b\nprint(sum_val)",
      solutionCode: "a = 15\nb = 5\nsum_val = a / b\nprint(sum_val)",
      interactiveTask: "Modify the mathematical operator so the variable 'sum_val' equals the division 'a / b' and prints 3.0!",
      interactiveGoal: "a / b",
      quizzes: [
        { id: 1, question: "Which operator represents exponentiation (power rules)?", options: ["^", "**", "*", "//"], correctAnswerIndex: 1 },
        { id: 2, question: "What is the result of 11 % 3 (Modulo operator)?", options: ["3", "2", "1", "0"], correctAnswerIndex: 1 },
        { id: 3, question: "Which symbol evaluates equivalence check?", options: ["=", "==", "===", "equals"], correctAnswerIndex: 1 }
      ],
      assignment: {
        title: "Modulo Checker",
        description: "Perform arithmetic division of a variable number by modulo 2 to check if it's even. Set 'number = 10' and print 'number % 2'.",
        starterCode: "number = 10\nprint(number % 2)",
        goalDescription: "0"
      }
    };
  }

  // Python Chapter 5
  if (lang === "python" && raw.id === 5) {
    return {
      id: 5,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Medium",
      coinsReward: 50,
      estimatedTime: "10 min",
      explanation: "Decision making drives gameplay branches! Python uses if, elif (else if), and else branches. Indentation is mandatory! Every statement matching a conditional gate must be shifted right by exactly 4 spaces (or 1 tab). Lines declaring gates always terminate on a colon (:).",
      snippet: "score = 85\nif score >= 90:\n    print(\"Grade A\")\nelif score >= 80:\n    print(\"Grade B\")\nelse:\n    print(\"Grade C\")",
      solutionCode: "score = 95\nif score >= 90:\n    print(\"Grade A\")\nelif score >= 80:\n    print(\"Grade B\")\nelse:\n    print(\"Grade C\")",
      interactiveTask: "Set the initial score variable to 95 to verify the output updates to say 'Grade A' successfully!",
      interactiveGoal: "score = 95",
      quizzes: [
        { id: 1, question: "What determines block scope in conditional statements for Python?", options: ["Curly braces {}", "Consistent Indentation", "End keyword", "Parantheses ()"], correctAnswerIndex: 1 },
        { id: 2, question: "What represents the correct syntax for 'otherwise if' in Python conditions?", options: ["else if", "elseif", "elif", "elsif"], correctAnswerIndex: 2 }
      ],
      assignment: {
        title: "Traffic Light Sentinel",
        description: "Create a string variable 'light' set to 'green'. If light == 'green', print 'GO!'. Else, print 'STOP!'.",
        starterCode: "light = \"green\"\nif light == \"green\":\n    print(\"GO!\")\nelse:\n    print(\"STOP!\")",
        goalDescription: "GO!"
      }
    };
  }

  // Python Chapter 6
  if (lang === "python" && raw.id === 6) {
    return {
      id: 6,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Medium",
      coinsReward: 50,
      estimatedTime: "9 min",
      explanation: "Don't write duplicate lines of code! Loops let us repeat operations. A for loop runs a specified number of times, commonly utilizing python's range() function. A while loop loops continuously as long as its condition evaluates to True.",
      snippet: "# Count step values from 1 to 3\nfor i in range(1, 4):\n    print(\"Step:\", i)",
      solutionCode: "for i in range(1, 6):\n    print(\"Step:\", i)",
      interactiveTask: "Change the range boundaries inside range() to range(1, 6) so it prints up to count 5!",
      interactiveGoal: "range(1, 6)",
      quizzes: [
        { id: 1, question: "What range(1, 5) generates?", options: ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4", "1, 5"], correctAnswerIndex: 1 },
        { id: 2, question: "Which statement terminates a loop immediately?", options: ["continue", "break", "raise", "terminate"], correctAnswerIndex: 1 }
      ],
      assignment: {
        title: "Multiplier Sequence",
        description: "Implement a for loop to print numbers multiplied by 10 from 1 to 3.",
        starterCode: "for i in range(1, 4):\n    print(i * 10)",
        goalDescription: "30"
      }
    };
  }

  // Python Chapter 7
  if (lang === "python" && raw.id === 7) {
    return {
      id: 7,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Medium",
      coinsReward: 55,
      estimatedTime: "12 min",
      explanation: "Functions isolate code routines into reusable, named components. In Python, start with the 'def' keyword, the name, arguments inside parentheses, and a colon. Inside, code is indented. Use 'return' to pass a computed value back.",
      snippet: "def greet_dev(name):\n    return \"Welcome \" + name\n\nmessage = greet_dev(\"Alice\")\nprint(message)",
      solutionCode: "def greet_dev(name):\n    return \"Welcome \" + name\n\nmessage = greet_dev(\"Bob\")\nprint(message)",
      interactiveTask: "Change greet_dev parameter input from 'Alice' to 'Bob' and check the outputs!",
      interactiveGoal: "greet_dev(\"Bob\")",
      quizzes: [
        { id: 1, question: "Which keyword is utilized to define a function in Python?", options: ["function", "define", "def", "func"], correctAnswerIndex: 2 },
        { id: 2, question: "What specifies the return value of a function?", options: ["output", "return", "pass", "yield"], correctAnswerIndex: 1 }
      ],
      assignment: {
        title: "Double Math Function",
        description: "Define a function 'double_x(x)' that returns x multiplied by 2. Print double_x(50).",
        starterCode: "def double_x(x):\n    return x * 2\n\nprint(double_x(50))",
        goalDescription: "100"
      }
    };
  }

  // ============================================
  // JAVA CHAPTERS
  // ============================================

  // Java Chapter 1
  if (lang === "java" && raw.id === 1) {
    return {
      id: 1,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Easy",
      coinsReward: 35,
      estimatedTime: "5 min",
      explanation: "Welcome to Java! Java is a strictly-typed, robust, object-oriented language. Every Java file requires a high-level outer class matching the file name, containing the JVM entry method: public static void main(String[] args). Displaying statements requires System.out.println()!",
      snippet: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Java!\");\n    }\n}",
      solutionCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Java!\");\n    }\n}",
      interactiveTask: "Press RUN to execute your introductory Java app! Ensure the prints show 'Hello, Java!' and hit Check.",
      interactiveGoal: "Hello, Java!",
      quizzes: [
        { id: 1, question: "What does JVM stand for?", options: ["Java Virtual Machine", "Java Version Manager", "Java Variable Memory", "Just Value Machine"], correctAnswerIndex: 0 },
        { id: 2, question: "Which block serves as the compiler entry point?", options: ["public static void main(String[] args)", "void constructor()", "getSystem()", "class Main()"], correctAnswerIndex: 0 }
      ],
      assignment: {
        title: "Hello Java World",
        description: "Write a standard Java main method printing 'CodeNova Certified Sandbox Engineer' into console logs.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"CodeNova Certified Sandbox Engineer\");\n    }\n}",
        goalDescription: "CodeNova"
      }
    };
  }

  // Java Chapter 2
  if (lang === "java" && raw.id === 2) {
    return {
      id: 2,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Easy",
      coinsReward: 40,
      estimatedTime: "6 min",
      explanation: "Syntax rules are strict in Java! Curly brackets `{}` delineate scope blocks, variable properties demand type assignments, and every computational line MUST end in a semicolon (`;`). Semicolons keep parser compilers on track is key!",
      snippet: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Check semicolon syntax\");\n    }\n}",
      solutionCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Check semicolon syntax\");\n    }\n}",
      interactiveTask: "Confirm curly brackets and semicolons matches beautifully. Run code and submit verification!",
      interactiveGoal: "semicolon",
      quizzes: [
        { id: 1, question: "What character must terminate standard command lines in Java?", options: ["Period (.)", "Semicolon (;)", "Colon (:)", "Comma (,)"], correctAnswerIndex: 1 },
        { id: 2, question: "How are line comments designated inside Java code?", options: ["# comment", "/* comment", "// comment", "<!-- comment -->"], correctAnswerIndex: 2 }
      ],
      assignment: {
        title: "Correct Semicolon Sentry",
        description: "Fix or declare a Java Main script returning 'compiled' output.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"compiled\");\n    }\n}",
        goalDescription: "compiled"
      }
    };
  }

  // Java Chapter 3
  if (lang === "java" && raw.id === 3) {
    return {
      id: 3,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Easy",
      coinsReward: 40,
      estimatedTime: "8 min",
      explanation: "Java variables demand strict types! You must specify what data goes into your variable immediately: int (integers), double (decimals), boolean (True/False), and String (text blocks). You can never put a text string inside an int!",
      snippet: "public class Main {\n    public static void main(String[] args) {\n        int years = 21;\n        System.out.println(\"Age: \" + years);\n    }\n}",
      solutionCode: "public class Main {\n    public static void main(String[] args) {\n        int years = 25;\n        System.out.println(\"Age: \" + years);\n    }\n}",
      interactiveTask: "Change variable 'years' from 21 to 25 and click Check!",
      interactiveGoal: "years = 25",
      quizzes: [
        { id: 1, question: "Which is a primitive data type inside standard Java packages?", options: ["String", "int", "Scanner", "System"], correctAnswerIndex: 1 },
        { id: 2, question: "What text-based type leverages capital letter declaration prefix?", options: ["string", "String", "text", "Char"], correctAnswerIndex: 1 }
      ],
      assignment: {
        title: "Variable Math Box",
        description: "Set an integer 'score = 250' and display it using standard print syntax.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int score = 250;\n        System.out.println(score);\n    }\n}",
        goalDescription: "250"
      }
    };
  }

  // Java Chapter 4
  if (lang === "java" && raw.id === 4) {
    return {
      id: 4,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Easy",
      coinsReward: 40,
      estimatedTime: "7 min",
      explanation: "Arithmetic and logical operators do the calculations for your Java programs! Standard binary math uses + (addition), - (subtraction), * (multiplication), / (division) and % (modulo remainder checks).",
      snippet: "public class Main {\n    public static void main(String[] args) {\n        int sum = 50 + 50;\n        System.out.println(\"Result: \" + sum);\n    }\n}",
      solutionCode: "public class Main {\n    public static void main(String[] args) {\n        int sum = 50 * 2;\n        System.out.println(\"Result: \" + sum);\n    }\n}",
      interactiveTask: "Modify addition + to multiplication * inside your code, calculating '50 * 2'!",
      interactiveGoal: "sum = 50 * 2",
      quizzes: [
        { id: 1, question: "Which binary arithmetic operator checks remainder values?", options: ["/", "*", "%", "^"], correctAnswerIndex: 2 },
        { id: 2, question: "How is 'logical and' structured in Java evaluated gates?", options: ["and", "&&", "&", "||"], correctAnswerIndex: 1 }
      ],
      assignment: {
        title: "Java Arithmetic Multiply",
        description: "Multiply two integer variables, 15 and 4, printing the final result into command line buffers.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(15 * 4);\n    }\n}",
        goalDescription: "60"
      }
    };
  }

  // Java Chapter 5
  if (lang === "java" && raw.id === 5) {
    return {
      id: 5,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Medium",
      coinsReward: 45,
      estimatedTime: "9 min",
      explanation: "Inputs let you customize output behavior! While System.out prints parameters, reading user keyboard console input dynamically is done with java.util.Scanner. Scanner methods such as nextLine() or nextInt() grasp inputs safely.",
      snippet: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Scanner output loaded\");\n    }\n}",
      solutionCode: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Scanner output loaded\");\n    }\n}",
      interactiveTask: "Ensure Scanner imports reside safely at the top headers. Compile and click Check!",
      interactiveGoal: "Scanner",
      quizzes: [
        { id: 1, question: "Which class reads keyboard inputs in Java?", options: ["Reader", "Scanner", "Console", "System"], correctAnswerIndex: 1 },
        { id: 2, question: "Which package includes the high-level Scanner utilities?", options: ["java.lang", "java.io", "java.util", "java.net"], correctAnswerIndex: 2 }
      ],
      assignment: {
        title: "Mock User Input Response",
        description: "Instantiate a print returning exactly 'Scanner initialized' to satisfy structural requirements.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Scanner initialized\");\n    }\n}",
        goalDescription: "initialized"
      }
    };
  }

  // Java Chapter 6
  if (lang === "java" && raw.id === 6) {
    return {
      id: 6,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Medium",
      coinsReward: 45,
      estimatedTime: "10 min",
      explanation: "Take control of execution routes! Java conditions require if, else if, and else blocks. The conditions MUST be placed inside parentheses `( )`, and the matching behavior lines must reside within curly braces `{}`.",
      snippet: "public class Main {\n    public static void main(String[] args) {\n        int score = 88;\n        if (score >= 90) {\n            System.out.println(\"Grade A\");\n        } else {\n            System.out.println(\"Passed\");\n        }\n    }\n}",
      solutionCode: "public class Main {\n    public static void main(String[] args) {\n        int score = 95;\n        if (score >= 90) {\n            System.out.println(\"Grade A\");\n        } else {\n            System.out.println(\"Passed\");\n        }\n    }\n}",
      interactiveTask: "Alter variable score value to 95 so 'Grade A' activates in execution blocks!",
      interactiveGoal: "score = 95",
      quizzes: [
        { id: 1, question: "Which statement validates 'and otherwise' structures in Java?", options: ["elif", "else if", "elseif", "otherwise if"], correctAnswerIndex: 1 },
        { id: 2, question: "Are brackets recommended for single line if statements in Java?", options: ["No, it's prohibited", "Yes, they prevent major scope errors later", "They make code compile slower", "None of these"], correctAnswerIndex: 1 }
      ],
      assignment: {
        title: "Java Light Sentry",
        description: "Write code checking if integer intensity is greater than 10, print 'BRIGHT'. Otherwise, print 'DARK'.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int intensity = 12;\n        if (intensity > 10) {\n            System.out.println(\"BRIGHT\");\n        } else {\n            System.out.println(\"DARK\");\n        }\n    }\n}",
        goalDescription: "BRIGHT"
      }
    };
  }

  // Java Chapter 7
  if (lang === "java" && raw.id === 7) {
    return {
      id: 7,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Medium",
      coinsReward: 45,
      estimatedTime: "9 min",
      explanation: "Java loops automate repeating loops. Use a compact for loop: for(int i=1; i<=3; i++) specifying your limit criteria clearly, or a while (condition) loop for loops that rely on variables changing in memory.",
      snippet: "public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 3; i++) {\n            System.out.println(\"Loop step: \" + i);\n        }\n    }\n}",
      solutionCode: "public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println(\"Loop step: \" + i);\n        }\n    }\n}",
      interactiveTask: "Modify indices rules inside loop header declaring i <= 5 to count to 5 steps!",
      interactiveGoal: "i <= 5",
      quizzes: [
        { id: 1, question: "What is the standard structure of a standard for-loop header in Java?", options: ["for (int i; i < 5)", "for (int i = 0; i < 5; i++)", "for (i = 0; i to 5)", "for int i = 0 to 5"], correctAnswerIndex: 1 },
        { id: 2, question: "What fatal mistake causes infinite while-loops?", options: ["Missing class", "Failing to increment/modify control state parameters inside the block", "Using decimal variables", "Using print commands"], correctAnswerIndex: 1 }
      ],
      assignment: {
        title: "Loop Sum Accumulation",
        description: "Implement a loop summing numbers from 1 to 5, printing the final total (15) to System.out.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int i = 1; i <= 5; i++) {\n            total += i;\n        }\n        System.out.println(total);\n    }\n}",
        goalDescription: "15"
      }
    };
  }

  // Java Chapter 8
  if (lang === "java" && raw.id === 8) {
    return {
      id: 8,
      title: raw.title,
      description: raw.desc,
      level,
      difficulty: "Medium",
      coinsReward: 50,
      estimatedTime: "11 min",
      explanation: "Methods define behavioral capabilities inside Java classes! Methods list accessibility (public/private), return types (int, String, or void if nothing is returned), behavior name, arguments, and return rules.",
      snippet: "public class Main {\n    public static int multiply(int a, int b) {\n        return a * b;\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Result: \" + multiply(5, 5));\n    }\n}",
      solutionCode: "public class Main {\n    public static int multiply(int a, int b) {\n        return a * b;\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Result: \" + multiply(4, 5));\n    }\n}",
      interactiveTask: "Alter multiply method values inside print, computing 'multiply(4, 5)' returning 20!",
      interactiveGoal: "multiply(4, 5)",
      quizzes: [
        { id: 1, question: "What return type is listed for methods passing nothing back?", options: ["null", "void", "none", "empty"], correctAnswerIndex: 1 },
        { id: 2, question: "Which modifier allows methods to run without first initializing object instances?", options: ["abstract", "static", "private", "final"], correctAnswerIndex: 1 }
      ],
      assignment: {
        title: "Adder Method",
        description: "Create a static method 'addValues(int x, int y)' returning subtraction result or sum. Return 'addValues(120, 80)' sum (200).",
        starterCode: "public class Main {\n    public static int addValues(int x, int y) {\n        return x + y;\n    }\n    public static void main(String[] args) {\n        System.out.println(addValues(120, 80));\n    }\n}",
        goalDescription: "200"
      }
    };
  }

  // Default values for remaining chapters

  // Default values for remaining chapters
  const snippet = lang === "python" 
    ? `# Python ${raw.title}\n# Read instructions and write code below\nprint("Topic: ${raw.title} completed")`
    : `// Java ${raw.title}\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Topic: ${raw.title} completed");\n    }\n}`;

  return {
    id: raw.id,
    title: raw.title,
    description: raw.desc,
    level,
    difficulty,
    coinsReward: 40 + (raw.id * 2),
    estimatedTime: `${5 + (raw.id % 4) * 3} min`,
    explanation: `Learn the essential tools for ${raw.title} in ${lang === "python" ? "Python" : "Java"}. Understanding this topic enables high-fidelity structures, clean logical conditions, and ensures your educational milestones are achieved with optimized best practices.`,
    snippet,
    solutionCode: lang === "python" 
      ? `print("Topic: ${raw.title} completed")` 
      : `System.out.println("Topic: ${raw.title} completed");`,
    interactiveTask: "Press RUN to verify the default boilerplate syntax execution compiles cleanly, then submit for evaluations!",
    interactiveGoal: lang === "python" ? `print("Topic: ${raw.title} completed")` : "completed",
    quizzes: generateMockQuiz(raw.title, 10),
    assignment: {
      title: `${raw.title} Challenge`,
      description: `Write a clean program implementing standard logical representations of ${raw.title} returning a status of 'success'.`,
      starterCode: lang === "python" 
        ? `# Challenge starter for ${raw.title}\n`
        : `public class Main {\n    public static void main(String[] args) {\n        // Code here\n    }\n}`,
      goalDescription: "success"
    }
  };
}

export const pythonChapters: Chapter[] = pythonChaptersRaw.map((ch) => enrichChapter(ch, "python"));
export const javaChapters: Chapter[] = [];

export const getChaptersByLanguage = (language: "python" | "java"): Chapter[] => {
  return pythonChapters;
};
